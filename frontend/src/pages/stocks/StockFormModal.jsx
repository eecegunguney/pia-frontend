import { useState, useEffect } from "react";

import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";

import { getProducts } from "../../services/productService";

import "./StockFormModal.css";

    const emptyForm = {
    product_code: "",
    sales_channel_id: "",
    current_stock: 0,
    minimum_stock_level: 0,
    maximum_stock_level: 0,
    last_restock_date: "",
    };

    const today = new Date().toISOString().split("T")[0];

    export default function StockFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    }) {
  const [formData, setFormData] = useState(emptyForm);
  const [products, setProducts] = useState([]);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };
        useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(emptyForm);
        }
    }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    await onSubmit(formData);
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="stock-form">

        <h2>

        {initialData ? "Edit Stock" : "Add Stock"}

        </h2>

        <form onSubmit={handleSubmit}>
            {initialData ? (
                <Input
                    label="Product Code"
                    name="product_code"
                    value={formData.product_code}
                    onChange={handleChange}
                    readOnly={!!initialData}
                />
            ) : (
                <Select
                    label="Product"
                    name="product_code"
                    value={formData.product_code}
                    onChange={handleChange}
                    options={products}
                    optionValue="product_code"
                    optionLabel="product_code" 
                />
            )}
 

            <Input
                label="Sales Channel"
                name="sales_channel_id"
                value={formData.sales_channel_id}
                onChange={handleChange}
            />

          <Input
            label="Current Stock"
            type="number"
            name="current_stock"
            value={formData.current_stock}
            onChange={handleChange}
          />

          <Input
            label="Minimum Stock"
            type="number"
            name="minimum_stock_level"
            value={formData.minimum_stock_level}
            onChange={handleChange}
          />

          <Input
            label="Maximum Stock"
            type="number"
            name="maximum_stock_level"
            value={formData.maximum_stock_level}
            onChange={handleChange}
          />

         <Input
            label="Last Restock Date"
            type="date"
            name="last_restock_date"
            value={formData.last_restock_date}
            onChange={handleChange}
            max={today}
        />

          <div className="stock-form-buttons">
            <Button
                type="submit"
                variant="success"
            >
                {initialData ? "Update" : "Save"}
            </Button>

            <Button
                type="button"
                variant="secondary"
                onClick={onClose}
            >
                Cancel
            </Button>
          </div>

        </form>
      </div>
    </Modal>
  );
}