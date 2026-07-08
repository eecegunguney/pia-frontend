import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { getCustomerInventory } from "../../services/customerService";
import "./CustomerDetailModal.css";
import { FiPackage } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

function CustomerDetailModal({ isOpen, customer, onClose }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isOpen && customer) {
      loadProducts();
    }
  }, [isOpen, customer]);

  const loadProducts = async () => {
    try {
      debugger
      const inventories = await getCustomerInventory();
      const products = await getProducts();

      const customerId = customer.customerId ?? customer.customer_id ?? customer.id;

      const customerInventories = inventories.filter((item) => {
        const itemCustomerId = item.customerId ?? item.customer_id;
        return Number(itemCustomerId) === Number(customerId);
      });

      const customerProducts = products.filter((product) => {
        const productCode = product.productCode ?? product.product_code;
        return customerInventories.some((inventory) => {
          const invProductCode = inventory.productCode ?? inventory.product_code;
          return invProductCode === productCode;
        });
      });

      setProducts(customerProducts);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen || !customer) return null;

  return (
  <div className="modal-overlay">
    <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close-btn" onClick={onClose}>
        <IoMdClose size={18} />
      </button>

      <div className="modal-header">
        <div className="modal-icon">
          <FiPackage size={20} />
        </div>

        <div>
          <h2>
            {customer.firstName ?? customer.first_name} {customer.lastName ?? customer.last_name}
          </h2>

          <p className="detail-subtitle">
            {products.length} Product{products.length !== 1 && "s"} Assigned
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="detail-table">
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-row">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product, idx) => {
                const productCode = product.productCode ?? product.product_code;
                const productName = product.productName ?? product.product_name;
                const basePrice = product.basePrice ?? product.base_price;

                return (
                  <tr key={product.id || productCode || idx}>
                    <td data-label="Product Code">{productCode}</td>
                    <td data-label="Product Name">{productName}</td>
                    <td data-label="Price" className="price-cell">
                      ₺{Number(basePrice).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="modal-buttons">
        <button className="cancel-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);
}

export default CustomerDetailModal;