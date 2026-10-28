import apiInstance from "../apiInstance";
import { API_URLs } from "../apiUrls";
import { cleanParams, runApi } from "./serviceUtils";

export const fetchEstimates = (params = {}) => runApi(() => apiInstance.get(API_URLs.estimates, { params: cleanParams(params) }));
export const fetchEstimateById = (id) => runApi(() => apiInstance.get(`${API_URLs.estimates}/${id}`));
export const createEstimates = (body) => runApi(() => apiInstance.post(API_URLs.estimates, body));
export const updateEstimate = (body, id) => runApi(() => apiInstance.patch(`${API_URLs.estimates}/${id}`, body));
export const deleteEstimates = (id) => runApi(() => apiInstance.delete(`${API_URLs.estimates}/${id}`));
export const approvedEstimates = (id, body) => runApi(() => apiInstance.patch(`${API_URLs.estimates}/${id}/status`, body));
