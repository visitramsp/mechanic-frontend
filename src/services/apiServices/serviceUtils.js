import { getErrorMessage } from "../../utils/contents";

export const cleanParams = (params = {}) => Object.fromEntries(
  Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null),
);

export const apiFailure = (error) => ({
  success: false,
  message: getErrorMessage(error),
  code: error?.response?.data?.code,
  errors: error?.response?.data?.errors || [],
  status: error?.response?.status,
});

export const runApi = async (request) => {
  try {
    const response = await request();
    return response?.data;
  } catch (error) {
    return apiFailure(error);
  }
};
