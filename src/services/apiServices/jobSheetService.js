import apiInstance from "../apiInstance";
import { API_URLs } from "../apiUrls";
import { cleanParams, runApi } from "./serviceUtils";

export const fetchJobSheets = (params = {}) => runApi(() => apiInstance.get(API_URLs.jobSheets, { params: cleanParams(params) }));
export const fetchJobSheetById = (id) => runApi(() => apiInstance.get(`${API_URLs.jobSheets}/${id}`));
export const createJobSheets = (body) => runApi(() => apiInstance.post(API_URLs.jobSheets, body));
export const updateJobSheets = (body, id) => runApi(() => apiInstance.patch(`${API_URLs.jobSheets}/${id}`, body));
export const updatePriorityStatusJobSheets = (id, body) => runApi(() => apiInstance.patch(`${API_URLs.jobSheets}/${id}/priority`, body));
export const updateStatusJobSheets = (id, body) => runApi(() => apiInstance.patch(`${API_URLs.jobSheets}/${id}/status`, body));
