import "./Select.css";

/**
 * Reusable select component.
 *
 * @component
 * @param {Object} props
 * @param {string} props.label - Select label.
 * @param {string} props.name - Select name.
 * @param {string|number} props.value - Selected value.
 * @param {Function} props.onChange - Change handler.
 * @param {Array} props.options - List of options.
 * @param {string} [props.placeholder="Select an option"]
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className=""]
 * @param {string} [props.error]
 * @returns {JSX.Element}
 */
export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  disabled = false,
  className = "",
  error,
}) {
  return (
    <div className={`select-group ${className}`}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="select-error">
          {error}
        </span>
      )}
    </div>
  );
}