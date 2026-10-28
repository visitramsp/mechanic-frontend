import apiInstance from "../apiInstance";
import { API_URLs } from "../apiUrls";
import { cleanParams, runApi } from "./serviceUtils";

export const fetchCustomers = (params = {}) => {
  const query = typeof params === "string" ? { search: params } : params;
  return runApi(() => apiInstance.get(API_URLs.customers, { params: cleanParams(query) }));
};
export const fetchCustomerById = (id) => runApi(() => apiInstance.get(`${API_URLs.customers}/${id}`));
export const createCustomers = (body) => runApi(() => apiInstance.post(API_URLs.customers, body));
export const updateCustomers = (body, id) => runApi(() => apiInstance.patch(`${API_URLs.customers}/${id}`, body));
export const deleteCustomers = (id) => runApi(() => apiInstance.delete(`${API_URLs.customers}/${id}`));
