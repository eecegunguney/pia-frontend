import "./Input.css";

/**
 * Reusable input component.
 *
 * @component
 * @param {Object} props
 * @param {string} props.label - Input label.
 * @param {string} props.name - Input name.
 * @param {string} [props.type="text"] - Input type.
 * @param {string|number} props.value - Input value.
 * @param {Function} props.onChange - Change handler.
 * @param {string} [props.placeholder]
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.readOnly=false]
 * @param {string} [props.className=""]
 * @param {string} [props.error]
 */
export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  readOnly = false,
  className = "",
  error,
  max,
  min
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={name}>{label}</label>}

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          max={max}
          min={min}
        />
      )}

      {error && <span className="input-error">{error}</span>}
    </div>
  );
}