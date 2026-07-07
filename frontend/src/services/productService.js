import api from "./api";
import API_ENDPOINTS from "../config/apiEndpoints";

export const getProducts = async () => {
  const response = await api.get(API_ENDPOINTS.PRODUCT_CATALOG);
  return response.data;
};