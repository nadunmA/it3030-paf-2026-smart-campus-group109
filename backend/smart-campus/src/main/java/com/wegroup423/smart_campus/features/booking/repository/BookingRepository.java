package com.wegroup423.smart_campus.features.booking.repository;

import com.wegroup423.smart_campus.features.booking.model.entity.Booking;
import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserIdOrderByBookingDateDescStartTimeDesc(String userId);

    List<Booking> findByStatusOrderByBookingDateDescStartTimeDesc(BookingStatus status);

    List<Booking> findByBookingDateOrderByStartTimeAsc(LocalDate bookingDate);

    List<Booking> findByBookingDateAndStatusOrderByStartTimeAsc(LocalDate bookingDate, BookingStatus status);

    @Query("{ 'resourceId': ?0, 'bookingDate': ?1, 'status': { '$in': ?4 }, 'startTime': { '$lt': ?3 }, 'endTime': { '$gt': ?2 } }")
    List<Booking> findOverlappingBookings(
            String resourceId,
            LocalDate bookingDate,
            LocalTime startTime,
            LocalTime endTime,
            Collection<BookingStatus> statuses
    );
}
