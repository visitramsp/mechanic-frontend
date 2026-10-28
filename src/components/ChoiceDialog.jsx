import { Check } from "lucide-react";
import { Modal } from "./ui/Modal";
import { BtnBlue, BtnGhost } from "./ui/UI";

export default function ChoiceDialog({
  open,
  title,
  description,
  options,
  value,
  onChange,
  onClose,
  onConfirm,
  saving = false,
  confirmText = "Update",
}) {
  return (
    <Modal
      open={open}
      title={title}
      sub={description}
      size="xs"
      onClose={saving ? undefined : onClose}
      footer={
        <>
          <BtnGhost type="button" onClick={onClose} disabled={saving}>Cancel</BtnGhost>
          <BtnBlue type="button" onClick={onConfirm} disabled={saving || !value}>
            {saving ? "Updating…" : confirmText}
          </BtnBlue>
        </>
      }
    >
      <div className="pw-choice-list">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              type="button"
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`pw-choice-card ${selected ? "is-selected" : ""}`}
              style={{
                "--choice-colour": option.colour,
                "--choice-background": option.background,
              }}
            >
              <span>{option.value}</span>
              <i><Check size={15} /></i>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
