import api from "./api";


export const getCustomers = async () => {
  const response = await api.get("/CUSTOMER");
  return response.data;
};

export const addCustomer = async (customer) => {
  const response = await api.post("/CUSTOMER", customer);
  return response.data;
};
export const editCustomer = async (customer) => {
  const id = customer.id;
  const response = await api.put(`/CUSTOMER/${id}`, customer);
  return response.data;
};
export const deleteCustomer = async (id) => {
  const response = await api.delete(`/CUSTOMER/${id}`);
  return response.data;
};
export const getCustomerInventory = async () => {
  const response = await api.get("/CUSTOMER_INVENTORY");
  return response.data;
};