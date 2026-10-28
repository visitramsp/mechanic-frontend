import { useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiDownload, FiPrinter } from "react-icons/fi";
import { Modal } from "../../../components/ui/Modal";
import {
  Badge,
  BtnBlue,
  BtnGhost,
  Input,
  RegPlate,
  Select,
  Textarea,
  TotalsBox,
} from "../../../components/ui/UI";
import { downloadInvoicePdf, printInvoicePdf } from "../../../utils/pdfDocuments";
import { addInvoicePayment } from "../../../services/apiServices/invoiceService";

const fmt = (value) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(value || 0));

const niceDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
        new Date(`${String(value).split("T")[0]}T00:00:00`),
      )
    : "—";

const today = () => new Date().toISOString().slice(0, 10);

const Detail = ({ label, children, className = "" }) => (
  <div className={`pw-detail-tile ${className}`}>
    <span>{label}</span>
    <strong>{children || "—"}</strong>
  </div>
);

export function PaymentModal({ invoice, onClose, onSaved }) {
  const [form, setForm] = useState({
    amount: Number(invoice?.balance || 0),
    paymentDate: today(),
    paymentMethod: "Card",
    reference: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  if (!invoice) return null;

  const save = async (event) => {
    event.preventDefault();
    if (Number(form.amount) <= 0) return toast.error("Enter a payment amount greater than zero");
    if (Number(form.amount) > Number(invoice.balance)) return toast.error("Payment cannot exceed the outstanding balance");

    setSaving(true);
    try {
      const response = await addInvoicePayment(invoice.id, { ...form, amount: Number(form.amount) });
      if (response?.success) {
        toast.success(response.message || "Payment recorded");
        onSaved(response.data);
      } else {
        toast.error(response?.message || "Unable to record payment");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={Boolean(invoice)}
      title={`Record payment · ${invoice.id}`}
      sub="Add a traceable payment against the outstanding invoice balance."
      size="sm"
      onClose={saving ? undefined : onClose}
      footer={
        <>
          <BtnGhost type="button" onClick={onClose} disabled={saving}>Cancel</BtnGhost>
          <BtnBlue type="submit" form="invoice-payment-form" disabled={saving}>
            <FiCheck /> {saving ? "Recording…" : "Record payment"}
          </BtnBlue>
        </>
      }
    >
      <form id="invoice-payment-form" onSubmit={save} className="space-y-5">
        <div className="pw-modal-summary-grid">
          <Detail label="Invoice total">{fmt(invoice.total)}</Detail>
          <Detail label="Outstanding">{fmt(invoice.balance)}</Detail>
        </div>

        <Input
          label="Payment amount (£)"
          type="number"
          min="0.01"
          max={Number(invoice.balance)}
          step="0.01"
          value={form.amount}
          onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
          required
        />

        <div className="pw-form-grid">
          <Input
            label="Payment date"
            type="date"
            value={form.paymentDate}
            onChange={(event) => setForm((current) => ({ ...current, paymentDate: event.target.value }))}
            required
          />
          <Select
            label="Payment method"
            value={form.paymentMethod}
            onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}
          >
            <option>Card</option>
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>Cheque</option>
            <option>Other</option>
          </Select>
          <Input
            label="Reference"
            value={form.reference}
            onChange={(event) => setForm((current) => ({ ...current, reference: event.target.value }))}
            placeholder="Optional transaction reference"
          />
        </div>

        <Textarea
          label="Payment notes"
          value={form.notes}
          onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
          placeholder="Optional internal payment note"
        />
      </form>
    </Modal>
  );
}

export function InvoiceDetailModal({ invoice, onClose, onPayment, onStatus }) {
  const [preparing, setPreparing] = useState(false);
  if (!invoice) return null;

  const customerRecord = invoice.customerRecord || {};
  const vehicleRecord = invoice.vehicleRecord || {};
  const items = invoice.items || [];

  const handlePdf = async (mode) => {
    if (preparing) return;
    setPreparing(mode);
    try {
      await Promise.resolve(mode === "print" ? printInvoicePdf(invoice) : downloadInvoicePdf(invoice));
    } catch (error) {
      console.error(error);
      toast.error("Unable to prepare the invoice PDF");
    } finally {
      setPreparing(false);
    }
  };

  return (
    <Modal
      open={Boolean(invoice)}
      title={invoice.id}
      sub="VAT invoice, line items, payment history and outstanding balance"
      size="lg"
      onClose={onClose}
      footer={
        <div className="pw-modal-footer-layout">
          <div className="pw-modal-footer-group">
            <BtnGhost type="button" onClick={onClose}>Close</BtnGhost>
            <BtnGhost type="button" disabled={Boolean(preparing)} onClick={() => handlePdf("print")}>
              <FiPrinter /> {preparing === "print" ? "Preparing…" : "Print / Save PDF"}
            </BtnGhost>
            <BtnBlue type="button" disabled={Boolean(preparing)} onClick={() => handlePdf("download")}>
              <FiDownload /> {preparing === "download" ? "Preparing PDF…" : "Download PDF"}
            </BtnBlue>
          </div>
          <div className="pw-modal-footer-group pw-modal-footer-group--end">
            {invoice.status !== "Void" && invoice.status !== "Paid" && (
              <Select
                aria-label="Invoice status"
                className="pw-modal-status-select"
                value={invoice.status}
                onChange={(event) => onStatus(invoice, event.target.value)}
              >
                <option>Draft</option>
                <option>Unpaid</option>
                <option>Overdue</option>
                <option>Void</option>
              </Select>
            )}
            {Number(invoice.balance) > 0 && invoice.status !== "Void" && (
              <BtnBlue type="button" onClick={() => onPayment(invoice)}>
                <FiCheck /> Record payment
              </BtnBlue>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="pw-document-hero">
          <div className="min-w-0">
            <p className="pw-eyebrow">Invoice summary</p>
            <h3>{invoice.customer}</h3>
            <p>{invoice.make}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RegPlate reg={invoice.vehicle} />
            <Badge status={invoice.status} />
          </div>
        </div>

        <div className="pw-modal-detail-grid">
          <section className="pw-summary-panel">
            <p className="pw-eyebrow">Customer</p>
            <div className="mt-3 grid gap-2">
              <Detail label="Name">{customerRecord.name || invoice.customer}</Detail>
              <Detail label="Telephone">{customerRecord.phone || customerRecord.telephone || invoice.customerPhone}</Detail>
              <Detail label="Email">{customerRecord.email || invoice.customerEmail}</Detail>
              <Detail label="Address">{customerRecord.address || invoice.customerAddress}</Detail>
            </div>
          </section>
          <section className="pw-summary-panel">
            <p className="pw-eyebrow">Vehicle</p>
            <div className="mt-3 grid gap-2">
              <Detail label="Registration"><RegPlate reg={vehicleRecord.registrationNumber || invoice.vehicle} /></Detail>
              <Detail label="Make and model">{[vehicleRecord.make, vehicleRecord.model].filter(Boolean).join(" ") || invoice.make}</Detail>
              <Detail label="Year">{vehicleRecord.year}</Detail>
              <Detail label="VIN">{vehicleRecord.vinNumber}</Detail>
            </div>
          </section>
          <section className="pw-summary-panel pw-modal-detail-grid__wide">
            <p className="pw-eyebrow">Invoice dates</p>
            <div className="mt-3 grid gap-2 min-[480px]:grid-cols-2 lg:grid-cols-1">
              <Detail label="Invoice date">{niceDate(invoice.date)}</Detail>
              <Detail label="Due date">{niceDate(invoice.due)}</Detail>
              <Detail label="VAT rate">{Number(invoice.vatRate || 0)}%</Detail>
              <Detail label="Item count">{items.length}</Detail>
            </div>
          </section>
        </div>

        <section>
          <div className="mb-3">
            <p className="pw-eyebrow">Invoice items</p>
            <h3 className="mt-1 text-base font-extrabold text-[#111c34]">Parts, labour and services</h3>
          </div>

          <div className="pw-detail-items-mobile">
            {items.map((item, index) => {
              const quantity = Number(item.quantity ?? item.qty ?? 0);
              const rate = Number(item.unitPrice ?? item.rate ?? 0);
              const total = Number(item.totalPrice ?? quantity * rate);
              return (
                <article key={item.id || index} className="pw-line-item-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="pw-eyebrow">Item {index + 1}</p>
                      <h4 className="mt-1 break-words font-extrabold text-[#111c34]">{item.description || item.desc || "Untitled item"}</h4>
                    </div>
                    <Badge status={item.itemType || item.type || "Service"} />
                  </div>
                  <div className="pw-modal-summary-grid">
                    <Detail label="Quantity">{quantity}</Detail>
                    <Detail label="Rate">{fmt(rate)}</Detail>
                    <Detail label="VAT">{Number(item.vat ?? invoice.vatRate ?? 0)}%</Detail>
                    <Detail label="Line total">{fmt(total)}</Detail>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="pw-detail-items-desktop pw-table-wrap">
            <table className="pw-table">
              <thead>
                <tr><th>#</th><th>Description</th><th>Type</th><th>Qty</th><th>Rate</th><th>VAT</th><th>Total</th></tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const quantity = Number(item.quantity ?? item.qty ?? 0);
                  const rate = Number(item.unitPrice ?? item.rate ?? 0);
                  return (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td className="font-semibold text-[#111c34]">{item.description || item.desc || "—"}</td>
                      <td>{item.itemType || item.type || "—"}</td>
                      <td>{quantity}</td>
                      <td>{fmt(rate)}</td>
                      <td>{Number(item.vat ?? invoice.vatRate ?? 0)}%</td>
                      <td className="font-bold text-[#111c34]">{fmt(item.totalPrice ?? quantity * rate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="pw-document-bottom-grid">
          <div className="space-y-4">
            <div className="pw-note-box">
              <p className="pw-eyebrow">Notes and terms</p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                {invoice.notes || "No additional notes were added."}
              </p>
            </div>

            <section className="pw-summary-panel">
              <p className="pw-eyebrow">Payment history</p>
              <div className="mt-3 grid gap-2">
                {invoice.payments?.length ? (
                  invoice.payments.map((payment) => (
                    <article key={payment.id} className="pw-payment-row">
                      <div className="min-w-0">
                        <strong>{fmt(payment.amount)}</strong>
                        <p>{payment.paymentMethod} · {niceDate(payment.paymentDate)}{payment.reference ? ` · ${payment.reference}` : ""}</p>
                      </div>
                      <small>{payment.recordedBy?.name || "Workshop team"}</small>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-[#98a2b3]">No payments recorded.</p>
                )}
              </div>
            </section>
          </div>

          <TotalsBox
            subtotal={invoice.subtotal}
            vat={invoice.vatAmt}
            vatPercentage={invoice.vatRate}
            discount={invoice.discount}
            LabourCharge={invoice.labourCharge}
            total={invoice.total}
            paidAmount={invoice.paid}
            balance={invoice.balance}
          />
        </div>
      </div>
    </Modal>
  );
}
