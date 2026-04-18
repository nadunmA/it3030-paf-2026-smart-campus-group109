import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPatch } from "../../../lib/api";
import NotificationsTab from "./components/NotificationsTab";
import OverviewTab from "./components/OverviewTab";
import ProfileTab from "./components/ProfileTab";
import TechnicianSidebar from "./components/TechnicianSidebar";
import TicketsTab from "./components/TicketsTab";
import { C } from "./components/TechnicianUi";
import UpdateModal from "./components/UpdateModal";

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [ticketFilter, setTicketFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [notifsLoading, setNotifsLoading] = useState(false);
  const [error, setError] = useState("");

  const rawUser = sessionStorage.getItem("user") || "null";
  const user = useMemo(() => {
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }, [rawUser]);

  const isTechnician = (user?.role || "").toUpperCase() === "TECHNICIAN";

  useEffect(() => {
    if (!isTechnician) {
      navigate("/");
      return;
    }
    loadData();
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, [isTechnician, navigate]);

  const loadData = async () => {
    await Promise.all([loadTickets(), loadNotifications()]);
  };

  const loadTickets = async () => {
    setTicketsLoading(true);
    try {
      const res = await apiGet("/tickets/assigned");
      setTickets(Array.isArray(res) ? res : res?.tickets || []);
    } catch (e) {
      console.error("Tickets fetch failed:", e);
    } finally {
      setTicketsLoading(false);
    }
  };

  const loadNotifications = async () => {
    setNotifsLoading(true);
    try {
      const res = await apiGet("/notifications/my");
      setNotifications(Array.isArray(res) ? res : res?.notifications || []);
    } catch (e) {
      console.error("Notifs fetch failed:", e);
    } finally {
      setNotifsLoading(false);
    }
  };

  const handleUpdateTicket = async (ticketId, payload) => {
    try {
      const updated = await apiPatch(`/tickets/${ticketId}/status`, payload);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, ...updated } : t)),
      );
    } catch (e) {
      console.error("Update failed:", e);
      setError("Failed to update ticket.");
    }
  };

  const markAllRead = async () => {
    try {
      await apiPatch("/notifications/my/read-all", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      setError("Failed to mark notifications as read.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  if (!isTechnician) {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredTickets =
    ticketFilter === "All"
      ? tickets
      : tickets.filter((t) => t.status === ticketFilter);

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  const navItems = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "tickets", icon: "🔧", label: "Assigned Tickets" },
    {
      id: "notifications",
      icon: "🔔",
      label: "Notifications",
      badge: unreadCount,
    },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
        display: "flex",
        opacity: loaded ? 1 : 0,
        transition: "opacity .5s ease",
      }}
    >
      <TechnicianSidebar
        user={user}
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
        onLogout={handleLogout}
      />

      <main
        style={{
          marginLeft: 224,
          flex: 1,
          padding: "28px max(24px,3vw)",
          minHeight: "100vh",
        }}
      >
        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 10,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              fontSize: 13,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {error}
            <span
              onClick={() => setError("")}
              style={{ cursor: "pointer", fontSize: 16, lineHeight: 1 }}
            >
              ×
            </span>
          </div>
        )}

        {activeTab === "overview" && (
          <OverviewTab
            user={user}
            tickets={tickets}
            notifications={notifications}
            ticketsLoading={ticketsLoading}
            notifsLoading={notifsLoading}
            openCount={openCount}
            inProgCount={inProgCount}
            resolvedCount={resolvedCount}
            setActiveTab={setActiveTab}
            setSelectedTicket={setSelectedTicket}
          />
        )}

        {activeTab === "tickets" && (
          <TicketsTab
            ticketFilter={ticketFilter}
            setTicketFilter={setTicketFilter}
            ticketsLoading={ticketsLoading}
            filteredTickets={filteredTickets}
            setSelectedTicket={setSelectedTicket}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationsTab
            unreadCount={unreadCount}
            markAllRead={markAllRead}
            notifsLoading={notifsLoading}
            notifications={notifications}
          />
        )}

        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            tickets={tickets}
            inProgCount={inProgCount}
            resolvedCount={resolvedCount}
            handleLogout={handleLogout}
          />
        )}
      </main>

      {selectedTicket && (
        <UpdateModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onSave={handleUpdateTicket}
        />
      )}
    </div>
  );
}
