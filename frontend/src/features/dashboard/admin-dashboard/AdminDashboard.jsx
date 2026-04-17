import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPatch } from "../../../lib/api";
import UserList from "../../userManagement/UserList";
import ActivityTab from "./components/ActivityTab";
import AdminSidebar from "./components/AdminSidebar";
import { C } from "./components/AdminUi";
import BookingsTab from "./components/BookingsTab";
import OverviewTab from "./components/OverviewTab";
import ProfileTab from "./components/ProfileTab";
import ResourcesTab from "./components/ResourcesTab";
import TicketsTab from "./components/TicketsTab";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [userActionError, setUserActionError] = useState("");
  const [userActionBusyId, setUserActionBusyId] = useState("");

  const [bookingFilter, setBookingFilter] = useState("All");
  const [ticketFilter, setTicketFilter] = useState("All");
  const [resourceFilter, setResourceFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");

  const rawUser = sessionStorage.getItem("user") || "null";
  const user = useMemo(() => {
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }, [rawUser]);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setLoadError("");

        const [b, t, r, u, a] = await Promise.allSettled([
          apiGet("/admin/bookings"),
          apiGet("/admin/tickets"),
          apiGet("/resources"),
          apiGet("/admin/users"),
          apiGet("/admin/activity"),
        ]);

        const okValue = (result) =>
          result.status === "fulfilled" ? result.value : [];

        const toList = (x) =>
          Array.isArray(x) ? x : Array.isArray(x?.data) ? x.data : [];

        setBookings(toList(okValue(b)));
        setTickets(toList(okValue(t)));
        setResources(toList(okValue(r)));
        setUsers(toList(okValue(u)));
        setActivity(toList(okValue(a)));

        const failed = [b, t, r, u, a].filter((x) => x.status === "rejected");
        if (failed.length > 0) {
          setLoadError(
            `Some admin data failed to load (${failed.length}/5). Check backend and auth token.`,
          );
          failed.forEach((x) => console.error(x.reason));
        }
      } catch (e) {
        console.error(e);
        setLoadError("Failed to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, isAdmin]);

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          display: "grid",
          placeItems: "center",
          padding: 24,
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
          color: C.text,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 360,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            padding: "26px 24px",
            boxShadow: "0 10px 30px rgba(15,23,42,.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              margin: "0 auto 14px",
              border: `3px solid ${C.blueBd}`,
              borderTopColor: C.blue,
              animation: "spin 0.8s linear infinite",
            }}
          />
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
            Loading admin dashboard
          </div>
          <div style={{ fontSize: 13, color: C.muted }}>
            Please wait while we load your data.
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;

  const filteredBookings =
    bookingFilter === "All"
      ? bookings
      : bookings.filter((b) => b.status === bookingFilter);

  const filteredTickets =
    ticketFilter === "All"
      ? tickets
      : tickets.filter((t) => t.status === ticketFilter);

  const filteredResources =
    resourceFilter === "All"
      ? resources
      : resources.filter((r) => r.type === resourceFilter);

  const profileCounts = {
    bookings: bookings.length,
    tickets: tickets.length,
    resources: resources.length,
    activity: activity.length,
  };

  const updateUserInState = (userId, patch) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
    );
  };

  const handleRoleChange = async (userId, role) => {
    try {
      setUserActionError("");
      setUserActionBusyId(userId);
      const updated = await apiPatch(`/admin/users/${userId}/role`, { role });
      updateUserInState(userId, {
        role: updated?.role || role,
        active:
          typeof updated?.active === "boolean"
            ? updated.active
            : users.find((u) => u.id === userId)?.active,
      });
    } catch (e) {
      console.error(e);
      setUserActionError("Failed to update user role.");
    } finally {
      setUserActionBusyId("");
    }
  };

  const handleToggleActive = async (targetUser) => {
    try {
      setUserActionError("");
      setUserActionBusyId(targetUser.id);
      const nextActive = !targetUser.active;
      const updated = await apiPatch(`/admin/users/${targetUser.id}/active`, {
        active: nextActive,
      });
      updateUserInState(targetUser.id, {
        active:
          typeof updated?.active === "boolean" ? updated.active : nextActive,
        role: updated?.role || targetUser.role,
      });
    } catch (e) {
      console.error(e);
      setUserActionError("Failed to update user status.");
    } finally {
      setUserActionBusyId("");
    }
  };

  const navItems = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "bookings", icon: "📅", label: "Bookings", badge: pendingBookings },
    { id: "tickets", icon: "🔧", label: "Tickets" },
    { id: "resources", icon: "📦", label: "Resources" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "activity", icon: "📋", label: "Activity Log" },
  ];

  const btnPrimary = {
    padding: "9px 20px",
    borderRadius: 99,
    background: C.blue,
    color: "#fff",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all .15s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
        display: "flex",
      }}
    >
      <AdminSidebar
        user={user}
        nav={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onHome={() => navigate("/")}
        onLogout={handleLogout}
      />

      <main
        style={{
          marginLeft: 220,
          flex: 1,
          padding: "28px max(24px,3vw)",
          minHeight: "100vh",
        }}
      >
        {activeTab === "overview" && (
          <OverviewTab
            bookings={bookings}
            tickets={tickets}
            users={users}
            pendingBookings={pendingBookings}
            setActiveTab={setActiveTab}
            navigate={navigate}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsTab
            loadError={loadError}
            bookingFilter={bookingFilter}
            setBookingFilter={setBookingFilter}
            filteredBookings={filteredBookings}
            btnPrimary={btnPrimary}
          />
        )}

        {activeTab === "tickets" && (
          <TicketsTab
            ticketFilter={ticketFilter}
            setTicketFilter={setTicketFilter}
            filteredTickets={filteredTickets}
          />
        )}

        {activeTab === "resources" && (
          <ResourcesTab
            navigate={navigate}
            resourceFilter={resourceFilter}
            setResourceFilter={setResourceFilter}
            filteredResources={filteredResources}
            btnPrimary={btnPrimary}
          />
        )}

        {activeTab === "users" && (
          <UserList
            users={users}
            onRoleChange={handleRoleChange}
            onToggleActive={handleToggleActive}
            busyId={userActionBusyId}
            error={userActionError}
          />
        )}

        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            bookingCount={profileCounts.bookings}
            ticketCount={profileCounts.tickets}
            resourceCount={profileCounts.resources}
            activityCount={profileCounts.activity}
            handleLogout={handleLogout}
          />
        )}

        {activeTab === "activity" && (
          <ActivityTab activity={activity} loadError={loadError} />
        )}
      </main>
    </div>
  );
}
