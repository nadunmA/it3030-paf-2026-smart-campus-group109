package com.wegroup423.smart_campus.features.booking.service;

import com.wegroup423.smart_campus.features.booking.model.dto.request.BookingDecisionRequest;
import com.wegroup423.smart_campus.features.booking.model.dto.request.CreateBookingRequest;
import com.wegroup423.smart_campus.features.booking.model.dto.response.BookingResponse;
import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    BookingResponse createBooking(CreateBookingRequest request, String currentUserId);

    List<BookingResponse> getAllBookings(LocalDate bookingDate, BookingStatus status);

    List<BookingResponse> getBookingsByUser(String userId);

    BookingResponse approveBooking(String bookingId, String adminUserId, BookingDecisionRequest request);

    BookingResponse rejectBooking(String bookingId, String adminUserId, BookingDecisionRequest request);

    BookingResponse cancelBooking(String bookingId, String currentUserId);
}
