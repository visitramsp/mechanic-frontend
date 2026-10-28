import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const isSafeInternalPath = (value) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//");

export default function useSafeReturn(fallbackPath) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    const routeStatePath = location.state?.from;
    const target = isSafeInternalPath(routeStatePath) && routeStatePath !== location.pathname
      ? routeStatePath
      : fallbackPath;

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Clear a stale modal/menu scroll lock before leaving a form page.
    document.body.style.removeProperty("overflow");

    navigate(target, {
      replace: true,
      flushSync: true,
      state: { returnedFromForm: true },
    });
  }, [fallbackPath, location.pathname, location.state?.from, navigate]);
}
