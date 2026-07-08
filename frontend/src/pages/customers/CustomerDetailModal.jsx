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

      const customerInventories = inventories.filter(
        (item) => item.customer_id === customer.customer_id
      );

      const customerProducts = products.filter((product) =>
        customerInventories.some(
          (inventory) => inventory.product_code === product.product_code
        )
      );

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
            {customer.first_name} {customer.last_name}
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
              products.map((product) => (
                <tr key={product.product_code}>
                  <td>{product.product_code}</td>
                  <td>{product.product_name}</td>
                  <td className="price-cell">
                    ₺{Number(product.base_price).toLocaleString()}
                  </td>
                </tr>
              ))
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