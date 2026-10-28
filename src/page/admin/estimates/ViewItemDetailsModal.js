import { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { RiDownloadLine, RiPrinterLine } from "react-icons/ri";
import { Modal } from "../../../components/ui/Modal";
import { Badge, BtnBlue, BtnGhost, RegPlate, TotalsBox } from "../../../components/ui/UI";
import { downloadEstimatePdf, printEstimatePdf } from "../../../utils/pdfDocuments";

const Detail = ({ label, children }) => (
  <div className="pw-detail-tile">
    <span>{label}</span>
    <strong>{children || "—"}</strong>
  </div>
);

export default function ViewItemDetailsModal({ setViewing, viewing }) {
  const [downloading, setDownloading] = useState(false);

  const handlePdfAction = async (mode) => {
    if (!viewing || downloading) return;
    setDownloading(mode);
    try {
      await Promise.resolve(mode === "print" ? printEstimatePdf(viewing) : downloadEstimatePdf(viewing));
    } catch (error) {
      console.error(error);
      toast.error("Unable to prepare the estimate PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (!viewing) return null;
  const items = viewing.items || [];

  return (
    <Modal
      title={viewing.estimateNumber || `Estimate #${viewing.id}`}
      sub="Customer, vehicle, item and total summary"
      size="lg"
      onClose={() => setViewing(null)}
      open={Boolean(viewing)}
      footer={
        <>
          <BtnGhost type="button" onClick={() => setViewing(null)}>Close</BtnGhost>
          <BtnGhost type="button" disabled={Boolean(downloading)} onClick={() => handlePdfAction("print")}>
            <RiPrinterLine /> {downloading === "print" ? "Preparing…" : "Print / Save PDF"}
          </BtnGhost>
          <BtnBlue type="button" disabled={Boolean(downloading)} onClick={() => handlePdfAction("download")}>
            <RiDownloadLine /> {downloading === "download" ? "Preparing PDF…" : "Download PDF"}
          </BtnBlue>
        </>
      }
    >
      <div id="estimate-modal-content" className="space-y-5 bg-white">
        <div className="flex flex-col gap-3 rounded-2xl border border-[#dce4ef] bg-[#f8fafc] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="pw-eyebrow">Estimate summary</p>
            <p className="mt-1 text-sm text-[#667085]">
              Created {viewing.estimateDate ? moment(viewing.estimateDate).format("D MMM YYYY, HH:mm") : "—"}
            </p>
          </div>
          <Badge status={viewing.status} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <section className="pw-summary-panel">
            <p className="pw-eyebrow">Customer</p>
            <div className="mt-3 grid gap-2">
              <Detail label="Name">{viewing.customer?.name}</Detail>
              <Detail label="Phone">{viewing.customer?.phone}</Detail>
              <Detail label="Email">{viewing.customer?.email}</Detail>
              <Detail label="Address">{viewing.customer?.address}</Detail>
            </div>
          </section>
          <section className="pw-summary-panel">
            <p className="pw-eyebrow">Vehicle</p>
            <div className="mt-3 grid gap-2">
              <Detail label="Registration"><RegPlate reg={viewing.vehicle?.registrationNumber} /></Detail>
              <Detail label="Make and model">{[viewing.vehicle?.make, viewing.vehicle?.model].filter(Boolean).join(" ")}</Detail>
              <Detail label="Year">{viewing.vehicle?.year}</Detail>
              <Detail label="VIN">{viewing.vehicle?.vinNumber}</Detail>
            </div>
          </section>
          <section className="pw-summary-panel sm:col-span-2 xl:col-span-1">
            <p className="pw-eyebrow">Commercial details</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <Detail label="Estimate number">{viewing.estimateNumber || viewing.id}</Detail>
              <Detail label="Valid until">{viewing.validUntil && viewing.validUntil !== "0000-00-00" ? moment(viewing.validUntil).format("D MMM YYYY") : "—"}</Detail>
              <Detail label="VAT rate">{viewing.vatPercentage ?? 0}%</Detail>
              <Detail label="Item count">{items.length}</Detail>
            </div>
          </section>
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="pw-eyebrow">Repair items</p>
              <h3 className="mt-1 text-base font-extrabold text-[#111c34]">Parts, labour and services</h3>
            </div>
          </div>

          <div className="pw-detail-items-mobile">
            {items.map((item, index) => (
              <article key={item.id || index} className="pw-line-item-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="pw-eyebrow">Item {index + 1}</p>
                    <h4 className="mt-1 break-words font-extrabold text-[#111c34]">{item.description || "Untitled item"}</h4>
                  </div>
                  <Badge status={item.itemType || item.type || "Service"} />
                </div>
                <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 text-sm">
                  <Detail label="Quantity">{item.quantity ?? 0}</Detail>
                  <Detail label="Rate">£{Number(item.unitPrice ?? item.totalPrice ?? 0).toFixed(2)}</Detail>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#eef3ff] px-3 py-2 text-sm">
                  <span className="font-semibold text-[#667085]">Line total</span>
                  <strong className="text-[#111c34]">£{Number(item.totalPrice || 0).toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>

          <div className="pw-detail-items-desktop pw-table-wrap">
            <table className="pw-table">
              <thead><tr><th>#</th><th>Description</th><th>Type</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td className="font-semibold text-[#111c34]">{item.description || "—"}</td>
                    <td>{item.itemType || item.type || "—"}</td>
                    <td>{item.quantity ?? 0}</td>
                    <td>£{Number(item.unitPrice ?? item.totalPrice ?? 0).toFixed(2)}</td>
                    <td className="font-bold text-[#111c34]">£{Number(item.totalPrice || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start">
          <div className="pw-note-box">
            <p className="pw-eyebrow">Notes</p>
            <p className="mt-2 break-words text-sm leading-6">{viewing.notes || "No additional notes were added."}</p>
          </div>
          <TotalsBox
            subtotal={viewing.subtotal || 0}
            vat={viewing.vatAmount || 0}
            vatPercentage={viewing.vatPercentage || 0}
            discount={viewing.discount || viewing.defaultDiscount || 0}
            LabourCharge={viewing.labourRate || 0}
            total={viewing.total || 0}
          />
        </div>
      </div>
    </Modal>
  );
}
