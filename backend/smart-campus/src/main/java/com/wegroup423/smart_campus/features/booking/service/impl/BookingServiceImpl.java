package com.wegroup423.smart_campus.features.booking.service.impl;

import com.wegroup423.smart_campus.features.admin.model.entity.Resource;
import com.wegroup423.smart_campus.features.admin.model.enums.ResourceAvailability;
import com.wegroup423.smart_campus.features.admin.repository.ResourceRepository;
import com.wegroup423.smart_campus.features.booking.exception.BookingConflictException;
import com.wegroup423.smart_campus.features.booking.exception.BookingNotFoundException;
import com.wegroup423.smart_campus.features.booking.exception.CapacityExceededException;
import com.wegroup423.smart_campus.features.booking.exception.InvalidBookingStateException;
import com.wegroup423.smart_campus.features.booking.exception.InvalidBookingTimeException;
import com.wegroup423.smart_campus.features.booking.exception.ResourceCapacityNotFoundException;
import com.wegroup423.smart_campus.features.booking.exception.UnauthorizedBookingActionException;
import com.wegroup423.smart_campus.features.booking.model.dto.request.BookingDecisionRequest;
import com.wegroup423.smart_campus.features.booking.model.dto.request.CreateBookingRequest;
import com.wegroup423.smart_campus.features.booking.model.dto.response.BookingResponse;
import com.wegroup423.smart_campus.features.booking.model.entity.Booking;
import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import com.wegroup423.smart_campus.features.booking.repository.BookingRepository;
import com.wegroup423.smart_campus.features.booking.service.BookingService;
import com.wegroup423.smart_campus.features.booking.service.ResourceCapacityProvider;
import com.wegroup423.smart_campus.features.notification.model.BookingNotificationEvent;
import com.wegroup423.smart_campus.features.notification.service.NotificationService;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class BookingServiceImpl implements BookingService {

    private static final List<BookingStatus> ACTIVE_STATUSES = List.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceCapacityProvider resourceCapacityProvider;
    private final NotificationService notificationService;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            ResourceRepository resourceRepository,
            ResourceCapacityProvider resourceCapacityProvider,
            NotificationService notificationService
    ) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.resourceCapacityProvider = resourceCapacityProvider;
        this.notificationService = notificationService;
    }

    @Override
    public BookingResponse createBooking(CreateBookingRequest request, String currentUserId) {
        validateResourceIsBookable(request.resourceId());
        validateTimeRange(request.startTime(), request.endTime());
        validateCapacity(request.resourceId(), request.expectedAttendees());
        validateNoOverlap(request.resourceId(), request.bookingDate(), request.startTime(), request.endTime());

        Instant now = Instant.now();
        Booking booking = Booking.builder()
                .resourceId(request.resourceId())
                .resourceType(request.resourceType())
                .userId(currentUserId)
                .bookingDate(request.bookingDate())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .purpose(request.purpose())
                .expectedAttendees(request.expectedAttendees())
                .status(BookingStatus.PENDING)
                .createdAt(now)
                .updatedAt(now)
                .build();

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyBookingEvent(new BookingNotificationEvent(
            "BOOKING_CREATED",
            saved.getId(),
            saved.getResourceId(),
            saved.getUserId(),
            saved.getStatus(),
            currentUserId,
            null,
            Instant.now()
        ));
        return toResponse(saved);
    }

    @Override
    public List<BookingResponse> getAllBookings(LocalDate bookingDate, BookingStatus status) {
        if (bookingDate != null && status != null) {
            return bookingRepository.findByBookingDateAndStatusOrderByStartTimeAsc(bookingDate, status)
                    .stream()
                    .map(this::toResponse)
                    .toList();
        }

        if (bookingDate != null) {
            return bookingRepository.findByBookingDateOrderByStartTimeAsc(bookingDate)
                    .stream()
                    .map(this::toResponse)
                    .toList();
        }

        if (status != null) {
            return bookingRepository.findByStatusOrderByBookingDateDescStartTimeDesc(status)
                    .stream()
                    .map(this::toResponse)
                    .toList();
        }

        return bookingRepository.findAll(Sort.by(Sort.Order.desc("bookingDate"), Sort.Order.desc("startTime")))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getBookingsByUser(String userId) {
        return bookingRepository.findByUserIdOrderByBookingDateDescStartTimeDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BookingResponse approveBooking(String bookingId, String adminUserId, BookingDecisionRequest request) {
        Booking booking = findBookingOrThrow(bookingId);
        validateResourceIsBookable(booking.getResourceId());
        transitionOrThrow(booking, BookingStatus.APPROVED);

        booking.setApprovedBy(adminUserId);
        booking.setRejectionReason(null);
        booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyBookingEvent(new BookingNotificationEvent(
            "BOOKING_APPROVED",
            saved.getId(),
            saved.getResourceId(),
            saved.getUserId(),
            saved.getStatus(),
            adminUserId,
            request == null ? null : request.reason(),
            Instant.now()
        ));
        return toResponse(saved);
    }

    @Override
    public BookingResponse rejectBooking(String bookingId, String adminUserId, BookingDecisionRequest request) {
        Booking booking = findBookingOrThrow(bookingId);
        transitionOrThrow(booking, BookingStatus.REJECTED);

        booking.setRejectedBy(adminUserId);
        booking.setRejectionReason(request == null ? null : request.reason());
        booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyBookingEvent(new BookingNotificationEvent(
            "BOOKING_REJECTED",
            saved.getId(),
            saved.getResourceId(),
            saved.getUserId(),
            saved.getStatus(),
            adminUserId,
            request == null ? null : request.reason(),
            Instant.now()
        ));
        return toResponse(saved);
    }

    @Override
    public BookingResponse cancelBooking(String bookingId, String currentUserId) {
        Booking booking = findBookingOrThrow(bookingId);
        if (!booking.getUserId().equals(currentUserId)) {
            throw new UnauthorizedBookingActionException("Users can only cancel their own bookings.");
        }

        transitionOrThrow(booking, BookingStatus.CANCELLED);
        booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyBookingEvent(new BookingNotificationEvent(
            "BOOKING_CANCELLED",
            saved.getId(),
            saved.getResourceId(),
            saved.getUserId(),
            saved.getStatus(),
            currentUserId,
            null,
            Instant.now()
        ));
        return toResponse(saved);
    }

    private Booking findBookingOrThrow(String bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found: " + bookingId));
    }

    private void transitionOrThrow(Booking booking, BookingStatus targetStatus) {
        if (!booking.getStatus().canTransitionTo(targetStatus)) {
            throw new InvalidBookingStateException(
                    "Invalid booking status transition from " + booking.getStatus() + " to " + targetStatus);
        }
        booking.setStatus(targetStatus);
    }

    private void validateTimeRange(java.time.LocalTime startTime, java.time.LocalTime endTime) {
        if (startTime == null || endTime == null || !startTime.isBefore(endTime)) {
            throw new InvalidBookingTimeException("startTime must be before endTime.");
        }
    }

    private void validateCapacity(String resourceId, Integer expectedAttendees) {
        int capacity = resourceCapacityProvider.getCapacityForResource(resourceId);
        if (expectedAttendees != null && expectedAttendees > capacity) {
            throw new CapacityExceededException(
                    "Expected attendees exceed resource capacity. Capacity: " + capacity);
        }
    }

    private void validateResourceIsBookable(String resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found: " + resourceId));

        if (resource.getAvailability() != ResourceAvailability.AVAILABLE) {
            throw new BookingConflictException("Resource is not currently available for booking.");
        }

        if (resource.getCapacity() == null || resource.getCapacity() <= 0) {
            throw new ResourceCapacityNotFoundException("Capacity is not configured for resource: " + resourceId);
        }
    }

    private void validateNoOverlap(String resourceId, LocalDate bookingDate, java.time.LocalTime startTime, java.time.LocalTime endTime) {
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                resourceId,
                bookingDate,
                startTime,
                endTime,
                ACTIVE_STATUSES
        );

        if (!overlaps.isEmpty()) {
            throw new BookingConflictException("An overlapping booking already exists for this resource.");
        }
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getResourceId(),
                booking.getResourceType(),
                booking.getUserId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getApprovedBy(),
                booking.getRejectedBy(),
                booking.getRejectionReason(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
