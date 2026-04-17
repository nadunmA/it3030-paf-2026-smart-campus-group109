package com.wegroup423.smart_campus.features.booking.service;

import com.wegroup423.smart_campus.features.booking.model.dto.request.CreateBookingRequest;
import com.wegroup423.smart_campus.features.booking.model.dto.response.BookingResponse;
import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    BookingResponse createBooking(CreateBookingRequest request, String userId);

    List<BookingResponse> getAllBookings(LocalDate date, BookingStatus status);

    List<BookingResponse> getBookingsForUser(String userId);

    BookingResponse getBookingById(String id);

    BookingResponse approveBooking(String id, String adminId, String reason);

    BookingResponse rejectBooking(String id, String adminId, String reason);

    BookingResponse cancelBooking(String id, String userId);
}
