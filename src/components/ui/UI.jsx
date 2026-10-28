import { Link } from "react-router-dom";

const toneMap = {
  Draft: "pw-badge pw-badge--neutral",
  Sent: "pw-badge pw-badge--info",
  Approved: "pw-badge pw-badge--success",
  Rejected: "pw-badge pw-badge--danger",
  "In Progress": "pw-badge pw-badge--warning",
  Completed: "pw-badge pw-badge--success",
  "On Hold": "pw-badge pw-badge--danger",
  Unpaid: "pw-badge pw-badge--warning",
  Overdue: "pw-badge pw-badge--danger",
  Paid: "pw-badge pw-badge--success",
  Partial: "pw-badge pw-badge--violet",
  Confirmed: "pw-badge pw-badge--success",
  Open: "pw-badge pw-badge--info",
  Low: "pw-badge pw-badge--success",
  Medium: "pw-badge pw-badge--warning",
  High: "pw-badge pw-badge--orange",
  Urgent: "pw-badge pw-badge--danger",
  Cancelled: "pw-badge pw-badge--danger",
  Void: "pw-badge pw-badge--neutral",
  Active: "pw-badge pw-badge--success",
  Inactive: "pw-badge pw-badge--danger",
  New: "pw-badge pw-badge--info",
  "In Review": "pw-badge pw-badge--warning",
  Contacted: "pw-badge pw-badge--violet",
  Booked: "pw-badge pw-badge--success",
  Closed: "pw-badge pw-badge--neutral",
  Spam: "pw-badge pw-badge--danger",
  Success: "pw-badge pw-badge--success",
  "Not Found": "pw-badge pw-badge--warning",
  Failed: "pw-badge pw-badge--danger",
};

export const Badge = ({ status, size = "sm", className = "", ...props }) => (
  <span {...props} className={`${toneMap[status] || "pw-badge pw-badge--neutral"} ${size === "sm" ? "text-xs" : "text-sm"} ${className}`}>
    <span className="pw-badge__dot" />
    {status || "Unknown"}
  </span>
);

const baseButton = "pw-button inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50";
export const BtnBlue = ({ children, className = "", ...props }) => <button {...props} className={`${baseButton} pw-button--primary ${className}`}>{children}</button>;
export const BtnGreen = ({ children, className = "", ...props }) => <button {...props} className={`${baseButton} pw-button--success ${className}`}>{children}</button>;
export const BtnGhost = ({ children, className = "", ...props }) => <button {...props} className={`${baseButton} pw-button--secondary ${className}`}>{children}</button>;
export const BtnRed = ({ children, className = "", ...props }) => <button {...props} className={`${baseButton} pw-button--danger ${className}`}>{children}</button>;
export const BtnAmber = ({ children, className = "", ...props }) => <button {...props} className={`${baseButton} pw-button--accent ${className}`}>{children}</button>;
export const BtnSm = ({ children, as: As = BtnBlue, ...props }) => <As {...props} className="!min-h-9 !px-3 !py-1.5 !text-xs">{children}</As>;

const FieldLabel = ({ children }) => children ? <label className="pw-field-label">{children}</label> : null;
export const Input = ({ label, className = "", ...props }) => (
  <div className="pw-field">
    <FieldLabel>{label}</FieldLabel>
    <input {...props} className={`pw-control ${className}`} />
  </div>
);
export const Select = ({ label, children, className = "", touched = false, errors, ...props }) => (
  <div className="pw-field">
    <FieldLabel>{label}</FieldLabel>
    <select {...props} className={`pw-control pw-select ${className}`}>{children}</select>
    {touched && errors && <p className="pw-field-error">{errors}</p>}
  </div>
);
export const Textarea = ({ label, className = "", ...props }) => (
  <div className="pw-field">
    <FieldLabel>{label}</FieldLabel>
    <textarea {...props} className={`pw-control pw-textarea ${className}`} />
  </div>
);

export const Card = ({ children, className = "" }) => <div className={`pw-card ${className}`}>{children}</div>;

export const StatCard = ({ icon, label, value, change, changeLabel }) => (
  <Card className="pw-stat-card">
    <div className="min-w-0">
      <div className="pw-eyebrow">{label}</div>
      <div className="mt-2 break-words text-2xl font-extrabold tracking-tight text-[#111c34] sm:text-3xl">{value}</div>
      {change && <div className={`mt-2 text-xs font-semibold ${String(change).startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>{change} <span className="font-normal text-slate-400">{changeLabel}</span></div>}
    </div>
    <div className="pw-stat-icon">{icon}</div>
  </Card>
);

export const PageHeader = ({ title, sub, action, backAction, backTo, backLabel = "Back to list" }) => (
  <div className="pw-page-header">
    <div className="min-w-0">
      {backTo ? (
        <Link
          to={backTo}
          replace
          className="pw-back-link"
          aria-label={backLabel}
          onClick={() => document.body.style.removeProperty("overflow")}
        >
          <span aria-hidden="true">←</span> {backLabel}
        </Link>
      ) : backAction ? (
        <button type="button" onClick={backAction} className="pw-back-link">
          <span aria-hidden="true">←</span> {backLabel}
        </button>
      ) : null}
      <p className="pw-eyebrow">the Mechanic</p>
      <h1>{title}</h1>
      {sub && <p className="pw-page-subtitle">{sub}</p>}
    </div>
    {action && <div className="pw-page-actions">{action}</div>}
  </div>
);

export const FormPageShell = ({ title, sub, backAction, backTo, backLabel, children, actions, aside }) => (
  <div className="pw-form-page">
    <PageHeader title={title} sub={sub} backAction={backAction} backTo={backTo} backLabel={backLabel} />
    <div className={`pw-form-layout ${aside ? "pw-form-layout--aside" : ""}`}>
      <div className="min-w-0 space-y-5">{children}</div>
      {aside && <aside className="pw-form-aside">{aside}</aside>}
    </div>
    {actions && <div className="pw-form-actions">{actions}</div>}
  </div>
);

export const FormSection = ({ title, description, children, className = "" }) => (
  <Card className={`overflow-hidden ${className}`}>
    <div className="border-b border-[#e5eaf2] px-4 py-4 sm:px-6">
      <h2 className="text-base font-extrabold text-[#111c34] sm:text-lg">{title}</h2>
      {description && <p className="mt-1 text-sm text-[#667085]">{description}</p>}
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </Card>
);

export const Table = ({ headers, children, empty, className = "" }) => (
  <div className={`pw-table-wrap ${className}`}>
    <table className="pw-table">
      <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
    {empty && <div className="pw-empty-state"><div className="text-3xl">⌁</div><p>{empty}</p></div>}
  </div>
);

export const RegPlate = ({ reg }) => <span className="pw-reg-plate">{reg || "—"}</span>;
export const EmptyState = ({ icon = "⌁", title, sub }) => <div className="pw-empty-state"><div className="text-4xl">{icon}</div><strong>{title}</strong>{sub && <p>{sub}</p>}</div>;

export const LoadingState = ({ label = "Loading records…" }) => (
  <div className="pw-empty-state" role="status" aria-live="polite">
    <span className="pw-api-spinner" aria-hidden="true" />
    <p>{label}</p>
  </div>
);

export const Pagination = ({ meta, onPageChange, disabled = false }) => {
  const page = Number(meta?.page || 1);
  const pages = Math.max(1, Number(meta?.pages || 1));
  const total = Number(meta?.total || 0);
  if (pages <= 1 && total === 0) return null;
  return (
    <div className="pw-pagination">
      <p>{total.toLocaleString()} record{total === 1 ? "" : "s"} · Page {page} of {pages}</p>
      <div>
        <BtnGhost type="button" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>Previous</BtnGhost>
        <BtnGhost type="button" disabled={disabled || page >= pages} onClick={() => onPageChange(page + 1)}>Next</BtnGhost>
      </div>
    </div>
  );
};
export const SectionTitle = ({ children }) => <div className="pw-section-title"><span>{children}</span><i /></div>;

export const LineItemsTable = ({ items = [], setFieldValue, fieldName = "items", formik, vatPercentage = 0 }) => {
  const update = (index, key, value) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    const quantity = Number(next[index].quantity || 0);
    const unitPrice = Number(next[index].unitPrice || 0);
    next[index].totalPrice = quantity * unitPrice;
    setFieldValue(fieldName, next);
  };
  const add = () => setFieldValue(fieldName, [...items, { description: "", itemType: "Part", quantity: 1, unitPrice: 0, vat: vatPercentage, totalPrice: 0 }]);
  const remove = (index) => setFieldValue(fieldName, items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="pw-line-items-desktop">
        <table>
          <thead><tr><th>#</th><th>Description</th><th>Type</th><th>Qty</th><th>Rate (£)</th><th className="!text-nowrap">Total (£)</th><th /></tr></thead>
          <tbody>{items.map((item, index) => <tr key={index}>
            <td>{index + 1}</td>
            <td><input className="pw-control" value={item.description || ""} onChange={(e) => update(index, "description", e.target.value)} />{formik?.touched?.items?.[index]?.description && formik?.errors?.items?.[index]?.description && <p className="pw-field-error">{formik.errors.items[index].description}</p>}</td>
            <td><select className="pw-control pw-select" value={item.itemType || "Part"} onChange={(e) => update(index, "itemType", e.target.value)}><option>Part</option><option>Labour</option><option>Service</option></select></td>
            <td><input className="pw-control" type="number" min="0" step="0.01" value={item.quantity ?? 1} onChange={(e) => update(index, "quantity", Number(e.target.value))} /></td>
            <td><input className="pw-control" type="number" min="0" step="0.01" value={item.unitPrice ?? 0} onChange={(e) => update(index, "unitPrice", Number(e.target.value))} /></td>
            <td className="font-bold !text-nowrap text-[#111c34]">£{Number(item.totalPrice || 0).toFixed(2)}</td>
            <td>{items.length > 1 && <button type="button" className="pw-icon-button pw-icon-button--danger" onClick={() => remove(index)}>×</button>}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="pw-line-items-mobile">
        {items.map((item, index) => <div className="pw-line-item-card" key={index}>
          <div className="flex items-center justify-between"><strong>Item {index + 1}</strong>{items.length > 1 && <button type="button" className="pw-icon-button pw-icon-button--danger" onClick={() => remove(index)}>×</button>}</div>
          <Input label="Description" value={item.description || ""} onChange={(e) => update(index, "description", e.target.value)} />
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2"><Select label="Type" value={item.itemType || "Part"} onChange={(e) => update(index, "itemType", e.target.value)}><option>Part</option><option>Labour</option><option>Service</option></Select><Input label="Quantity" type="number" min="0" step="0.01" value={item.quantity ?? 1} onChange={(e) => update(index, "quantity", Number(e.target.value))} /></div>
          <Input label="Rate (£)" type="number" min="0" step="0.01" value={item.unitPrice ?? 0} onChange={(e) => update(index, "unitPrice", Number(e.target.value))} />
          <div className="flex justify-between rounded-xl bg-[#f4f7fb] px-3 py-2 text-sm"><span className="text-[#667085]">Line total</span><strong>£{Number(item.totalPrice || 0).toFixed(2)}</strong></div>
        </div>)}
      </div>
      <BtnGhost type="button" onClick={add}>+ Add line item</BtnGhost>
    </div>
  );
};

const money = (value) => Number(value || 0).toFixed(2);
export const TotalsBox = ({ subtotal, vat, discount = 0, total, paidAmount = null, balance = null, LabourCharge = 0, vatPercentage = 0 }) => (
  <div className="pw-totals-box">
    <div><span>Subtotal</span><strong>£{money(subtotal)}</strong></div>
    <div><span>VAT ({vatPercentage}%)</span><strong>£{money(vat)}</strong></div>
    <div><span>Discount</span><strong>- £{money(discount)}</strong></div>
    {Number(LabourCharge) > 0 && <div><span>Labour</span><strong>£{money(LabourCharge)}</strong></div>}
    <div className="pw-totals-box__total"><span>Total</span><strong>£{money(total)}</strong></div>
    {paidAmount !== null && <div className="text-emerald-700"><span>Paid</span><strong>£{money(paidAmount)}</strong></div>}
    {balance !== null && <div><span>Balance</span><strong>£{money(balance)}</strong></div>}
  </div>
);
