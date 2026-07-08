import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { getCustomerInventory } from "../../services/customerService";
import "./CustomerDetailModal.css";

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
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>
          {customer.first_name} {customer.last_name}
        </h2>

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
                <td colSpan="3">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td data-label="Product Code">{product.product_code}</td>
                  <td data-label="Product Name">{product.product_name}</td>
                  <td data-label="Price">₺{product.base_price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerDetailModal;