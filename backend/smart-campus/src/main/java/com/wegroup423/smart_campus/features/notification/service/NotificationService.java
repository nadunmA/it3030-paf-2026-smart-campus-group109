package com.wegroup423.smart_campus.features.notification.service;

import com.wegroup423.smart_campus.features.notification.model.BookingNotificationEvent;

public interface NotificationService {

    void notifyBookingEvent(BookingNotificationEvent event);
}
