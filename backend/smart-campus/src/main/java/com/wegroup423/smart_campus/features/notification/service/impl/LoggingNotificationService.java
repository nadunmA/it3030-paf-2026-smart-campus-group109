package com.wegroup423.smart_campus.features.notification.service.impl;

import com.wegroup423.smart_campus.features.notification.model.BookingNotificationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LoggingNotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoggingNotificationService.class);

    public void notifyBookingEvent(BookingNotificationEvent event) {
        LOGGER.info(
                "Booking notification hook triggered: action={}, bookingId={}, resourceId={}, ownerUserId={}, status={}, triggeredBy={}, reason={}",
                event.action(),
                event.bookingId(),
                event.resourceId(),
                event.ownerUserId(),
                event.status(),
                event.triggeredBy(),
                event.reason()
        );
    }
}
