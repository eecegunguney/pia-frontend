import api from "./api";
import API_ENDPOINTS from "../config/apiEndpoints";

/**
 * Retrieves all products.
 *
 * @async
 * @returns {Promise<Array>} Product list.
 */
export const getProducts = async () => {
  const response = await api.get(API_ENDPOINTS.PRODUCT_CATALOG);
  return response.data;
};

/**
 * Retrieves a product by id.
 *
 * @async
 * @param {number} id - Product identifier.
 * @returns {Promise<Object>} Product information.
 */
export const getProductById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.PRODUCT_CATALOG}/${id}`);
  return response.data;
};

/**
 * Creates a new product.
 *
 * @async
 * @param {Object} productData - Product information.
 * @returns {Promise<Object>} Created product.
 */
export const createProduct = async (productData) => {
  const response = await api.post(
    API_ENDPOINTS.PRODUCT_CATALOG,
    productData
  );
  return response.data;
};

/**
 * Updates an existing product.
 *
 * @async
 * @param {number} id - Product identifier.
 * @param {Object} productData - Updated product information.
 * @returns {Promise<Object>} Updated product.
 */
export const updateProduct = async (id, productData) => {
  const response = await api.put(
    `${API_ENDPOINTS.PRODUCT_CATALOG}/${id}`,
    productData
  );
  return response.data;
};

/**
 * Deletes a product.
 *
 * @async
 * @param {number} id - Product identifier.
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
  await api.delete(`${API_ENDPOINTS.PRODUCT_CATALOG}/${id}`);
};