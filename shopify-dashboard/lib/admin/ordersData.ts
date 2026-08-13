export interface ProductItem {
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface CustomerInfo {
  name: string;
  ordersCount: string;
  email: string;
  phone: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    country: string;
    phone: string;
  };
}

export interface OrderDetail {
  id: string;
  cleanId: string;
  date: string;
  customer: CustomerInfo;
  channel: string;
  paymentStatus: "Paid" | "Payment pending" | "Authorized" | "Refunded";
  paymentType: "warning" | "neutral" | "danger" | "success";
  fulfillmentStatus: "Fulfilled" | "Unfulfilled" | "Partially fulfilled";
  deliveryStatus?: string;
  shippingMethod: string;
  shippingPrice: number;
  products: ProductItem[];
  subtotal: number;
  total: number;
  paid: number;
  balance: number;
  notes: string;
  status: "Open" | "Archived" | "Canceled";
  due?: boolean;
  alert?: boolean;
}

// Full Orders List matching the table in Orders Page
export const initialOrdersList = [
  { id: "#1015", date: "Tuesday at 3:57 pm", customer: "Fathima Hirshard", channel: "Online Store", total: "Rs 2,060.00", payment: "Payment pending", paymentType: "warning", fulfillment: "Fulfilled", items: "1 item", delivery: "", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1014", date: "Jul 27 at 11:00 pm", customer: "Isuru Abeyrama", channel: "Online Store", total: "Rs 3,960.00", payment: "Payment pending", paymentType: "warning", fulfillment: "Fulfilled", items: "1 item", delivery: "", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1013", date: "Jul 27 at 7:54 pm", customer: "E. P. H. De Silva", channel: "Draft Orders", total: "Rs 2,436.00", payment: "Payment pending", paymentType: "warning", fulfillment: "Fulfilled", items: "1 item", delivery: "", method: "Custom", alert: true, due: true, status: "Open" },
  { id: "#1012", date: "Jul 21 at 4:54 pm", customer: "fathima Raihana", channel: "Online Store", total: "Rs 4,200.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "1 item", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1011", date: "Jul 21 at 8:46 am", customer: "Pradeepa Prasadini", channel: "Online Store", total: "Rs 8,560.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "2 items", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1010", date: "Jul 9 at 7:21 pm", customer: "Manjula Karunanayaka", channel: "Online Store", total: "Rs 4,392.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "1 item", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1009", date: "Jul 3 at 4:38 pm", customer: "Victoria Bloom", channel: "Online Store", total: "Rs 3,400.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "1 item", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1008", date: "Jun 16 at 11:26 am", customer: "Dihan Hettige", channel: "Online Store", total: "Rs 1,812.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "2 items", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
  { id: "#1007", date: "Jun 12 at 6:19 am", customer: "Dahamsiri HA", channel: "Online Store", total: "Rs 12,324.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "3 items", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
  { id: "#1006", date: "Apr 1 at 11:53 am", customer: "Thilini Premachandra", channel: "Online Store", total: "Rs 10,536.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "10 items", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
  { id: "#1005", date: "Mar 6 at 1:17 pm", customer: "Isuru Weerasuriya", channel: "Online Store", total: "Rs 2,260.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "1 item", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
  { id: "#1004", date: "Feb 6 at 12:51 pm", customer: "Kalpana de Silva", channel: "Online Store", total: "Rs 11,820.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "6 items", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
  { id: "#1003", date: "Feb 3 at 10:56 pm", customer: "Imalka Nishadi", channel: "Online Store", total: "Rs 4,140.00", payment: "Paid", paymentType: "neutral", fulfillment: "Unfulfilled", items: "2 items", delivery: "", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1002", date: "Jan 28 at 2:41 pm", customer: "Zainab Fathima", channel: "Online Store", total: "Rs 2,220.00", payment: "Paid", paymentType: "neutral", fulfillment: "Unfulfilled", items: "1 item", delivery: "", method: "Flat Shipping Rate", alert: false, due: false, status: "Open" },
  { id: "#1001", date: "Dec 11 at 6:23 pm", customer: "Dileepa Wattegama", channel: "Online Store", total: "Rs 1,300.00", payment: "Paid", paymentType: "neutral", fulfillment: "Fulfilled", items: "1 item", delivery: "Delivered", method: "Flat Shipping Rate", alert: false, due: false, status: "Archived" },
];

export const mockOrdersDatabase: Record<string, OrderDetail> = {
  "1015": {
    id: "#1015",
    cleanId: "1015",
    date: "Tuesday at 3:57 pm from Online Store",
    channel: "Online Store",
    paymentStatus: "Payment pending",
    paymentType: "warning",
    fulfillmentStatus: "Fulfilled",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 460,
    subtotal: 1600,
    total: 2060,
    paid: 0,
    balance: 2060,
    notes: "Please deliver before 5 PM",
    status: "Open",
    products: [
      { name: "Abacus Year 1 Workbook 1", price: 1600, qty: 1, image: "📘" }
    ],
    customer: {
      name: "Fathima Hirshard",
      ordersCount: "3 orders",
      email: "hirshard.f@example.com",
      phone: "+94 77 123 4567",
      shippingAddress: {
        name: "Fathima Hirshard",
        line1: "42/1 Galle Road",
        line2: "Kollupitiya",
        city: "Colombo 03, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 123 4567"
      }
    }
  },
  "1014": {
    id: "#1014",
    cleanId: "1014",
    date: "Jul 27, 2026 at 11:00 pm from Online Store",
    channel: "Online Store",
    paymentStatus: "Payment pending",
    paymentType: "warning",
    fulfillmentStatus: "Fulfilled",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 3560,
    total: 3960,
    paid: 0,
    balance: 3960,
    notes: "No notes from customer",
    status: "Open",
    products: [
      { name: "iPrimary English Activity Book Year 4", price: 3560, qty: 1, image: "📚" }
    ],
    customer: {
      name: "Isuru Abeyrama",
      ordersCount: "2 orders",
      email: "isuru.abeyrama@example.com",
      phone: "+94 77 987 6543",
      shippingAddress: {
        name: "Isuru Abeyrama",
        line1: "15/A Main Street",
        line2: "Rajagiriya",
        city: "Colombo, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 987 6543"
      }
    }
  },
  "1013": {
    id: "#1013",
    cleanId: "1013",
    date: "Jul 27, 2026 at 7:54 pm from Draft Orders",
    channel: "Draft Orders",
    paymentStatus: "Payment pending",
    paymentType: "warning",
    fulfillmentStatus: "Fulfilled",
    shippingMethod: "Custom",
    shippingPrice: 400,
    subtotal: 2036,
    total: 2436,
    paid: 0,
    balance: 2436,
    notes: "Payment due within 14 days",
    status: "Open",
    due: true,
    alert: true,
    products: [
      { name: "Pearson Edexcel International GCSE Chemistry", price: 2036, qty: 1, image: "📕" }
    ],
    customer: {
      name: "E. P. H. De Silva",
      ordersCount: "1 order",
      email: "eph.desilva@example.com",
      phone: "+94 71 456 7890",
      shippingAddress: {
        name: "E. P. H. De Silva",
        line1: "88 Hospital Road",
        line2: "Dehiwala",
        city: "Colombo, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 71 456 7890"
      }
    }
  },
  "1012": {
    id: "#1012",
    cleanId: "1012",
    date: "Jul 21, 2026 at 4:54 pm from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Fulfilled",
    deliveryStatus: "Delivered",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 3800,
    total: 4200,
    paid: 4200,
    balance: 0,
    notes: "Leave package at front gate if not home",
    status: "Open",
    products: [
      { name: "iPrimary Science Student Book Year 3", price: 3800, qty: 1, image: "📗" }
    ],
    customer: {
      name: "fathima Raihana",
      ordersCount: "5 orders",
      email: "fathima.raihana@example.com",
      phone: "+94 76 543 2109",
      shippingAddress: {
        name: "fathima Raihana",
        line1: "102 Temple Road",
        line2: "Nugegoda",
        city: "Colombo, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 76 543 2109"
      }
    }
  },
  "1011": {
    id: "#1011",
    cleanId: "1011",
    date: "Jul 21, 2026 at 8:46 am from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Fulfilled",
    deliveryStatus: "Delivered",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 8160,
    total: 8560,
    paid: 8560,
    balance: 0,
    notes: "No notes from customer",
    status: "Open",
    products: [
      { name: "Edexcel International GCSE (9-1) Mathematics A", price: 4080, qty: 1, image: "📐" },
      { name: "iPrimary Mathematics Activity Book Year 2", price: 4080, qty: 1, image: "✏️" }
    ],
    customer: {
      name: "Pradeepa Prasadini",
      ordersCount: "4 orders",
      email: "pradeepa.prasadini@example.com",
      phone: "+94 77 888 9999",
      shippingAddress: {
        name: "Pradeepa Prasadini",
        line1: "34 Beach Road",
        line2: "Mount Lavinia",
        city: "Colombo, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 888 9999"
      }
    }
  },
  "1010": {
    id: "#1010",
    cleanId: "1010",
    date: "Jul 9, 2026 at 7:21 pm from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Fulfilled",
    deliveryStatus: "Delivered",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 3992,
    total: 4392,
    paid: 4392,
    balance: 0,
    notes: "Gift packaging requested",
    status: "Open",
    products: [
      { name: "Inspire Computing International Student Book Year 5", price: 3992, qty: 1, image: "💻" }
    ],
    customer: {
      name: "Manjula Karunanayaka",
      ordersCount: "2 orders",
      email: "manjula.k@example.com",
      phone: "+94 71 222 3333",
      shippingAddress: {
        name: "Manjula Karunanayaka",
        line1: "55 Station Road",
        line2: "Kelaniya",
        city: "Gampaha, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 71 222 3333"
      }
    }
  },
  "1009": {
    id: "#1009",
    cleanId: "1009",
    date: "Jul 3, 2026 at 4:38 pm from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Fulfilled",
    deliveryStatus: "Delivered",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 3000,
    total: 3400,
    paid: 3400,
    balance: 0,
    notes: "No notes from customer",
    status: "Open",
    products: [
      { name: "iLowerSecondary English Student Book Year 7", price: 3000, qty: 1, image: "📖" }
    ],
    customer: {
      name: "Victoria Bloom",
      ordersCount: "1 order",
      email: "victoria.bloom@example.com",
      phone: "+94 77 444 5555",
      shippingAddress: {
        name: "Victoria Bloom",
        line1: "7 Rosewood Lane",
        line2: "Cinnamon Gardens",
        city: "Colombo 07, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 444 5555"
      }
    }
  },
  "1008": {
    id: "#1008",
    cleanId: "1008",
    date: "Jun 16, 2026 at 11:26 am from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Fulfilled",
    deliveryStatus: "Delivered",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 1412,
    total: 1812,
    paid: 1812,
    balance: 0,
    notes: "Archived order",
    status: "Archived",
    products: [
      { name: "Abacus Year 2 Workbook 2", price: 706, qty: 1, image: "📒" },
      { name: "Abacus Year 2 Workbook 3", price: 706, qty: 1, image: "📙" }
    ],
    customer: {
      name: "Dihan Hettige",
      ordersCount: "6 orders",
      email: "dihan.hettige@example.com",
      phone: "+94 76 111 2222",
      shippingAddress: {
        name: "Dihan Hettige",
        line1: "19 Lake Drive",
        line2: "Battaramulla",
        city: "Colombo, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 76 111 2222"
      }
    }
  },
  "1007": {
    id: "#1007",
    cleanId: "1007",
    date: "Jun 12, 2026 at 6:19 am from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Fulfilled",
    deliveryStatus: "Delivered",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 11924,
    total: 12324,
    paid: 12324,
    balance: 0,
    notes: "Bulk order for school curriculum",
    status: "Archived",
    products: [
      { name: "Pearson Edexcel GCSE Biology Higher", price: 3974, qty: 1, image: "🔬" },
      { name: "Pearson Edexcel GCSE Physics Higher", price: 3975, qty: 1, image: "⚡" },
      { name: "Pearson Edexcel GCSE Chemistry Higher", price: 3975, qty: 1, image: "🧪" }
    ],
    customer: {
      name: "Dahamsiri HA",
      ordersCount: "8 orders",
      email: "dahamsiri.ha@example.com",
      phone: "+94 77 777 8888",
      shippingAddress: {
        name: "Dahamsiri HA",
        line1: "124 Kandy Road",
        line2: "Kadawatha",
        city: "Gampaha, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 777 8888"
      }
    }
  },
  "1006": {
    id: "#1006",
    cleanId: "1006",
    date: "Apr 1, 2026 at 11:53 am from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Fulfilled",
    deliveryStatus: "Delivered",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 10136,
    total: 10536,
    paid: 10536,
    balance: 0,
    notes: "Express delivery completed",
    status: "Archived",
    products: [
      { name: "Abacus Workbook Complete Bundle Set (10 books)", price: 1013.6, qty: 10, image: "📚" }
    ],
    customer: {
      name: "Thilini Premachandra",
      ordersCount: "12 orders",
      email: "thilini.p@example.com",
      phone: "+94 71 999 0000",
      shippingAddress: {
        name: "Thilini Premachandra",
        line1: "67 High Level Road",
        line2: "Maharagama",
        city: "Colombo, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 71 999 0000"
      }
    }
  },
  "1005": {
    id: "#1005",
    cleanId: "1005",
    date: "Mar 6, 2026 at 1:17 pm from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Fulfilled",
    deliveryStatus: "Delivered",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 1860,
    total: 2260,
    paid: 2260,
    balance: 0,
    notes: "No notes from customer",
    status: "Archived",
    products: [
      { name: "iPrimary English Activity Book Year 1", price: 1860, qty: 1, image: "📕" }
    ],
    customer: {
      name: "Isuru Weerasuriya",
      ordersCount: "2 orders",
      email: "isuru.w@example.com",
      phone: "+94 77 333 4444",
      shippingAddress: {
        name: "Isuru Weerasuriya",
        line1: "52 Negombo Road",
        line2: "Ja-Ela",
        city: "Gampaha, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 333 4444"
      }
    }
  },
  "1004": {
    id: "#1004",
    cleanId: "1004",
    date: "Feb 6, 2026 at 12:51 pm from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Fulfilled",
    deliveryStatus: "Delivered",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 11420,
    total: 11820,
    paid: 11820,
    balance: 0,
    notes: "Classroom pack order",
    status: "Archived",
    products: [
      { name: "iPrimary Science Activity Book Year 5", price: 1903.33, qty: 6, image: "🧪" }
    ],
    customer: {
      name: "Kalpana de Silva",
      ordersCount: "5 orders",
      email: "kalpana.desilva@example.com",
      phone: "+94 76 666 7777",
      shippingAddress: {
        name: "Kalpana de Silva",
        line1: "81 Nawala Road",
        line2: "Nawala",
        city: "Colombo, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 76 666 7777"
      }
    }
  },
  "1003": {
    id: "#1003",
    cleanId: "1003",
    date: "Feb 3, 2026 at 10:56 pm from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Unfulfilled",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 3740,
    total: 4140,
    paid: 4140,
    balance: 0,
    notes: "Customer asked to hold until Friday",
    status: "Open",
    products: [
      { name: "iPrimary Mathematics Student Book Year 4", price: 1870, qty: 2, image: "📐" }
    ],
    customer: {
      name: "Imalka Nishadi",
      ordersCount: "1 order",
      email: "imalka.n@example.com",
      phone: "+94 77 222 1111",
      shippingAddress: {
        name: "Imalka Nishadi",
        line1: "14/2 Horana Road",
        line2: "Bandaragama",
        city: "Kalutara, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 222 1111"
      }
    }
  },
  "1002": {
    id: "#1002",
    cleanId: "1002",
    date: "Jan 28, 2026 at 2:41 pm from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Unfulfilled",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 1820,
    total: 2220,
    paid: 2220,
    balance: 0,
    notes: "No notes from customer",
    status: "Open",
    products: [
      { name: "Abacus Year 3 Workbook 1", price: 1820, qty: 1, image: "📘" }
    ],
    customer: {
      name: "Zainab Fathima",
      ordersCount: "2 orders",
      email: "zainab.f@example.com",
      phone: "+94 71 333 2222",
      shippingAddress: {
        name: "Zainab Fathima",
        line1: "99 Peradeniya Road",
        line2: "Kandy",
        city: "Kandy, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 71 333 2222"
      }
    }
  },
  "1001": {
    id: "#1001",
    cleanId: "1001",
    date: "Dec 11, 2025 at 6:23 pm from Online Store",
    channel: "Online Store",
    paymentStatus: "Paid",
    paymentType: "neutral",
    fulfillmentStatus: "Fulfilled",
    deliveryStatus: "Delivered",
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 400,
    subtotal: 900,
    total: 1300,
    paid: 1300,
    balance: 0,
    notes: "First test order",
    status: "Archived",
    products: [
      { name: "Abacus Starter Pack", price: 900, qty: 1, image: "📘" }
    ],
    customer: {
      name: "Dileepa Wattegama",
      ordersCount: "4 orders",
      email: "dileepa.w@example.com",
      phone: "+94 76 888 1111",
      shippingAddress: {
        name: "Dileepa Wattegama",
        line1: "23 Matara Road",
        line2: "Galle",
        city: "Galle, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 76 888 1111"
      }
    }
  }
};

/**
 * Fetch an OrderDetail by ID or clean ID, or dynamically build a fallback matching the initial list
 */
export function getOrderDetail(idParam: string): OrderDetail {
  const cleanId = idParam.replace(/%23|#/g, "");
  
  if (mockOrdersDatabase[cleanId]) {
    return mockOrdersDatabase[cleanId];
  }

  // Look for matching row in initialOrdersList
  const matchedRow = initialOrdersList.find(
    (row) => row.id.replace("#", "") === cleanId
  );

  const customerName = matchedRow ? matchedRow.customer : "Manoji Karunaratne";
  const rawTotal = matchedRow ? parseFloat(matchedRow.total.replace(/[^0-9.]/g, "")) || 3424 : 3424;
  const isPaid = matchedRow ? matchedRow.payment === "Paid" : false;
  const isFulfilled = matchedRow ? matchedRow.fulfillment === "Fulfilled" : false;
  const method = matchedRow ? matchedRow.method : "Flat Shipping Rate";
  const dateStr = matchedRow ? `${matchedRow.date} from ${matchedRow.channel}` : "August 8, 2026 at 7:44 pm from Online Store";

  const shippingPrice = 400;
  const subtotal = Math.max(0, rawTotal - shippingPrice);

  return {
    id: `#${cleanId}`,
    cleanId,
    date: dateStr,
    channel: matchedRow?.channel || "Online Store",
    paymentStatus: isPaid ? "Paid" : "Payment pending",
    paymentType: isPaid ? "neutral" : "warning",
    fulfillmentStatus: isFulfilled ? "Fulfilled" : "Unfulfilled",
    shippingMethod: method,
    shippingPrice: shippingPrice,
    subtotal: subtotal,
    total: rawTotal,
    paid: isPaid ? rawTotal : 0,
    balance: isPaid ? 0 : rawTotal,
    notes: "No notes from customer",
    status: matchedRow?.status === "Archived" ? "Archived" : "Open",
    products: [
      {
        name: "iPrimary English Activity Book Year 4",
        price: subtotal,
        qty: 1,
        image: "📚"
      }
    ],
    customer: {
      name: customerName,
      ordersCount: "1 order",
      email: `${customerName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: "+94 77 260 5026",
      shippingAddress: {
        name: customerName,
        line1: "658/5",
        line2: "Tri city gardens, Thunhadahena Rd,",
        city: "Korathota, Kaduwela, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 260 5026"
      }
    }
  };
}
