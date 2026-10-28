// ─── CUSTOMERS ───────────────────────────────────────────────────────────────
export const customers = [
  {
    id: "C-001",
    name: "John Smith",
    phone: "07700 900123",
    email: "johnsmith@email.com",
    address: "12 Park Road, London, SW1A 1AA",
    vehicles: ["V-001"],
  },
  {
    id: "C-002",
    name: "Sarah Bloom",
    phone: "07800 123456",
    email: "sarah.bloom@email.com",
    address: "45 Oak Avenue, Manchester, M1 2AB",
    vehicles: ["V-002"],
  },
  {
    id: "C-003",
    name: "Omar Hassan",
    phone: "07900 654321",
    email: "omar.h@email.com",
    address: "78 Elm Street, Birmingham, B2 3CD",
    vehicles: ["V-003"],
  },
  {
    id: "C-004",
    name: "Mark Johnson",
    phone: "07700 111222",
    email: "mark.j@email.com",
    address: "22 High Street, Leeds, LS1 4EF",
    vehicles: ["V-004"],
  },
  {
    id: "C-005",
    name: "Emily Davis",
    phone: "07800 333444",
    email: "emily.d@email.com",
    address: "9 River Lane, Bristol, BS1 5GH",
    vehicles: ["V-005"],
  },
];

// ─── VEHICLES ─────────────────────────────────────────────────────────────────
export const vehicles = [
  {
    id: "V-001",
    reg: "AB12 CDE",
    make: "BMW",
    model: "320d M Sport",
    year: 2018,
    vin: "WBA8E120X0K123456",
    mileage: "58,750 Miles",
    customerId: "C-001",
  },
  {
    id: "V-002",
    reg: "SB71 ABC",
    make: "Mercedes",
    model: "C220",
    year: 2021,
    vin: "WDD2050072R123456",
    mileage: "22,400 Miles",
    customerId: "C-002",
  },
  {
    id: "V-003",
    reg: "OH22 TRE",
    make: "Audi",
    model: "A4 2.0T",
    year: 2022,
    vin: "WAUZZZF4XNA123456",
    mileage: "15,200 Miles",
    customerId: "C-003",
  },
  {
    id: "V-004",
    reg: "MJ65 XYZ",
    make: "Ford",
    model: "Focus ST",
    year: 2019,
    vin: "WF0FXXGBBFKL12345",
    mileage: "47,100 Miles",
    customerId: "C-004",
  },
  {
    id: "V-005",
    reg: "ED20 LMN",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    vin: "SB1ZS3JE80E123456",
    mileage: "33,600 Miles",
    customerId: "C-005",
  },
];

// ─── ESTIMATES ────────────────────────────────────────────────────────────────
export const initialEstimates = [
  {
    id: "EST-10045",
    customerId: "C-001",
    vehicleId: "V-001",
    date: "20/05/2024",
    validUntil: "27/05/2024",
    status: "Draft",
    notes:
      "Brake pads are original quality. Please approve the estimate to proceed.",
    items: [
      {
        id: 1,
        desc: "Front Brake Pads",
        type: "Parts",
        qty: 1,
        rate: 80,
        vat: 20,
        total: 80,
      },
      {
        id: 2,
        desc: "Labour (Replace Brake Pads)",
        type: "Labour",
        qty: 2,
        rate: 50,
        vat: 20,
        total: 100,
      },
    ],
  },
  {
    id: "EST-10044",
    customerId: "C-002",
    vehicleId: "V-002",
    date: "19/05/2024",
    validUntil: "26/05/2024",
    status: "Approved",
    notes: "Timing belt replacement recommended. All genuine parts.",
    items: [
      {
        id: 1,
        desc: "Timing Belt Kit",
        type: "Parts",
        qty: 1,
        rate: 180,
        vat: 20,
        total: 180,
      },
      {
        id: 2,
        desc: "Labour (Timing Belt)",
        type: "Labour",
        qty: 4,
        rate: 65,
        vat: 20,
        total: 260,
      },
    ],
  },
  {
    id: "EST-10043",
    customerId: "C-003",
    vehicleId: "V-003",
    date: "18/05/2024",
    validUntil: "25/05/2024",
    status: "Sent",
    notes: "Full service including oil, filters and brake check.",
    items: [
      {
        id: 1,
        desc: "Full Service",
        type: "Labour",
        qty: 1,
        rate: 120,
        vat: 20,
        total: 120,
      },
      {
        id: 2,
        desc: "Oil & Filter",
        type: "Parts",
        qty: 1,
        rate: 45,
        vat: 20,
        total: 45,
      },
    ],
  },
];

// ─── JOB SHEETS ───────────────────────────────────────────────────────────────
export const initialJobSheets = [
  {
    id: "JOB-10023",
    estId: "EST-10044",
    customerId: "C-002",
    vehicleId: "V-002",
    date: "20/05/2024",
    status: "In Progress",
    mechanic: "Michael Brown",
    startDate: "20/05/2024 10:00 AM",
    endDate: "20/05/2024 04:00 PM",
    progress: 60,
    workDesc: [
      "Replace timing belt",
      "Check coolant level",
      "Inspect pulleys",
      "Road test vehicle",
    ],
    checklist: {
      vehicleReceived: true,
      workStarted: true,
      partsOrdered: false,
      repairCompleted: false,
      qualityCheck: false,
      readyForCollection: false,
    },
    progressLog: [
      { label: "Work Started", date: "20/05/2024 10:15 AM", done: true },
      { label: "Parts Ordered", date: "20/05/2024 10:30 AM", done: true },
      { label: "Repair in Progress", date: null, done: false },
      { label: "Job Completed", date: null, done: false },
    ],
    notes: "Customer informed about additional wear on rear brake pads.",
    items: [
      {
        id: 1,
        desc: "Timing Belt Kit",
        type: "Parts",
        qty: 1,
        rate: 180,
        vat: 20,
        total: 180,
      },
      {
        id: 2,
        desc: "Labour",
        type: "Labour",
        qty: 4,
        rate: 65,
        vat: 20,
        total: 260,
      },
    ],
  },
  {
    id: "JOB-10022",
    estId: "",
    customerId: "C-001",
    vehicleId: "V-001",
    date: "18/05/2024",
    status: "Completed",
    mechanic: "Raj Singh",
    startDate: "18/05/2024 09:00 AM",
    endDate: "18/05/2024 12:00 PM",
    progress: 100,
    workDesc: [
      "Replace front brake pads",
      "Check brake fluid",
      "Inspect brake discs",
      "Road test vehicle",
    ],
    checklist: {
      vehicleReceived: true,
      workStarted: true,
      partsOrdered: true,
      repairCompleted: true,
      qualityCheck: true,
      readyForCollection: true,
    },
    progressLog: [
      { label: "Work Started", date: "18/05/2024 09:15 AM", done: true },
      { label: "Parts Ordered", date: "18/05/2024 09:30 AM", done: true },
      { label: "Repair in Progress", date: "18/05/2024 10:00 AM", done: true },
      { label: "Job Completed", date: "18/05/2024 11:45 AM", done: true },
    ],
    notes: "",
    items: [
      {
        id: 1,
        desc: "Front Brake Pads",
        type: "Parts",
        qty: 1,
        rate: 80,
        vat: 20,
        total: 80,
      },
      {
        id: 2,
        desc: "Labour (Replace Brake Pads)",
        type: "Labour",
        qty: 2,
        rate: 50,
        vat: 20,
        total: 100,
      },
    ],
  },
];

// ─── INVOICES ─────────────────────────────────────────────────────────────────
export const initialInvoices = [
  {
    id: "INV-10015",
    jobId: "JOB-10022",
    customerId: "C-001",
    vehicleId: "V-001",
    invoiceDate: "21/05/2024",
    dueDate: "28/05/2024",
    status: "Paid",
    items: [
      {
        id: 1,
        desc: "Front Brake Pads",
        type: "Parts",
        qty: 1,
        rate: 80,
        vat: 20,
        total: 80,
      },
      {
        id: 2,
        desc: "Labour (Replace Brake Pads)",
        type: "Labour",
        qty: 2,
        rate: 50,
        vat: 20,
        total: 100,
      },
      {
        id: 3,
        desc: "Brake Fluid",
        type: "Parts",
        qty: 1,
        rate: 15,
        vat: 20,
        total: 15,
      },
    ],
    discount: 0,
    payment: {
      method: "Card",
      txn: "TXN123456789",
      date: "21/05/2024",
      amount: 234,
    },
    notes: "Thank you for your business!",
  },
  {
    id: "INV-10014",
    jobId: "JOB-10021",
    customerId: "C-003",
    vehicleId: "V-003",
    invoiceDate: "15/05/2024",
    dueDate: "22/05/2024",
    status: "Unpaid",
    items: [
      {
        id: 1,
        desc: "Full Service",
        type: "Labour",
        qty: 1,
        rate: 120,
        vat: 20,
        total: 120,
      },
      {
        id: 2,
        desc: "Oil & Filter",
        type: "Parts",
        qty: 1,
        rate: 45,
        vat: 20,
        total: 45,
      },
    ],
    discount: 0,
    payment: null,
    notes: "Payment due within 7 days.",
  },
];

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
export const initialPayments = [
  {
    id: "PAY-001",
    invId: "INV-10015",
    customerId: "C-001",
    amount: 234,
    method: "Card",
    txn: "TXN123456789",
    date: "21/05/2024",
    status: "Confirmed",
  },
  {
    id: "PAY-002",
    invId: "INV-10013",
    customerId: "C-004",
    amount: 180,
    method: "Cash",
    txn: "CASH-001",
    date: "10/05/2024",
    status: "Confirmed",
  },
  {
    id: "PAY-003",
    invId: "INV-10012",
    customerId: "C-005",
    amount: 95,
    method: "BACS",
    txn: "BACS-ABC001",
    date: "05/05/2024",
    status: "Confirmed",
  },
];

// ─── MECHANICS ────────────────────────────────────────────────────────────────
export const mechanics = [
  {
    id: "M-001",
    name: "Michael Brown",
    role: "Senior Mechanic",
    jobs: 24,
    rating: 4.9,
  },
  { id: "M-002", name: "Raj Singh", role: "Mechanic", jobs: 18, rating: 4.7 },
  { id: "M-003", name: "Lisa Carter", role: "Mechanic", jobs: 15, rating: 4.8 },
  { id: "M-004", name: "Sam Parker", role: "Apprentice", jobs: 8, rating: 4.5 },
];

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
export const activities = [
  {
    id: 1,
    text: "Estimate #EST-10045 created for John Smith",
    time: "10 mins ago",
    icon: "estimate",
  },
  {
    id: 2,
    text: "Job Sheet #JOB-10023 started",
    time: "30 mins ago",
    icon: "job",
  },
  {
    id: 3,
    text: "Invoice #INV-10015 paid by Mark Johnson",
    time: "1 hour ago",
    icon: "invoice",
  },
  {
    id: 4,
    text: "New customer Robert Brown added",
    time: "2 hours ago",
    icon: "customer",
  },
  {
    id: 5,
    text: "Job Sheet #JOB-10022 completed",
    time: "3 hours ago",
    icon: "job",
  },
];

// ─── CHART DATA ───────────────────────────────────────────────────────────────
export const revenueData = [
  { month: "Jan", revenue: 18400 },
  { month: "Feb", revenue: 21200 },
  { month: "Mar", revenue: 19800 },
  { month: "Apr", revenue: 24500 },
  { month: "May", revenue: 28650 },
  { month: "Jun", revenue: 22100 },
];

export const jobStatusData = [
  { name: "Open", value: 18, color: "#0a1628" },
  { name: "In Progress", value: 24, color: "#f59e0b" },
  { name: "Completed", value: 45, color: "#10b981" },
  { name: "On Hold", value: 3, color: "#ef4444" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const fmt = (n) => `£${Number(n || 0).toFixed(2)}`;
export const fmtInt = (n) => `£${Number(n || 0).toLocaleString()}`;
export const calcSubtotal = (items) =>
  items.reduce((s, i) => s + (i.totalPrice || 0), 0);
export const calcVat = (items) =>
  items.reduce((s, i) => s + ((i.totalPrice || 0) * (i.vat || 20)) / 100, 0);
export const calcTotal = (items, discount = 0, labourCharge) => {
  const sub = calcSubtotal(items);
  const vat = calcVat(items);
  return sub + vat + labourCharge - discount;
};
export const today = () => new Date().toLocaleDateString("en-GB");
export const pad = (prefix, n) => `${prefix}-${String(n).padStart(5, "0")}`;
