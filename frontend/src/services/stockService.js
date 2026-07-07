import api from "./api";
import API_ENDPOINTS from "../config/apiEndpoints";

/**
 * Retrieves all inventory stock records.
 *
 * @async
 * @returns {Promise<Array>} Inventory stock list.
 */
export const getStocks = async () => {
  const response = await api.get(API_ENDPOINTS.INVENTORY_STOCK);
  return response.data;
};

/**
 * Retrieves a stock record by id.
 *
 * @async
 * @param {number} id - Stock identifier.
 * @returns {Promise<Object>} Stock information.
 */
export const getStockById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.INVENTORY_STOCK}/${id}`);
  return response.data;
};

/**
 * Creates a new stock record.
 *
 * @async
 * @param {Object} stockData - Stock information.
 * @returns {Promise<Object>} Created stock.
 */
export const createStock = async (stockData) => {
  const response = await api.post(API_ENDPOINTS.INVENTORY_STOCK, stockData);
  return response.data;
};

/**
 * Updates an existing stock record.
 *
 * @async
 * @param {number} id - Stock identifier.
 * @param {Object} stockData - Updated stock information.
 * @returns {Promise<Object>} Updated stock.
 */
export const updateStock = async (id, stockData) => {
  const response = await api.put(
    `${API_ENDPOINTS.INVENTORY_STOCK}/${id}`,
    stockData
  );
  return response.data;
};

/**
 * Deletes a stock record.
 *
 * @async
 * @param {number} id - Stock identifier.
 * @returns {Promise<void>}
 */
export const deleteStock = async (id) => {
  await api.delete(`${API_ENDPOINTS.INVENTORY_STOCK}/${id}`);
};