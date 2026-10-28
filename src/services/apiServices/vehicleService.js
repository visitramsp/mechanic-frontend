import apiInstance from "../apiInstance";
import { API_URLs } from "../apiUrls";
import { cleanParams, runApi } from "./serviceUtils";

export const fetchVehicles = (params = {}) => runApi(() => apiInstance.get(API_URLs.vehicles, { params: cleanParams(params) }));
export const fetchVehicleById = (id) => runApi(() => apiInstance.get(`${API_URLs.vehicles}/${id}`));
export const fetchByIdCustomerBasedVehicle = (customerId) => runApi(() => apiInstance.get(`${API_URLs.vehicles}/customer/${customerId}`));
export const createVehicles = (body) => runApi(() => apiInstance.post(API_URLs.vehicles, body));
export const updateVehicles = (body, id) => runApi(() => apiInstance.patch(`${API_URLs.vehicles}/${id}`, body));
export const deleteVehicles = (id) => runApi(() => apiInstance.delete(`${API_URLs.vehicles}/${id}`));
export const lookupVehicle = (registrationNumber, legacy = false) => runApi(() => apiInstance.post(legacy ? API_URLs.vehicleLookup : API_URLs.dvlaSearch, { registrationNumber }));
export const fetchDvlaHistory = (params = {}) => runApi(() => apiInstance.get(API_URLs.dvlaHistory, { params: cleanParams(params) }));
