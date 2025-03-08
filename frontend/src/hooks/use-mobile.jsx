import React, { useEffect, useState } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);

    // Check initial match
    updateMatch();

    // Set up event listener for resizing
    media.addEventListener("change", updateMatch);

    // Cleanup listener on component unmount
    return () => media.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
}
