import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const sizeClassMap = {
  xs: "pw-portal-modal-panel--xs",
  sm: "pw-portal-modal-panel--sm",
  md: "pw-portal-modal-panel--md",
  lg: "pw-portal-modal-panel--lg",
  xl: "pw-portal-modal-panel--xl",
};

let bodyLockCount = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";

const lockBodyScroll = () => {
  if (typeof document === "undefined") return;
  if (bodyLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.classList.add("pw-modal-open");
  }
  bodyLockCount += 1;
};

const unlockBodyScroll = () => {
  if (typeof document === "undefined") return;
  bodyLockCount = Math.max(0, bodyLockCount - 1);
  if (bodyLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPaddingRight;
    document.body.classList.remove("pw-modal-open");
  }
};

export const Modal = ({
  open,
  title,
  sub,
  onClose,
  children,
  footer,
  size = "md",
  disableClose = false,
}) => {
  const generatedId = useId();
  const titleId = `prestige-modal-title-${generatedId.replace(/:/g, "")}`;
  const descriptionId = `prestige-modal-description-${generatedId.replace(/:/g, "")}`;
  const panelRef = useRef(null);
  const close = disableClose ? undefined : onClose;
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open) return undefined;

    lockBodyScroll();
    const previousActiveElement = document.activeElement;
    const frame = window.requestAnimationFrame(() => panelRef.current?.focus());

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && closeRef.current) {
        event.preventDefault();
        closeRef.current();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown, true);
      unlockBodyScroll();
      if (previousActiveElement instanceof HTMLElement) previousActiveElement.focus();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && close) close();
  };

  return createPortal(
    <div className="pw-portal-modal-root" role="presentation">
      <div className="pw-portal-modal-backdrop" aria-hidden="true" />
      <div className="pw-portal-modal-viewport" onMouseDown={handleBackdropClick}>
        <section
          ref={panelRef}
          className={`pw-portal-modal-panel ${sizeClassMap[size] || sizeClassMap.md}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={sub ? descriptionId : undefined}
          tabIndex={-1}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {(title || sub || close) && (
            <header className="pw-portal-modal-header">
              <div className="min-w-0">
                {title && <h2 id={titleId}>{title}</h2>}
                {sub && <p id={descriptionId}>{sub}</p>}
              </div>
              {close && (
                <button
                  type="button"
                  onClick={close}
                  className="pw-portal-modal-close"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              )}
            </header>
          )}

          <div className="prestige-modal-content pw-portal-modal-content">{children}</div>

          {footer && (
            <footer className="pw-portal-modal-footer">
              <div className="pw-modal-footer-slot">{footer}</div>
            </footer>
          )}
        </section>
      </div>
    </div>,
    document.body,
  );
};
