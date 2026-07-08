import api from "./api";
import API_ENDPOINTS from "../config/apiEndpoints";

export const getCustomers = async (page = 0, size = 2000) => {
  const response = await api.get(API_ENDPOINTS.CUSTOMERS, {
    params: { page, size }
  });
  return response.data;
};

export const addCustomer = async (customer) => {
  const response = await api.post(API_ENDPOINTS.CUSTOMERS, customer);
  return response.data;
};

export const editCustomer = async (customer) => {
  const id = customer.customer_id || customer.id;
  const response = await api.put(`${API_ENDPOINTS.CUSTOMERS}/${id}`, customer);
  return response.data;
};

export const deleteCustomer = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`);
  return response.data;
};

export const getCustomerInventory = async () => {
  const response = await api.get(API_ENDPOINTS.INVENTORY_ASSIGNMENT);
  return response.data;
};