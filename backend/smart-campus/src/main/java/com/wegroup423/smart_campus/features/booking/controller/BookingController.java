package com.wegroup423.smart_campus.features.booking.controller;

import com.wegroup423.smart_campus.features.booking.model.dto.request.CreateBookingRequest;
import com.wegroup423.smart_campus.features.booking.model.dto.response.BookingResponse;
import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import com.wegroup423.smart_campus.features.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    private String resolveUserId(Object principal) {
        if (principal instanceof com.wegroup423.smart_campus.features.auth.model.User user) {
            return user.getId();
        }
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails ud) {
            return ud.getUsername();
        }
        return principal.toString();
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody CreateBookingRequest request) {
        String userId = resolveUserId(principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request, userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) BookingStatus status) {
        return ResponseEntity.ok(bookingService.getAllBookings(date, status));
    }

    @GetMapping("/me")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal Object principal) {
        String userId = resolveUserId(principal);
        return ResponseEntity.ok(bookingService.getBookingsForUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> approveBooking(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String adminId = resolveUserId(principal);
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(bookingService.approveBooking(id, adminId, reason));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> rejectBooking(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String adminId = resolveUserId(principal);
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(bookingService.rejectBooking(id, adminId, reason));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @AuthenticationPrincipal Object principal,
            @PathVariable String id) {
        String userId = resolveUserId(principal);
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }
}
