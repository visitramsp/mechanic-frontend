import apiInstance from "../apiInstance";
import { API_URLs } from "../apiUrls";
import { cleanParams, runApi } from "./serviceUtils";
export const fetchUsers = (params = {}) => runApi(() => apiInstance.get(API_URLs.users, { params: cleanParams(params) }));
export const createUser = (body) => runApi(() => apiInstance.post(API_URLs.users, body));
export const updateUser = (id, body) => runApi(() => apiInstance.patch(`${API_URLs.users}/${id}`, body));
export const resetUserPassword = (id, password) => runApi(() => apiInstance.patch(`${API_URLs.users}/${id}/password`, { password }));
export const deleteUser = (id) => runApi(() => apiInstance.delete(`${API_URLs.users}/${id}`));
