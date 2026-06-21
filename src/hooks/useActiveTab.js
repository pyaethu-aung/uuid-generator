import { useState, useEffect, useCallback } from "react";
import { leafForPath, pathForLeaf, familyOfLeaf } from "../data/tabs";

function useActiveTab() {
  const [activeTab, setActiveTabState] = useState(() => {
    const { pathname } = window.location;
    const leaf = leafForPath(pathname);
    // Canonicalise on load: "/", a bare "/uuid", and every legacy path
    // (/generator, /validator, /bulk, /converter) rewrite to the new
    // family/mode scheme so the URL stays canonical and old bookmarks still
    // land in the right place.
    const canonical = pathForLeaf(leaf);
    if (pathname !== canonical) {
      window.history.replaceState(null, "", canonical);
    }
    return leaf;
  });

  // The last-used leaf per ID family, so clicking a family tab can return to
  // where the user left off (e.g. clicking UUID restores Validate). Recorded on
  // every navigation below; seeded from the initial (already-canonicalised)
  // path. Reading location here is a pure read, safe to repeat under StrictMode.
  const [lastLeafByFamily, setLastLeafByFamily] = useState(() => {
    const leaf = leafForPath(window.location.pathname);
    return { [familyOfLeaf(leaf).id]: leaf };
  });

  const recordLeaf = useCallback((leaf) => {
    setLastLeafByFamily((prev) => {
      const family = familyOfLeaf(leaf).id;
      return prev[family] === leaf ? prev : { ...prev, [family]: leaf };
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const leaf = leafForPath(window.location.pathname);
      setActiveTabState(leaf);
      recordLeaf(leaf);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [recordLeaf]);

  const setActiveTab = useCallback(
    (leaf) => {
      const path = pathForLeaf(leaf);
      if (window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      }
      setActiveTabState(leaf);
      recordLeaf(leaf);
    },
    [recordLeaf]
  );

  return { activeTab, setActiveTab, lastLeafByFamily };
}

export default useActiveTab;
