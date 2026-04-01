package com.wegroup423.smart_campus.features.booking.controller;

import com.wegroup423.smart_campus.features.booking.model.dto.request.BookingDecisionRequest;
import com.wegroup423.smart_campus.features.booking.model.dto.request.CreateBookingRequest;
import com.wegroup423.smart_campus.features.booking.model.dto.response.BookingResponse;
import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import com.wegroup423.smart_campus.features.booking.service.BookingService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public BookingResponse createBooking(@Valid @RequestBody CreateBookingRequest request, Authentication authentication) {
        String currentUserId = currentUserId(authentication);
        return bookingService.createBooking(request, currentUserId);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<BookingResponse> getAllBookings(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) BookingStatus status
    ) {
        return bookingService.getAllBookings(date, status);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public List<BookingResponse> getMyBookings(Authentication authentication) {
        String currentUserId = currentUserId(authentication);
        return bookingService.getBookingsByUser(currentUserId);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.name")
    public List<BookingResponse> getBookingsByUser(@PathVariable String userId) {
        return bookingService.getBookingsByUser(userId);
    }

    @PatchMapping("/{bookingId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public BookingResponse approveBooking(
            @PathVariable String bookingId,
            @Valid @RequestBody(required = false) BookingDecisionRequest request,
            Authentication authentication
    ) {
        String adminUserId = currentUserId(authentication);
        return bookingService.approveBooking(bookingId, adminUserId, request);
    }

    @PatchMapping("/{bookingId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public BookingResponse rejectBooking(
            @PathVariable String bookingId,
            @Valid @RequestBody(required = false) BookingDecisionRequest request,
            Authentication authentication
    ) {
        String adminUserId = currentUserId(authentication);
        return bookingService.rejectBooking(bookingId, adminUserId, request);
    }

    @PatchMapping("/{bookingId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public BookingResponse cancelBooking(@PathVariable String bookingId, Authentication authentication) {
        String currentUserId = currentUserId(authentication);
        return bookingService.cancelBooking(bookingId, currentUserId);
    }

    private String currentUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new IllegalStateException("Authenticated user identity is missing.");
        }
        return authentication.getName();
    }
}
