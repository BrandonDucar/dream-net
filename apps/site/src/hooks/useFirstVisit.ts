import { useState, useEffect } from "react";

export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const visited = localStorage.getItem("dreamnet_visited");
    const visitTimestamp = localStorage.getItem("dreamnet_visit_timestamp");
    
    // If no visit record, it's a first visit
    if (!visited) {
      setIsFirstVisit(true);
      setIsLoading(false);
      return;
    }

    // Optional: Show welcome again if it's been > 30 days
    if (visitTimestamp) {
      const daysSinceVisit = (Date.now() - parseInt(visitTimestamp)) / (1000 * 60 * 60 * 24);
      if (daysSinceVisit > 30) {
        setIsFirstVisit(true);
        setIsLoading(false);
        return;
      }
    }

    setIsFirstVisit(false);
    setIsLoading(false);
  }, []);

  const dismiss = () => {
    setIsFirstVisit(false);
    localStorage.setItem("dreamnet_visited", "true");
    localStorage.setItem("dreamnet_visit_timestamp", Date.now().toString());
  };

  return { isFirstVisit, isLoading, dismiss };
}

