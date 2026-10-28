import apiInstance from "../apiInstance";
import { API_URLs } from "../apiUrls";
import { runApi } from "./serviceUtils";
export const fetchSetting = () => runApi(() => apiInstance.get(API_URLs.settings));
export const updateSetting = (body) => runApi(() => apiInstance.put(API_URLs.settings, body));
