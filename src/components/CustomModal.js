import { Modal } from "./ui/Modal";

const sizeMap = {
  "max-w-md": "sm",
  "max-w-lg": "sm",
  "max-w-xl": "md",
  "max-w-2xl": "md",
  "max-w-3xl": "lg",
  "max-w-4xl": "lg",
  "max-w-5xl": "xl",
};

const CustomModal = ({ title, sub, onClose, children, footer, size = "max-w-3xl", open = true }) => (
  <Modal
    open={open}
    title={title}
    sub={sub}
    onClose={onClose}
    footer={footer}
    size={sizeMap[size] || "lg"}
  >
    {children}
  </Modal>
);

export default CustomModal;
