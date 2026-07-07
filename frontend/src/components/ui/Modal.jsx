import "./Modal.css";

/**
 * Reusable modal component.
 *
 * @param {boolean} isOpen
 * @param {Function} onClose
 * @param {React.ReactNode} children
 */
export default function Modal({
  isOpen,
  onClose,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <button
          className="modal-close"
          onClick={onClose}
        >
          ✕
        </button>

        {children}

      </div>

    </div>
  );
}