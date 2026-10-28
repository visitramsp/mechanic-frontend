import { AlertTriangle, LoaderCircle, LogOut, Trash2 } from "lucide-react";
import { Modal } from "./ui/Modal";

const toneStyles = {
  danger: {
    icon: Trash2,
    iconWrap: "bg-[#fff1ef] text-[#a63d32] border-[#f0cbc6]",
    confirm: "bg-[#d92d20] hover:bg-[#b42318] text-white",
  },
  warning: {
    icon: LogOut,
    iconWrap: "bg-[#fff7e8] text-[#b54708] border-[#fedf89]",
    confirm: "bg-[#0a1628] hover:bg-[#050d19] text-white",
  },
  neutral: {
    icon: AlertTriangle,
    iconWrap: "bg-[#eef4ff] text-[#3157d5] border-[#c7d7fe]",
    confirm: "bg-[#0a1628] hover:bg-[#050d19] text-white",
  },
};

const ConfirmDialog = ({
  open,
  title = "Delete record?",
  message = "Are you sure you want to continue? This action cannot be undone.",
  itemName = "",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  tone = "danger",
  onConfirm,
  onClose,
}) => {
  const config = toneStyles[tone] || toneStyles.danger;
  const Icon = config.icon;

  return (
    <Modal
      open={Boolean(open)}
      title={title}
      sub={message}
      size="xs"
      onClose={loading ? undefined : onClose}
      disableClose={loading}
      footer={
        <>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="min-h-12 rounded-xl border border-[#c7d2e3] bg-white px-5 text-sm font-bold text-[#475467] transition hover:border-[#3157d5] hover:bg-[#f4f7fb] disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`min-h-12 rounded-xl px-5 text-sm font-bold shadow-lg transition disabled:opacity-60 ${config.confirm}`}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <LoaderCircle className="animate-spin" size={17} /> Working…
              </span>
            ) : (
              confirmText
            )}
          </button>
        </>
      }
    >
      <div className="pw-confirm-dialog-body">
        <div className={`pw-confirm-dialog-icon ${config.iconWrap}`}>
          <Icon size={29} strokeWidth={1.8} />
        </div>

        {itemName && (
          <div className="pw-confirm-dialog-item">
            <p className="pw-eyebrow">Selected item</p>
            <strong>{itemName}</strong>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
