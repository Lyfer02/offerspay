import API from "../axios";
import { endpoints } from "../endPoints";

export const trackingService = {
  generateLink: (formData) => {
    return API.post(endpoints.tracking.generate_link, formData);
  },

  clicks: (page = 1, filters = {}) => {
    const params = buildDateParams(filters);
    return API.get(endpoints.tracking.clicks, { params: { page, ...params } });
  },

  shortLinks: (page = 1, filters = {}) => {
    const params = buildDateParams(filters);
    return API.get(endpoints.tracking.shortLinkHistory, {
      params: { page, ...params },
    });
  },
};

// ✅ Helper for consistent date handling
function buildDateParams(filters) {
  const today = new Date();

  let startDate = filters.startDate || filters.fromDate || today;
  let endDate = filters.endDate || filters.toDate || today;

  // Convert to Date objects if string
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // Normalize times
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  // Swap if reversed
  if (startDate > endDate) {
    const temp = startDate;
    startDate = endDate;
    endDate = temp;
  }

  const params = {
    ...filters,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };

  // 🧩 TEMP LOG — REMOVE LATER
 
   // console.log("📤 trackingService params:", params);

  return params;
}
