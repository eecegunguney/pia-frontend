import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { getCustomers } from "../../services/customerService";
import "./CustomerListPage.css";
import CustomerFormModal from "./CustomerFormModal";
import CustomerEditModal from "./CustomerEditModal";
import { deleteCustomer } from "../../services/customerService";
import CustomerDetailModal from "./CustomerDetailModal";
import { FiSearch } from "react-icons/fi";

function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredCustomers = customers.filter((customer) => {
    const firstName = customer.first_name
      ? customer.first_name.toLowerCase()
      : "";
    const lastName = customer.last_name ? customer.last_name.toLowerCase() : "";
    return `${firstName} ${lastName}`.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleUpdateCustomer = (updatedCustomer) => {
    setCustomers((prev) =>
      prev.map((item) =>
        (item.customer_id || item.id) ===
          (updatedCustomer.customer_id || updatedCustomer.id)
          ? updatedCustomer
          : item,
      ),
    );
  };

  const handleDeleteCustomer = async (customer) => {
    const customerId = customer.id; // customer_id değil, her zaman id kullan
    if (!customerId) {
      console.error("HATA: Silinmek istenen müşterinin ID'si boş!", customer);
      alert("Müşteri ID'si bulunamadığı için istek engellendi.");
      return;
    }

    const confirmDelete = window.confirm(
      `${customer.first_name} ${customer.last_name} isimli müşteriyi silmek istediğinize emin misiniz?`,
    );

    if (confirmDelete) {
      try {
        await deleteCustomer(customerId);
        setCustomers((prevCustomers) =>
          prevCustomers.filter((item) => item.id !== customerId),
        );
        alert("Müşteri başarıyla silindi.");
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Müşteri silinirken bir hata oluştu.");
      }
    }
  };

  return (
    <div className="customer-container">
      <div className="card-header">
        <h2 className="title">Customers</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* <button className="btn" onClick={() => setOpenModal(true)}>
            <FaPlus />
            Add Customer
          </button> */}
        </div>

        <div className="search-bar">
          <span className="search-icon">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by name or surname..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn" onClick={() => setOpenModal(true)}>
          <FaPlus />
          Add Customer
        </button>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>City</th>
            <th>District</th>
            <th>Registration Date</th>
            <th>Company Name</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedCustomers.map((customer) => (
            <tr key={customer.customer_id || customer.id}>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.email}</td>
              <td>{customer.city}</td>
              <td>{customer.district}</td>
              <td>{customer.registration_date}</td>
              <td>{customer.company_name || "-"}</td>

              <td className="actions-cell">
                <button
                  className="btn-icon btn-detail"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setDetailOpen(true);
                  }}
                >
                  <FaEye />
                </button>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setEditOpen(true);
                  }}
                >
                  <FaEdit />
                </button>

                <button
                  className="btn-icon btn-delete"
                  onClick={(e) => {
                    handleDeleteCustomer(customer);
                  }}
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-bar">
        <span className="pagination-info">
          Showing {filteredCustomers.length === 0 ? 0 : startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of{" "}
          {filteredCustomers.length} entries
        </span>

        <div className="pagination-controls">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            «
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="page-btn"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            »
          </button>
        </div>
      </div>

      <CustomerFormModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onRefresh={loadCustomers}
        customers={customers}
      />
      <CustomerEditModal
        isOpen={editOpen}
        customer={selectedCustomer}
        customers={customers}
        onClose={() => setEditOpen(false)}
        onUpdate={handleUpdateCustomer}
      />
      <CustomerDetailModal
        isOpen={detailOpen}
        customer={selectedCustomer}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}

export default CustomerListPage;