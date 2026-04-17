import { useState } from "react";
import { apiPut } from "../../../../lib/api";

export default function useProfileEditor({ user, setLiveUser }) {
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState({ type: "", text: "" });

  const startProfileEdit = () => {
    setProfileName(user.name || "");
    setProfileNotice({ type: "", text: "" });
    setIsProfileEditing(true);
  };

  const cancelProfileEdit = () => {
    setProfileName(user.name || "");
    setProfileNotice({ type: "", text: "" });
    setIsProfileEditing(false);
  };

  const saveProfileChanges = async () => {
    try {
      setProfileSaving(true);
      setProfileNotice({ type: "", text: "" });
      const updated = await apiPut("/auth/me", {
        name: (profileName || "").trim(),
      });
      const userData = updated?.user || updated;
      setLiveUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
      setIsProfileEditing(false);
      setProfileNotice({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (e) {
      console.error("Failed to update profile", e);
      setProfileNotice({ type: "error", text: "Failed to update profile." });
    } finally {
      setProfileSaving(false);
    }
  };

  return {
    isProfileEditing,
    profileName,
    setProfileName,
    profileSaving,
    profileNotice,
    startProfileEdit,
    cancelProfileEdit,
    saveProfileChanges,
  };
}
