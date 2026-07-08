import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <h2>Delete Stock</h2>

      <p>
        Are you sure you want to delete this stock?
      </p>

      <p>
        This action cannot be undone.
      </p>

      <div className="modal-actions">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="danger"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}