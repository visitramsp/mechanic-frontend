import apiInstance from "../apiInstance";
import { API_URLs } from "../apiUrls";
import { cleanParams, runApi } from "./serviceUtils";
export const submitContactEnquiry = (body) => runApi(() => apiInstance.post(API_URLs.contactEnquiries, body));
export const fetchContactEnquiries = (params = {}) => runApi(() => apiInstance.get(API_URLs.contactEnquiries, { params: cleanParams(params) }));
export const fetchContactEnquiryById = (id) => runApi(() => apiInstance.get(`${API_URLs.contactEnquiries}/${id}`));
export const updateContactEnquiry = (id, body) => runApi(() => apiInstance.patch(`${API_URLs.contactEnquiries}/${id}`, body));
export const deleteContactEnquiry = (id) => runApi(() => apiInstance.delete(`${API_URLs.contactEnquiries}/${id}`));
