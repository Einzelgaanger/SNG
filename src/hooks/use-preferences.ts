import { useCallback, useEffect, useState } from "react";

import {
  Preferences,
  getPreferences,
  setPreferences as writePreferences,
  subscribePreferences,
} from "@/lib/preferences-store";

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(() => getPreferences());

  useEffect(() => subscribePreferences(() => setPrefs(getPreferences())), []);

  const update = useCallback((patch: Partial<Preferences>) => {
    const next = { ...getPreferences(), ...patch };
    writePreferences(next);
  }, []);

  return { prefs, update };
}
