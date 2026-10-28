const cacheKey = (scope, id) => `prestigeworkshops:edit:${scope}:${id}`;

export const resolveEditRecord = (scope, id, routeRecord) => {
  if (!id) return routeRecord || {};
  try {
    if (routeRecord) {
      sessionStorage.setItem(cacheKey(scope, id), JSON.stringify(routeRecord));
      return routeRecord;
    }
    return JSON.parse(sessionStorage.getItem(cacheKey(scope, id)) || "{}") || {};
  } catch {
    return routeRecord || {};
  }
};

export const clearEditRecord = (scope, id) => {
  if (!id) return;
  try {
    sessionStorage.removeItem(cacheKey(scope, id));
  } catch {
    // Session storage can be unavailable in strict privacy modes.
  }
};
