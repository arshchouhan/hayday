export const DASHBOARD_CACHE = {
    formData: null,
    pages: new Map(),
    uiState: null,
};

/** Call this on login / logout or when data changes to prevent stale data. */
export function clearDashboardCache() {
    DASHBOARD_CACHE.formData = null;
    DASHBOARD_CACHE.pages.clear();
    DASHBOARD_CACHE.uiState = null;
}
