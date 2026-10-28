const numericOrEmpty = (value) => value === "" || value === null || value === undefined ? "" : Number(value);
const nullableNumber = (value) => value === "" || value === null || value === undefined ? null : Number(value);

export const toLineItemPayload = (item = {}, defaultVat = 0) => {
  const quantity = Number(item.quantity ?? item.qty ?? 0);
  const unitPrice = Number(item.unitPrice ?? item.rate ?? 0);
  const payload = {
    itemType: item.itemType || item.type || "Part",
    description: String(item.description ?? item.desc ?? "").trim(),
    quantity,
    unitPrice,
    vat: Number(item.vat ?? defaultVat ?? 0),
    totalPrice: Math.round((quantity * unitPrice + Number.EPSILON) * 100) / 100,
  };
  if (item.id) payload.id = Number(item.id);
  return payload;
};

export const toCustomerPayload = (values = {}) => ({
  name: String(values.name || "").trim(),
  email: String(values.email || "").trim(),
  phone: String(values.phone || "").trim(),
  address: String(values.address || "").trim(),
  customerCode: String(values.customerCode || "").trim(),
  telephone: String(values.telephone || "").trim(),
  gdprConsent: values.gdprConsent === true || values.gdprConsent === "true",
  creditTerms: String(values.creditTerms || "").trim(),
  alternativeAddress: String(values.alternativeAddress || "").trim(),
});

export const toVehiclePayload = (values = {}) => ({
  customerId: Number(values.customerId),
  registrationNumber: String(values.registrationNumber || "").replace(/\s+/g, "").toUpperCase(),
  make: String(values.make || "").trim(),
  model: String(values.model || "").trim(),
  year: nullableNumber(values.year),
  vinNumber: String(values.vinNumber || "").trim(),
  mileage: nullableNumber(values.mileage),
  engineNumber: String(values.engineNumber || "").trim(),
  fuelType: String(values.fuelType || "").trim(),
  colour: String(values.colour || "").trim(),
  cc: nullableNumber(values.cc),
  grossWeight: nullableNumber(values.grossWeight),
  taxDueDate: values.taxDueDate || "",
  motDueDate: values.motDueDate || "",
  nextServiceDate: values.nextServiceDate || "",
  lastMileage: nullableNumber(values.lastMileage),
});

export const toJobSheetPayload = (values = {}) => ({
  jobNumber: String(values.jobNumber || "").trim(),
  estimateId: Number(values.estimateId),
  customerId: Number(values.customerId),
  vehicleId: Number(values.vehicleId),
  technicianName: String(values.technicianName || "").trim(),
  vehicleMileage: numericOrEmpty(values.vehicleMileage),
  serviceAdvisor: String(values.serviceAdvisor || "").trim(),
  priority: values.priority || "Medium",
  status: values.status || "Open",
  startDate: values.startDate || "",
  completedDate: values.completedDate || "",
  labourRate: Number(values.labourRate || 0),
  notes: String(values.notes || "").trim(),
  vatPercentage: Number(values.vatPercentage ?? 20),
  discount: Number(values.discount || 0),
  items: (values.items || []).map((item) => toLineItemPayload(item, values.vatPercentage)),
});
