import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet, apiPatch } from "../../../../lib/api";
import { MOCK_BOOKINGS } from "../constants/mockData";
import { mapNotif } from "../utils/mapNotif";

export default function useUserDashboardData({ activeTab, navigate }) {
  const [liveUser, setLiveUser] = useState(null);
  const [notifs, setNotifs] = useState([]);
  const [notifsLoading, setNotifsLoading] = useState(false);
  const [notifsError, setNotifsError] = useState("");
  const [bookingFilter, setBookingFilter] = useState("All");
  const [ticketFilter, setTicketFilter] = useState("All");
  const [notificationFilter, setNotificationFilter] = useState("ALL");
  const [hallFilter, setHallFilter] = useState("ALL");
  const [halls, setHalls] = useState([]);
  const [hallsLoading, setHallsLoading] = useState(false);
  const [hallsError, setHallsError] = useState("");
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const bootstrappedRef = useRef(false);

  const sessionUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const token = sessionStorage.getItem("token");

  const fetchResources = useCallback(async () => {
    try {
      setHallsLoading(true);
      setHallsError("");
      const res = await apiGet("/resources");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.content)
          ? res.content
          : [];
      setHalls(list);
    } catch {
      setHallsError(
        "Facilities are unavailable for this account or could not be loaded.",
      );
      setHalls([]);
    } finally {
      setHallsLoading(false);
    }
  }, []);

  const fetchNotifs = useCallback(async () => {
    try {
      setNotifsLoading(true);
      setNotifsError("");
      const res = await apiGet("/notifications/my");
      const list = Array.isArray(res?.notifications) ? res.notifications : [];
      setNotifs(list.map(mapNotif));
    } catch {
      setNotifsError("Failed to load notifications.");
    } finally {
      setNotifsLoading(false);
    }
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      setTicketsLoading(true);
      const res = await apiGet("/tickets/my");
      setTickets(Array.isArray(res) ? res : []);
    } catch {
      setTickets([]);
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    if (!sessionUser) return navigate("/");
    if (token) {
      apiGet("/auth/me")
        .then((data) => {
          const userData = data?.user || data;
          if (userData?.name || userData?.email) {
            setLiveUser(userData);
            sessionStorage.setItem("user", JSON.stringify(userData));
          }
        })
        .catch(() => {});
      fetchNotifs();
      fetchTickets();
    }
  }, [sessionUser, token, navigate, fetchNotifs, fetchTickets]);

  useEffect(() => {
    if (activeTab === "resources" && halls.length === 0 && !hallsLoading)
      fetchResources();
  }, [activeTab, halls.length, hallsLoading, fetchResources]);

  const markOneRead = useCallback(async (id) => {
    try {
      await apiPatch(`/notifications/${id}/read`, {});
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await apiPatch("/notifications/my/read-all", {});
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  }, []);

  const user = liveUser || sessionUser || {};

  return {
    sessionUser,
    user,
    notifs,
    notifsLoading,
    notifsError,
    bookingFilter,
    setBookingFilter,
    ticketFilter,
    setTicketFilter,
    notificationFilter,
    setNotificationFilter,
    hallFilter,
    setHallFilter,
    hallsLoading,
    hallsError,
    fetchResources,
    markOneRead,
    markAllRead,
    setLiveUser,
    filteredBookings:
      bookingFilter === "All"
        ? MOCK_BOOKINGS
        : MOCK_BOOKINGS.filter((b) => b.status === bookingFilter),
    ticketsLoading,
    filteredTickets:
      ticketFilter === "All"
        ? tickets
        : tickets.filter((t) => t.status === ticketFilter),
    filteredHalls: halls.filter(
      (h) =>
        hallFilter === "ALL" ||
        (h.availability || "").toUpperCase() === hallFilter,
    ),
    notificationFilters: [
      "ALL",
      "BOOKING",
      "TICKET",
      "COMMENT",
      "GENERAL",
      "UNREAD",
    ],
    filteredNotifications: notifs.filter(
      (n) =>
        notificationFilter === "ALL" ||
        (notificationFilter === "UNREAD"
          ? !n.read
          : (n.type || "GENERAL") === notificationFilter),
    ),
    totalBookingsCount: MOCK_BOOKINGS.length,
    approvedBookingsCount: MOCK_BOOKINGS.filter((b) => b.status === "APPROVED")
      .length,
    pendingBookingsCount: MOCK_BOOKINGS.filter((b) => b.status === "PENDING")
      .length,
  };
}
