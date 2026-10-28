import apiInstance from "../apiInstance";
import { API_URLs } from "../apiUrls";
import { runApi } from "./serviceUtils";
export const fetchDashboard = () => runApi(() => apiInstance.get(API_URLs.dashboard));
