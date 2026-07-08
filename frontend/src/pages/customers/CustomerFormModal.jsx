import { useState, useEffect } from "react";
import { addCustomer } from "../../services/customerService";
import { IoMdClose } from "react-icons/io";
import "./CustomerFormModal.css";

import { FiFilePlus, FiCheck } from "react-icons/fi";

function CustomerFormModal({ isOpen, onClose, onRefresh, customers }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender: "",
    birth_date: "",
    city: "",
    district: "",
    customer_type: "",
    segment: "",
    is_active: "true",
    registration_date: "",
  });

  const [errors, setErrors] = useState({});
  const [today, setToday] = useState("");
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [segments, setSegments] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setToday(formattedDate);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        gender: "",
        birth_date: "",
        city: "",
        district: "",
        customer_type: "",
        segment: "",
        is_active: true,
        registration_date: formattedDate,
      });

      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && customers && customers.length > 0) {
      const uniqueCities = [
        ...new Set(customers.map((c) => c.city).filter(Boolean)),
      ];
      const uniqueTypes = [
        ...new Set(customers.map((c) => c.customer_type).filter(Boolean)),
      ];
      const uniqueSegments = [
        ...new Set(customers.map((c) => c.segment).filter(Boolean)),
      ];

      setCities(uniqueCities);
      setCustomerTypes(uniqueTypes);
      setSegments(uniqueSegments);
    }
  }, [isOpen, customers]);

  useEffect(() => {
    if (formData.city && customers) {
      const filteredDistricts = customers
        .filter((c) => c.city === formData.city)
        .map((c) => c.district);

      setDistricts([...new Set(filteredDistricts.filter(Boolean))]);
      setFormData((prev) => ({ ...prev, district: "" }));
    } else {
      setDistricts([]);
    }
  }, [formData.city, customers]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const maxCustomerId =
        customers.length > 0
          ? Math.max(...customers.map((c) => Number(c.customer_id || 1000)))
          : 1000;

      const payload = {
        ...formData,
        customer_id: maxCustomerId + 1,
      };

      await addCustomer(payload);

      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Something went wrong.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.first_name.trim()) newErrors.first_name = "Name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Surname is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone_number.trim())
      newErrors.phone_number = "Phone number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.birth_date) {
      newErrors.birth_date = "Birth date is required";
    } else if (new Date(formData.birth_date) > new Date()) {
      newErrors.birth_date = "Birth date cannot be in the future";
    }

    if (!formData.city) newErrors.city = "City is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.customer_type)
      newErrors.customer_type = "Customer Type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="customer-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <IoMdClose size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon">
            <FiFilePlus size={20} />
          </div>
          <h2>Add New Customer</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Adı */}
            <div>
              <label>First Name<span className="required-star">*</span></label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                style={errors.first_name ? { borderColor: "red" } : {}}
              />
              {errors.first_name && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.first_name}
                </span>
              )}
            </div>

            {/* Soyadı */}
            <div>
              <label>Last Name<span className="required-star">*</span></label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                style={errors.last_name ? { borderColor: "red" } : {}}
              />
              {errors.last_name && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.last_name}
                </span>
              )}
            </div>

            {/* E-posta */}
            <div>
              <label>Email<span className="required-star">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={errors.email ? { borderColor: "red" } : {}}
              />
              {errors.email && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.email}
                </span>
              )}
            </div>

            {/* Telefon */}
            <div>
              <label>Phone Number<span className="required-star">*</span></label>
              <input
                type="text"
                name="phone_number"
                placeholder="+905XXXXXXXXX"
                value={formData.phone_number}
                onChange={handleChange}
                style={errors.phone_number ? { borderColor: "red" } : {}}
              />
              {errors.phone_number && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.phone_number}
                </span>
              )}
            </div>

            {/* Doğum Tarihi */}
            <div>
              <label>Birth Date<span className="required-star">*</span></label>
              <input
                type="date"
                name="birth_date"
                max={today}
                value={formData.birth_date}
                onChange={handleChange}
                style={errors.birth_date ? { borderColor: "red" } : {}}
              />
              {errors.birth_date && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.birth_date}
                </span>
              )}
            </div>

            {/* Cinsiyet */}
            <div>
              <label>Gender<span className="required-star">*</span></label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={errors.gender ? { borderColor: "red" } : {}}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.gender}
                </span>
              )}
            </div>

            {/* İl */}
            <div>
              <label>City<span className="required-star">*</span></label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={errors.city ? { borderColor: "red" } : {}}
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.city}
                </span>
              )}
            </div>

            {/* İlçe */}
            <div>
              <label>District<span className="required-star">*</span></label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.city}
                style={errors.district ? { borderColor: "red" } : {}}
              >
                <option value="">Select District</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.district}
                </span>
              )}
            </div>

            {/* Müşteri Tipi */}
            <div>
              <label>Customer Type<span className="required-star">*</span></label>
              <select
                name="customer_type"
                value={formData.customer_type}
                onChange={handleChange}
                style={errors.customer_type ? { borderColor: "red" } : {}}
              >
                <option value="">Select Type</option>
                {customerTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.customer_type && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.customer_type}
                </span>
              )}
            </div>

            {/* Otomatik Atanan Kayıt Tarihi (Registration Date) */}
            <div>
              <label>Registration Date</label>
              <input
                type="date"
                name="registration_date"
                value={formData.registration_date}
                disabled
              />
            </div>

            {/* Segment */}
            {/* <div>
              <label>Segment</label>
              <select
                name="segment"
                value={formData.segment}
                onChange={handleChange}
              >
                <option value="">Select Segment</option>
                {segments.map((seg, index) => (
                  <option key={index} value={seg}>
                    {seg}
                  </option>
                ))}
              </select>
            </div> */}

            <div
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={{ width: "auto", cursor: "pointer" }}
              />
              <label style={{ margin: 0, cursor: "pointer" }}>
                Active Customer
              </label>
            </div>
          </div>

          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              <IoMdClose size={16} />
              Cancel
            </button>
            <button type="submit" className="save-btn">
              <FiCheck size={16} />
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerFormModal;