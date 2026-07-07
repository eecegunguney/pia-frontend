import { useEffect, useState } from "react";


import {
  Search,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";

import StockFormModal from "./StockFormModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

import {
  getStocks,
  createStock,
  updateStock,
  deleteStock,
} from "../../services/stockService";

import "./StockListPage.css";

export default function StockListPage() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const data = await getStocks();
      setStocks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    setSelectedStock(null);
    setIsModalOpen(true);
  };

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

    const handleSave = async (stockData) => {
    try {
        if (selectedStock) {
        await updateStock(selectedStock.stock_id, stockData);
        } else {
        await createStock(stockData);
        }

        await loadStocks();

        setIsModalOpen(false);
        setSelectedStock(null);
    } catch (error) {
        console.error(error);
    }
    };

    const handleDelete = async () => {
    try {
        await deleteStock(deleteId);

        await loadStocks();

        setDeleteId(null);
    } catch (error) {
        console.error(error);
    }
    };

  const filteredStocks = stocks.filter((stock) =>
    stock.product_code
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      header: "Product",
      accessor: "product_code",
      width: "18%",
    },
    {
      header: "Sales Channel",
      accessor: "sales_channel_id",
      width: "15%",
    },
    {
      header: "Current",
      accessor: "current_stock",
      width: "12%",
    },
    {
      header: "Minimum",
      accessor: "minimum_stock_level",
      width: "12%",
    },
    {
      header: "Maximum",
      accessor: "maximum_stock_level",
      width: "12%",
    },
    {
      header: "Last Restock",
      accessor: "last_restock_date",
      width: "18%",
    },
    {
    header: "Actions",
    accessor: "actions",
    width: "13%",
    render: (row) => (
        <div className="stock-actions">
        <button
            className="icon-btn edit-btn"
            onClick={() => handleEdit(row)}
        >
            <Pencil size={18} />
        </button>

        <button
            className="icon-btn delete-btn"
            onClick={() => setDeleteId(row.stock_id)}
        >
            <Trash2 size={18} />
        </button>
        </div>
    ),
    }
  ];

 return (
  <>
    <div
        className="stock-page"
        style={{
            fontFamily:
            "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
    >
      {/* Search + Filter + Add */}
      <div className="stock-toolbar">

        <Input
          placeholder="Search by product code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="stock-filter">
          <option>All Channels</option>
          <option>Online</option>
          <option>Retail</option>
        </select>

        <Button
          variant="primary"
          onClick={handleAdd}
        >
          + Add Stock
        </Button>

      </div>

      <Table
        columns={columns}
        data={filteredStocks}
      />

    </div>

    <StockFormModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedStock(null);
      }}
      initialData={selectedStock}
      onSubmit={handleSave}
    />

    <ConfirmDeleteModal
      isOpen={deleteId !== null}
      onClose={() => setDeleteId(null)}
      onConfirm={handleDelete}
    />
  </>
);
}