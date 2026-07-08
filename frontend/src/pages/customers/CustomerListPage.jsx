import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { getCustomers } from "../../services/customerService";
import "./CustomerListPage.css";
import CustomerFormModal from "./CustomerFormModal";
import CustomerEditModal from "./CustomerEditModal";
import { deleteCustomer } from "../../services/customerService";
import CustomerDetailModal from "./CustomerDetailModal";
import { FiSearch, FiChevronDown } from "react-icons/fi";

function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [detailOpen, setDetailOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 7;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Load all unique cities once
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getCustomers(0, 2000);
        const customersArray = Array.isArray(data) ? data : (data?.content || []);
        const cities = Array.from(new Set(customersArray.map((c) => c.city).filter(Boolean)));
        setAllCities(cities);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCities();
  }, []);

  // Fetch paginated data when page or filters change
  useEffect(() => {
    loadCustomers();
  }, [currentPage, searchTerm, cityFilter]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      // Spring Boot pagination is 0-indexed, frontend is 1-indexed
      const data = await getCustomers(currentPage - 1, itemsPerPage, searchTerm, cityFilter);

      if (data && data.content) {
        setCustomers(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        // Fallback for mock backend array response
        const filtered = data.filter((customer) => {
          const firstName = customer.firstName ?? customer.first_name ?? "";
          const lastName = customer.lastName ?? customer.last_name ?? "";
          const matchesSearch = `${firstName} ${lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCity = cityFilter === "All" || customer.city === cityFilter;
          return matchesSearch && matchesCity;
        });

        setTotalElements(filtered.length);
        const calcTotalPages = Math.ceil(filtered.length / itemsPerPage);
        setTotalPages(calcTotalPages || 1);

        const start = (currentPage - 1) * itemsPerPage;
        setCustomers(filtered.slice(start, start + itemsPerPage));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    loadCustomers();
  };

  const handleDeleteCustomer = async (customer) => {
    const customerId = customer.customerId ?? customer.customer_id ?? customer.id;
    const firstName = customer.firstName ?? customer.first_name;
    const lastName = customer.lastName ?? customer.last_name;
    if (!customerId) {
      console.error("HATA: Silinmek istenen müşterinin ID'si boş!", customer);
      alert("Müşteri ID'si bulunamadığı için istek engellendi.");
      return;
    }

    const confirmDelete = window.confirm(
      `${firstName} ${lastName} isimli müşteriyi silmek istediğinize emin misiniz?`,
    );

    if (confirmDelete) {
      try {
        await deleteCustomer(customerId);
        alert("Müşteri başarıyla silindi.");
        loadCustomers();
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Müşteri silinirken bir hata oluştu.");
      }
    }
  };

  const getVisiblePages = () => {
    const range = [];
    const maxVisible = 3;
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="customer-container">
      {/* Page Title Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "var(--text-dark)", letterSpacing: "-0.02em" }}>
          Customers
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
          Manage your customer directory, contact info, and registration logs.
        </p>
      </div>

      <div className="card-header" style={{ alignItems: "flex-end" }}>
        <div className="search-bar" style={{ flex: "1 1 280px", maxWidth: "none" }}>
          <label className="field-label">
            Search
          </label>
          <div style={{ position: "relative" }}>
            <span className="search-icon">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by name or surname..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="filter-select-wrapper">
          <label className="field-label">
            City
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="All">All Cities</option>
              {allCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", alignItems: "center", color: "var(--text-muted)" }}>
              <FiChevronDown size={18} />
            </span>
          </div>
        </div>

        <button className="btn" onClick={() => setOpenModal(true)}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="table-card">
          <div style={{ overflowX: "auto" }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Surname</th>
                  <th className="hide-mobile">Email</th>
                  <th>City</th>
                  <th className="hide-mobile hide-tablet">District</th>
                  <th className="hide-mobile hide-tablet">Registration Date</th>
                  <th className="hide-mobile">Company Name</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => {
                  const customerId = customer.customerId ?? customer.customer_id ?? customer.id;
                  const firstName = customer.firstName ?? customer.first_name;
                  const lastName = customer.lastName ?? customer.last_name;
                  const registrationDate = customer.registrationDate ?? customer.registration_date;
                  const companyName = customer.companyName ?? customer.company_name;

                  return (
                    <tr key={customerId}>
                      <td>{firstName}</td>
                      <td>{lastName}</td>
                      <td className="hide-mobile">{customer.email}</td>
                      <td>{customer.city}</td>
                      <td className="hide-mobile hide-tablet">{customer.district}</td>
                      <td className="hide-mobile hide-tablet">{registrationDate}</td>
                      <td className="hide-mobile">{companyName || "-"}</td>

                      <td className="actions-cell">
                        <button
                          className="btn-icon btn-detail"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setDetailOpen(true);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setEditOpen(true);
                          }}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="btn-icon btn-delete"
                          onClick={(e) => {
                            handleDeleteCustomer(customer);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pagination-bar">
            <span className="pagination-info">
              Showing {totalElements === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, totalElements)} of{" "}
              {totalElements} entries
            </span>

            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                «
              </button>

              {getVisiblePages().map((page) => (
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

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12 }}>
      <div style={{
        width: 36,
        height: 36,
        border: "3px solid #e2e8f0",
        borderTop: "3px solid #64748b",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Loading content...</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CustomerListPage;