package com.wegroup423.smart_campus.features.booking.repository;

import com.wegroup423.smart_campus.features.booking.model.entity.Booking;
import com.wegroup423.smart_campus.features.booking.model.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByResourceId(String resourceId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query("{ 'resourceId': ?0, 'bookingDate': ?1, " +
           "'status': { $in: ?4 }, " +
           "$or: [ " +
           "  { 'startTime': { $lt: ?3 }, 'endTime': { $gt: ?2 } } " +
           "] }")
    List<Booking> findOverlappingBookings(String resourceId,
                                          LocalDate date,
                                          LocalTime startTime,
                                          LocalTime endTime,
                                          List<BookingStatus> statusList);
}
