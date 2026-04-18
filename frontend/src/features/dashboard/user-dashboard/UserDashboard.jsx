import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiDelete } from "../../../lib/api";
import Sidebar from "./components/Sidebar";
import OverviewTab from "./tabs/OverviewTab";
import BookingsTab from "./tabs/BookingsTab";
import ResourcesTab from "./tabs/ResourcesTab";
import TicketsTab from "./tabs/TicketsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import ProfileTab from "./tabs/ProfileTab";
import useUserDashboardData from "./hooks/useUserDashboardData";
import useProfileEditor from "./hooks/useProfileEditor";

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    () => location.state?.tab || "overview",
  );
  const [suspendBusy, setSuspendBusy] = useState(false);
  const [suspendError, setSuspendError] = useState("");
  const data = useUserDashboardData({ activeTab, navigate });

  const {
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
    filteredBookings,
    filteredTickets,
    filteredHalls,
    notificationFilters,
    filteredNotifications,
    totalBookingsCount,
    approvedBookingsCount,
    pendingBookingsCount,
  } = data;

  const {
    isProfileEditing,
    profileName,
    setProfileName,
    profileSaving,
    profileNotice,
    startProfileEdit,
    cancelProfileEdit,
    saveProfileChanges,
  } = useProfileEditor({ user, setLiveUser });

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleSuspendAccount = async () => {
    if (suspendBusy) return;
    const confirmed = window.confirm(
      "Suspend your SmartCampus account now? You can ask an administrator to reactivate it.",
    );
    if (!confirmed) return;

    setSuspendError("");
    setSuspendBusy(true);

    try {
      await apiDelete("/auth/me");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/");
    } catch {
      setSuspendError("Unable to suspend your account right now. Try again.");
    } finally {
      setSuspendBusy(false);
    }
  };

  if (!sessionUser) return null;

  const unreadCount = notifs.filter((n) => !n.read).length;
  const unreadNotifications = filteredNotifications.filter((n) => !n.read);
  const readNotifications = filteredNotifications.filter((n) => n.read);

  const navItems = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "bookings", icon: "📅", label: "My Bookings" },
    { id: "resources", icon: "🏛", label: "Resources" },
    { id: "tickets", icon: "🔧", label: "My Tickets" },
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
        background: "#F5F7FA",
        color: "#1A1D23",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif",
        display: "flex",
      }}
    >
      <Sidebar
        user={user}
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
        onLogout={handleLogout}
      />
      <main
        style={{
          marginLeft: 236,
          flex: 1,
          padding: "36px max(28px,3vw)",
          minHeight: "100vh",
        }}
      >
        {activeTab === "overview" && (
          <OverviewTab
            user={user}
            unreadCount={unreadCount}
            notifsLoading={notifsLoading}
            notifs={notifs}
            setActiveTab={setActiveTab}
            markOneRead={markOneRead}
          />
        )}
        {activeTab === "bookings" && (
          <BookingsTab
            bookingFilter={bookingFilter}
            setBookingFilter={setBookingFilter}
            filteredBookings={filteredBookings}
          />
        )}
        {activeTab === "resources" && (
          <ResourcesTab
            fetchResources={fetchResources}
            hallFilter={hallFilter}
            setHallFilter={setHallFilter}
            hallsError={hallsError}
            hallsLoading={hallsLoading}
            filteredHalls={filteredHalls}
          />
        )}
        {activeTab === "tickets" && (
          <TicketsTab
            ticketFilter={ticketFilter}
            setTicketFilter={setTicketFilter}
            filteredTickets={filteredTickets}
          />
        )}
        {activeTab === "notifications" && (
          <NotificationsTab
            notifsLoading={notifsLoading}
            notifsError={notifsError}
            unreadCount={unreadCount}
            notificationFilter={notificationFilter}
            setNotificationFilter={setNotificationFilter}
            notificationFilters={notificationFilters}
            filteredNotifications={filteredNotifications}
            unreadNotifications={unreadNotifications}
            readNotifications={readNotifications}
            markAllRead={markAllRead}
            markOneRead={markOneRead}
          />
        )}
        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            isProfileEditing={isProfileEditing}
            startProfileEdit={startProfileEdit}
            profileNotice={profileNotice}
            profileName={profileName}
            setProfileName={setProfileName}
            saveProfileChanges={saveProfileChanges}
            profileSaving={profileSaving}
            cancelProfileEdit={cancelProfileEdit}
            totalBookingsCount={totalBookingsCount}
            approvedBookingsCount={approvedBookingsCount}
            pendingBookingsCount={pendingBookingsCount}
            unreadCount={unreadCount}
            handleLogout={handleLogout}
            handleSuspendAccount={handleSuspendAccount}
            suspendBusy={suspendBusy}
            suspendError={suspendError}
          />
        )}
      </main>
    </div>
  );
}
