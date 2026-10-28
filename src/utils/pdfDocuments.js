import jsPDF from "jspdf";
import moment from "moment";

const BRAND = {
  navy: [10, 22, 40],
  blue: [49, 87, 213],
  blueSoft: [238, 244, 255],
  text: [17, 28, 52],
  muted: [102, 112, 133],
  line: [220, 228, 239],
  paper: [255, 255, 255],
  surface: [248, 250, 252],
  success: [6, 118, 71],
  danger: [180, 35, 24],
};

const PAGE = { width: 210, height: 297, margin: 15, footerTop: 282 };
const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2;

const clean = (value, fallback = "—") => {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value).replace(/\s+/g, " ").trim() || fallback;
};

const money = (value) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const date = (value, includeTime = false) => {
  if (!value || value === "0000-00-00") return "—";
  const parsed = moment(value);
  if (!parsed.isValid()) return clean(value);
  return parsed.format(includeTime ? "D MMM YYYY, HH:mm" : "D MMM YYYY");
};

const safeFilename = (value) => clean(value, "document").replace(/[^a-z0-9-_]+/gi, "_");

const statusColour = (status) => {
  const normalised = clean(status, "").toLowerCase();
  if (["paid", "approved", "completed", "active", "confirmed"].includes(normalised)) return BRAND.success;
  if (["rejected", "cancelled", "void", "overdue", "failed"].includes(normalised)) return BRAND.danger;
  return BRAND.blue;
};

const lineHeight = 4.35;

const createRenderer = (doc, meta) => {
  let y = PAGE.margin;
  let pageNumber = 1;

  const setText = (colour = BRAND.text, size = 9, style = "normal") => {
    doc.setTextColor(...colour);
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  };

  const drawContinuationHeader = () => {
    doc.setFillColor(...BRAND.navy);
    doc.rect(0, 0, PAGE.width, 13, "F");
    setText(BRAND.paper, 8.5, "bold");
    doc.text("PRESTIGEWORKSHOPS", PAGE.margin, 8.2);
    setText([198, 211, 232], 7, "normal");
    doc.text(`${meta.type} · ${meta.number}`, PAGE.width - PAGE.margin, 8.2, { align: "right" });
    y = 20;
  };

  const addPage = () => {
    doc.addPage();
    pageNumber += 1;
    drawContinuationHeader();
  };

  const ensure = (height) => {
    if (y + height > PAGE.footerTop - 4) addPage();
  };

  const roundedBox = (x, top, width, height, fill = BRAND.surface, stroke = BRAND.line, radius = 3) => {
    doc.setFillColor(...fill);
    doc.setDrawColor(...stroke);
    doc.roundedRect(x, top, width, height, radius, radius, "FD");
  };

  const split = (value, width, maxLines) => {
    const lines = doc.splitTextToSize(clean(value), width);
    if (!maxLines || lines.length <= maxLines) return lines;
    const clipped = lines.slice(0, maxLines);
    clipped[maxLines - 1] = `${clipped[maxLines - 1].replace(/[.…]+$/, "")}…`;
    return clipped;
  };

  const drawBrandHeader = () => {
    doc.setFillColor(...BRAND.navy);
    doc.rect(0, 0, PAGE.width, 43, "F");
    doc.setFillColor(...BRAND.blue);
    doc.roundedRect(PAGE.margin, 10, 23, 23, 5, 5, "F");
    setText(BRAND.paper, 15, "bold");
    doc.text("PW", PAGE.margin + 11.5, 24.8, { align: "center" });
    setText(BRAND.paper, 14, "bold");
    doc.text("the Mechanic", PAGE.margin + 29, 18.5);
    setText([187, 201, 224], 7.5, "normal");
    doc.text("INDEPENDENT VEHICLE CARE · CLEAR RECORDS", PAGE.margin + 29, 24.5);
    setText(BRAND.paper, 15, "bold");
    doc.text(meta.type.toUpperCase(), PAGE.width - PAGE.margin, 18, { align: "right" });
    setText([187, 201, 224], 8, "normal");
    doc.text(meta.number, PAGE.width - PAGE.margin, 25, { align: "right" });
    y = 51;
  };

  const drawDocumentStrip = () => {
    const entries = [
      ["Document", meta.number],
      ["Date", meta.date],
      ["Status", meta.status],
      ["Prepared", moment().format("D MMM YYYY")],
    ];
    const width = CONTENT_WIDTH / entries.length;
    roundedBox(PAGE.margin, y, CONTENT_WIDTH, 18, BRAND.blueSoft, [204, 218, 255], 4);
    entries.forEach(([label, value], index) => {
      const x = PAGE.margin + index * width;
      if (index) {
        doc.setDrawColor(204, 218, 255);
        doc.line(x, y + 3, x, y + 15);
      }
      setText(BRAND.muted, 6.6, "bold");
      doc.text(label.toUpperCase(), x + 4, y + 6.3);
      setText(index === 2 ? statusColour(value) : BRAND.text, 8.2, "bold");
      const lines = split(value, width - 8, 2);
      doc.text(lines, x + 4, y + 11.3);
    });
    y += 24;
  };

  const sectionTitle = (title, subtitle) => {
    ensure(subtitle ? 14 : 10);
    setText(BRAND.blue, 7, "bold");
    doc.text(clean(title).toUpperCase(), PAGE.margin, y);
    doc.setDrawColor(...BRAND.line);
    doc.line(PAGE.margin + 42, y - 1, PAGE.width - PAGE.margin, y - 1);
    y += 5;
    if (subtitle) {
      setText(BRAND.muted, 7.5, "normal");
      const lines = split(subtitle, CONTENT_WIDTH, 3);
      doc.text(lines, PAGE.margin, y);
      y += lines.length * lineHeight + 1;
    }
  };

  const keyValueGrid = (title, entries, columns = 2) => {
    sectionTitle(title);
    const gap = 4;
    const cellWidth = (CONTENT_WIDTH - gap * (columns - 1)) / columns;
    for (let index = 0; index < entries.length; index += columns) {
      const row = entries.slice(index, index + columns);
      const rowLines = row.map((entry) => split(entry.value, cellWidth - 8, 5));
      const height = Math.max(17, ...rowLines.map((lines) => 10 + lines.length * lineHeight));
      ensure(height + 4);
      row.forEach((entry, cellIndex) => {
        const x = PAGE.margin + cellIndex * (cellWidth + gap);
        roundedBox(x, y, cellWidth, height, BRAND.surface, BRAND.line, 3.5);
        setText(BRAND.muted, 6.3, "bold");
        doc.text(clean(entry.label).toUpperCase(), x + 4, y + 5.3);
        setText(BRAND.text, 8.2, "bold");
        doc.text(rowLines[cellIndex], x + 4, y + 10.2);
      });
      y += height + 4;
    }
    y += 2;
  };

  const tableHeader = (columns) => {
    const height = 9;
    doc.setFillColor(...BRAND.navy);
    doc.rect(PAGE.margin, y, CONTENT_WIDTH, height, "F");
    let x = PAGE.margin;
    columns.forEach((column) => {
      setText(BRAND.paper, 6.6, "bold");
      doc.text(column.label.toUpperCase(), x + 2.2, y + 5.8, { align: column.align || "left" });
      x += column.width;
    });
    y += height;
  };

  const itemsTable = (items = [], vatRate = 0) => {
    sectionTitle("Parts, labour and services", "A clear line-by-line record of the work, parts and charges included in this document.");
    const columns = [
      { key: "index", label: "#", width: 9 },
      { key: "description", label: "Description", width: 70 },
      { key: "type", label: "Type", width: 25 },
      { key: "quantity", label: "Qty", width: 14, align: "right" },
      { key: "rate", label: "Rate", width: 28, align: "right" },
      { key: "total", label: "Total", width: 34, align: "right" },
    ];
    ensure(22);
    tableHeader(columns);

    if (!items.length) {
      roundedBox(PAGE.margin, y, CONTENT_WIDTH, 16, BRAND.surface, BRAND.line, 0);
      setText(BRAND.muted, 8, "normal");
      doc.text("No line items were added.", PAGE.margin + 4, y + 9.5);
      y += 20;
      return;
    }

    items.forEach((item, index) => {
      const description = clean(item.description || item.desc, "Untitled item");
      const descriptionLines = split(description, 64, 8);
      const typeLines = split(item.itemType || item.type || "Service", 21, 3);
      const rowHeight = Math.max(11, 5 + Math.max(descriptionLines.length, typeLines.length) * lineHeight);
      if (y + rowHeight > PAGE.footerTop - 4) {
        addPage();
        tableHeader(columns);
      }
      if (index % 2 === 1) {
        doc.setFillColor(...BRAND.surface);
        doc.rect(PAGE.margin, y, CONTENT_WIDTH, rowHeight, "F");
      }
      doc.setDrawColor(...BRAND.line);
      doc.line(PAGE.margin, y + rowHeight, PAGE.width - PAGE.margin, y + rowHeight);
      const quantity = Number(item.quantity ?? item.qty ?? 0);
      const rate = Number(item.unitPrice ?? item.rate ?? item.totalPrice ?? 0);
      const total = Number(item.totalPrice ?? quantity * rate);
      const values = {
        index: String(index + 1),
        description: descriptionLines,
        type: typeLines,
        quantity: String(quantity),
        rate: money(rate),
        total: money(total),
      };
      let x = PAGE.margin;
      columns.forEach((column) => {
        setText(column.key === "total" ? BRAND.text : BRAND.muted, 7.2, column.key === "total" || column.key === "description" ? "bold" : "normal");
        const textX = column.align === "right" ? x + column.width - 2.2 : x + 2.2;
        doc.text(values[column.key], textX, y + 6, { align: column.align || "left" });
        x += column.width;
      });
      y += rowHeight;
    });
    setText(BRAND.muted, 6.6, "normal");
    doc.text(`VAT reference rate: ${Number(vatRate || 0)}%`, PAGE.width - PAGE.margin, y + 5, { align: "right" });
    y += 10;
  };

  const notes = (title, value) => {
    sectionTitle(title);
    const lines = split(value || "No additional notes were added.", CONTENT_WIDTH - 10);
    const chunks = [];
    for (let i = 0; i < lines.length; i += 34) chunks.push(lines.slice(i, i + 34));
    chunks.forEach((chunk, chunkIndex) => {
      const height = Math.max(17, 9 + chunk.length * lineHeight);
      ensure(height + 4);
      roundedBox(PAGE.margin, y, CONTENT_WIDTH, height, BRAND.surface, BRAND.line, 3.5);
      doc.setFillColor(...BRAND.blue);
      doc.roundedRect(PAGE.margin, y, 2.2, height, 1.1, 1.1, "F");
      setText(BRAND.muted, 7.4, "normal");
      doc.text(chunk, PAGE.margin + 6, y + 7.2);
      y += height + 4;
      if (chunkIndex < chunks.length - 1) addPage();
    });
    y += 2;
  };

  const totals = (values = {}) => {
    const rows = [
      ["Subtotal", money(values.subtotal)],
      ["Labour charge", money(values.labourCharge)],
      [`VAT (${Number(values.vatPercentage || 0)}%)`, money(values.vat)],
      ["Discount", `- ${money(values.discount)}`],
    ];
    if (values.paidAmount !== undefined) rows.push(["Paid", money(values.paidAmount)]);
    if (values.balance !== undefined) rows.push(["Balance", money(values.balance)]);
    const height = 13 + rows.length * 7 + 13;
    ensure(height + 8);
    const width = 78;
    const x = PAGE.width - PAGE.margin - width;
    roundedBox(x, y, width, height, BRAND.blueSoft, [202, 215, 255], 4);
    setText(BRAND.blue, 6.6, "bold");
    doc.text("COMMERCIAL SUMMARY", x + 5, y + 7);
    let cursor = y + 13;
    rows.forEach(([label, value]) => {
      setText(BRAND.muted, 7.4, "normal");
      doc.text(label, x + 5, cursor);
      const colour = label === "Balance" && Number(values.balance || 0) > 0 ? BRAND.danger : label === "Paid" ? BRAND.success : BRAND.text;
      setText(colour, 7.6, "bold");
      doc.text(value, x + width - 5, cursor, { align: "right" });
      cursor += 7;
    });
    doc.setDrawColor(183, 201, 255);
    doc.line(x + 5, cursor - 1.8, x + width - 5, cursor - 1.8);
    setText(BRAND.text, 9.4, "bold");
    doc.text("TOTAL", x + 5, cursor + 5);
    doc.text(money(values.total), x + width - 5, cursor + 5, { align: "right" });
    y += height + 8;
  };

  const paymentHistory = (payments = []) => {
    if (!payments.length) return;
    sectionTitle("Payment history", "Recorded payments associated with this invoice.");
    payments.forEach((payment, index) => {
      const reference = clean(payment.reference, "No reference");
      const note = clean(payment.notes, "");
      const metaLines = split(`${clean(payment.paymentMethod, "Payment")} · ${date(payment.paymentDate)} · ${reference}`, CONTENT_WIDTH - 42, 3);
      const noteLines = note ? split(note, CONTENT_WIDTH - 42, 3) : [];
      const height = Math.max(16, 9 + (metaLines.length + noteLines.length) * lineHeight);
      ensure(height + 3);
      roundedBox(PAGE.margin, y, CONTENT_WIDTH, height, index % 2 ? BRAND.surface : BRAND.paper, BRAND.line, 3);
      setText(BRAND.success, 9, "bold");
      doc.text(money(payment.amount), PAGE.margin + 5, y + 8);
      setText(BRAND.muted, 7.2, "normal");
      doc.text(metaLines, PAGE.margin + 39, y + 6.5);
      if (noteLines.length) doc.text(noteLines, PAGE.margin + 39, y + 6.5 + metaLines.length * lineHeight);
      y += height + 3;
    });
    y += 2;
  };

  const finalise = () => {
    const pages = doc.getNumberOfPages();
    for (let page = 1; page <= pages; page += 1) {
      doc.setPage(page);
      doc.setDrawColor(...BRAND.line);
      doc.line(PAGE.margin, PAGE.footerTop, PAGE.width - PAGE.margin, PAGE.footerTop);
      setText(BRAND.muted, 6.6, "normal");
      doc.text("the Mechanic · Clear estimates · Organised digital records", PAGE.margin, PAGE.footerTop + 5);
      doc.text(`${meta.number} · Page ${page} of ${pages}`, PAGE.width - PAGE.margin, PAGE.footerTop + 5, { align: "right" });
      doc.text("This document is generated from the workshop management system.", PAGE.margin, PAGE.footerTop + 9.2);
    }
  };

  return {
    drawBrandHeader,
    drawDocumentStrip,
    keyValueGrid,
    itemsTable,
    notes,
    totals,
    paymentHistory,
    finalise,
  };
};

const buildPdf = ({ type, number, status, documentDate, customer = {}, vehicle = {}, details = [], items = [], notes: noteText, totals = {}, payments = [] }) => {
  const meta = {
    type: clean(type, "Workshop document"),
    number: clean(number, "Unknown"),
    status: clean(status, "Draft"),
    date: date(documentDate),
  };
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  doc.setProperties({
    title: `${meta.type} ${meta.number}`,
    subject: `the Mechanic ${meta.type}`,
    author: "the Mechanic",
    creator: "the Mechanic workshop management system",
  });
  const renderer = createRenderer(doc, meta);
  renderer.drawBrandHeader();
  renderer.drawDocumentStrip();
  renderer.keyValueGrid("Customer", [
    { label: "Name", value: customer.name || customer.customerName },
    { label: "Telephone", value: customer.phone || customer.telephone },
    { label: "Email", value: customer.email },
    { label: "Address", value: customer.address },
  ]);
  renderer.keyValueGrid("Vehicle", [
    { label: "Registration", value: vehicle.registrationNumber || vehicle.registration || vehicle.vehicleRegistration },
    { label: "Make and model", value: [vehicle.make, vehicle.model].filter(Boolean).join(" ") || vehicle.description || vehicle.vehicleDescription },
    { label: "Year / mileage", value: [vehicle.year, vehicle.mileage].filter((value) => value !== undefined && value !== null && value !== "").join(" · ") },
    { label: "VIN", value: vehicle.vinNumber || vehicle.vin },
  ]);
  if (details.length) renderer.keyValueGrid("Document details", details, 2);
  renderer.itemsTable(items, totals.vatPercentage);
  renderer.notes(type === "Job sheet" ? "Workshop notes" : "Notes and terms", noteText);
  renderer.paymentHistory(payments);
  renderer.totals(totals);
  renderer.finalise();
  return { doc, filename: `${safeFilename(type)}_${safeFilename(number)}_${moment().format("YYYY-MM-DD")}.pdf` };
};

const outputPdf = (config, mode = "download") => {
  const { doc, filename } = buildPdf(config);
  if (mode === "print") {
    if (typeof doc.autoPrint === "function") doc.autoPrint();
    const url = doc.output("bloburl");
    const popup = typeof window !== "undefined" ? window.open(url, "_blank", "noopener,noreferrer") : null;
    if (!popup) doc.save(filename);
    return Boolean(popup);
  }
  doc.save(filename);
  return true;
};

export const estimatePdfConfig = (record = {}) => ({
  type: "Estimate",
  number: record.estimateNumber || record.id,
  status: record.status,
  documentDate: record.estimateDate || record.createdAt,
  customer: record.customer || {},
  vehicle: record.vehicle || {},
  details: [
    { label: "Valid until", value: date(record.validUntil) },
    { label: "Created", value: date(record.createdAt || record.estimateDate, true) },
    { label: "Item count", value: (record.items || []).length },
    { label: "VAT rate", value: `${Number(record.vatPercentage || 0)}%` },
  ],
  items: record.items || [],
  notes: record.notes,
  totals: {
    subtotal: record.subtotal || 0,
    labourCharge: record.labourRate || record.labourCharge || 0,
    vat: record.vatAmount || 0,
    vatPercentage: record.vatPercentage || 0,
    discount: record.discount || record.defaultDiscount || 0,
    total: record.total || 0,
  },
});

export const jobSheetPdfConfig = (record = {}) => ({
  type: "Job sheet",
  number: record.jobNumber || record.id,
  status: record.status,
  documentDate: record.startDate || record.createdAt,
  customer: record.customer || {},
  vehicle: { ...(record.vehicle || {}), mileage: record.vehicleMileage || record.vehicle?.mileage },
  details: [
    { label: "Priority", value: record.priority },
    { label: "Technician", value: record.technicianName },
    { label: "Service advisor", value: record.serviceAdvisor },
    { label: "Start date", value: date(record.startDate) },
  ],
  items: record.items || [],
  notes: record.notes,
  totals: {
    subtotal: record.subtotal || record.totalPrice || 0,
    labourCharge: record.labourRate || record.labourCharge || 0,
    vat: record.vatAmount || 0,
    vatPercentage: record.vatPercentage || 0,
    discount: record.discount || 0,
    total: record.total || 0,
  },
});

export const invoicePdfConfig = (record = {}) => ({
  type: "Invoice",
  number: record.invoiceNumber || record.id,
  status: record.status,
  documentDate: record.invoiceDate || record.date || record.createdAt,
  customer: record.customerRecord || (record.customer && typeof record.customer === "object" ? record.customer : {
    name: record.customerName || record.customer,
    phone: record.customerPhone,
    email: record.customerEmail,
    address: record.customerAddress,
  }),
  vehicle: record.vehicleRecord || (record.vehicle && typeof record.vehicle === "object" ? record.vehicle : {
    registrationNumber: record.vehicleRegistration || record.vehicle,
    description: record.vehicleDescription || record.make,
  }),
  details: [
    { label: "Due date", value: date(record.dueDate || record.due) },
    { label: "Payment method", value: record.paymentMethod || "—" },
    { label: "Estimate reference", value: record.estimateId || "—" },
    { label: "Job sheet reference", value: record.jobSheetId || "—" },
  ],
  items: record.items || [],
  notes: record.notes,
  payments: record.payments || [],
  totals: {
    subtotal: record.subtotal || 0,
    labourCharge: record.labourCharge || 0,
    vat: record.vatAmount ?? record.vatAmt ?? 0,
    vatPercentage: record.vatPercentage ?? record.vatRate ?? 0,
    discount: record.discount || 0,
    total: record.total || 0,
    paidAmount: record.paidAmount ?? record.paid ?? 0,
    balance: record.balance ?? Math.max(0, Number(record.total || 0) - Number(record.paidAmount ?? record.paid ?? 0)),
  },
});

export const downloadEstimatePdf = (record) => outputPdf(estimatePdfConfig(record));
export const printEstimatePdf = (record) => outputPdf(estimatePdfConfig(record), "print");
export const downloadJobSheetPdf = (record) => outputPdf(jobSheetPdfConfig(record));
export const printJobSheetPdf = (record) => outputPdf(jobSheetPdfConfig(record), "print");
export const downloadInvoicePdf = (record) => outputPdf(invoicePdfConfig(record));
export const printInvoicePdf = (record) => outputPdf(invoicePdfConfig(record), "print");
