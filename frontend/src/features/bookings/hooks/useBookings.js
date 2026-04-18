import { useCallback, useEffect, useState } from "react";

export default function useBookings(fetcher, autoLoad = true) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState("");

  const load = useCallback(
    async (params) => {
      setLoading(true);
      setError("");
      try {
        const data = await fetcher(params);
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    },
    [fetcher],
  );

  useEffect(() => {
    if (!autoLoad) return;
    load();
  }, [autoLoad, load]);

  return { bookings, setBookings, loading, error, load };
}
