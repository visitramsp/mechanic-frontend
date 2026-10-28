import apiInstance from "../apiInstance";
import { API_URLs } from "../apiUrls";
import { cleanParams, runApi } from "./serviceUtils";

export const fetchInvoices = (params = {}) => runApi(() => apiInstance.get(API_URLs.invoices, { params: cleanParams(params) }));
export const fetchInvoiceById = (id) => runApi(() => apiInstance.get(`${API_URLs.invoices}/${encodeURIComponent(id)}`));
export const createInvoice = (body) => runApi(() => apiInstance.post(API_URLs.invoices, body));
export const updateInvoice = (id, body) => runApi(() => apiInstance.patch(`${API_URLs.invoices}/${encodeURIComponent(id)}`, body));
export const deleteInvoice = (id) => runApi(() => apiInstance.delete(`${API_URLs.invoices}/${encodeURIComponent(id)}`));
export const updateInvoiceStatus = (id, status) => runApi(() => apiInstance.patch(`${API_URLs.invoices}/${encodeURIComponent(id)}/status`, { status }));
export const addInvoicePayment = (id, body) => runApi(() => apiInstance.post(`${API_URLs.invoices}/${encodeURIComponent(id)}/payment`, body));
export const createInvoiceFromJobSheet = (jobSheetId) => runApi(() => apiInstance.post(`${API_URLs.invoices}/from-job-sheet/${jobSheetId}`));
