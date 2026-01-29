import { useEffect, useState } from "react";

export default function useBans() {
  const [bans, setBans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBans = () => {
      fetch(`${import.meta.env.VITE_API_URL_DOCKER}/bans`)
        .then((res) => {
          if (!res.ok) throw new Error("API error");
          return res.json();
        })
        .then((data) => {
          if (isMounted) {
            setBans(data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
          if (isMounted) {
            setError(err);
            setLoading(false);
          }
        });
    };
    fetchBans();

    const interval = setInterval(fetchBans, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { bans, loading, error };
}
