export function mapNotif(n) {
  return {
    id: n.id,
    type: n.type || "GENERAL",
    text: n.title
      ? `${n.title}${n.message ? " — " + n.message : ""}`
      : n.message || "",
    time: n.createdAt ? new Date(n.createdAt).toLocaleString() : "now",
    read: Boolean(n.read),
  };
}
