import apiInstance from "../apiInstance";
import { API_URLs } from "../apiUrls";
import { runApi } from "./serviceUtils";

export const loginAPI = (body) => runApi(() => apiInstance.post(API_URLs.auth.login, body));
export const registerAPI = (body) => runApi(() => apiInstance.post(API_URLs.auth.register, body));
export const getMeAPI = () => runApi(() => apiInstance.get(API_URLs.auth.me));
export const logoutAPI = () => runApi(() => apiInstance.post(API_URLs.auth.logout));
