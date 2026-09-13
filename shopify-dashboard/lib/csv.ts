/**
 * Utility functions for RFC-4180 compliant CSV parsing and sample product CSV generation.
 */

export interface ParsedProductRow {
  name: string;
  description: string;
  images: string[];
  status: "Active" | "Draft" | "Archived" | "Unlisted";
  priceUsd: number;
  compareAtPrice?: number;
  sku?: string;
  barcode?: string;
  inventory: number;
  category: string;
  type: string;
  vendor: string;
  pageTitle?: string;
  metaDescription?: string;
  urlHandle?: string;
}

/**
 * Parses raw CSV text into a 2D array of string cells, following RFC-4180 rules.
 * Handles quoted fields, commas inside quotes, escaped quotes (""), and multiline content.
 */
export function parseCsvToMatrix(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  // Normalize Windows/Mac line endings
  const text = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped double quote
          currentCell += '"';
          i++; // Skip next quote
        } else {
          // Closing quote
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if (char === "\n") {
        currentRow.push(currentCell.trim());
        if (currentRow.some((cell) => cell.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
  }

  // Push trailing cell and row if any
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Normalizes header strings to allow flexible matching across different CSV formats.
 */
function normalizeHeaderKey(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseNumeric(val: string | undefined, defaultVal = 0): number {
  if (!val) return defaultVal;
  // Strip currency symbols ($, LKR, Rs, etc.), commas, spaces
  const cleaned = val.replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? defaultVal : num;
}

function parseInteger(val: string | undefined, defaultVal = 0): number {
  if (!val) return defaultVal;
  const cleaned = val.replace(/[^0-9-]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? defaultVal : num;
}

function parseStatus(val: string | undefined): "Active" | "Draft" | "Archived" | "Unlisted" {
  if (!val) return "Active";
  const lower = val.toLowerCase().trim();
  if (lower === "active" || lower === "true" || lower === "published") return "Active";
  if (lower === "draft" || lower === "false") return "Draft";
  if (lower === "archived" || lower === "archive") return "Archived";
  if (lower === "unlisted" || lower === "unlist") return "Unlisted";
  return "Active";
}

/**
 * Converts a raw parsed matrix of strings into typed product rows based on column mappings.
 */
export function parseProductCsv(csvText: string): {
  products: ParsedProductRow[];
  errors: string[];
  totalRows: number;
} {
  const matrix = parseCsvToMatrix(csvText);
  if (matrix.length === 0) {
    return { products: [], errors: ["The CSV file is empty."], totalRows: 0 };
  }

  const rawHeaders = matrix[0];
  const headers = rawHeaders.map(normalizeHeaderKey);

  // Find column indexes using primary requested names and common aliases
  const colIndexes = {
    title: headers.findIndex((h) =>
      ["producttitle", "title", "name", "productname", "handle"].includes(h)
    ),
    description: headers.findIndex((h) =>
      ["description", "bodyhtml", "body", "details"].includes(h)
    ),
    media: headers.findIndex((h) =>
      ["productmedia", "imagemedia", "imageurl", "imagesrc", "images", "image", "photo"].includes(h)
    ),
    status: headers.findIndex((h) =>
      ["status", "published"].includes(h)
    ),
    basePrice: headers.findIndex((h) =>
      ["baseprice", "price", "variantprice", "priceusd", "pricelkr", "cost"].includes(h)
    ),
    compareAtPrice: headers.findIndex((h) =>
      ["compareatprice", "compareprice", "variantcompareatprice"].includes(h)
    ),
    sku: headers.findIndex((h) =>
      ["sku", "variantsku"].includes(h)
    ),
    barcodes: headers.findIndex((h) =>
      ["barcodes", "barcode", "variantbarcode"].includes(h)
    ),
    inventoryQuantity: headers.findIndex((h) =>
      [
        "inventoryquantity",
        "inventory",
        "inventoryqty",
        "variantinventoryqty",
        "quantity",
        "qty",
        "stock",
      ].includes(h)
    ),
    category: headers.findIndex((h) =>
      ["category", "productcategory"].includes(h)
    ),
    type: headers.findIndex((h) =>
      ["type", "producttype"].includes(h)
    ),
    vendor: headers.findIndex((h) =>
      ["vendor", "brand"].includes(h)
    ),
    pageTitle: headers.findIndex((h) =>
      ["pagetitle", "pagetitleseo", "seotitle", "meta_title"].includes(h)
    ),
    metaDescription: headers.findIndex((h) =>
      ["metadescription", "metadescriptionseo", "seodescription", "meta_description"].includes(h)
    ),
    urlHandle: headers.findIndex((h) =>
      ["urlhandle", "urlhandleseo", "slug", "handle", "url"].includes(h)
    ),
  };

  if (colIndexes.title === -1) {
    return {
      products: [],
      errors: [
        "Missing required 'Product title' column in CSV header. Please check the sample CSV format.",
      ],
      totalRows: matrix.length - 1,
    };
  }

  const products: ParsedProductRow[] = [];
  const errors: string[] = [];

  for (let i = 1; i < matrix.length; i++) {
    const row = matrix[i];
    const rawTitle = row[colIndexes.title]?.trim();

    if (!rawTitle) {
      errors.push(`Row ${i + 1}: Skipped because Product title was empty.`);
      continue;
    }

    const description =
      colIndexes.description !== -1 && row[colIndexes.description]?.trim()
        ? row[colIndexes.description].trim()
        : "";

    const rawMedia =
      colIndexes.media !== -1 && row[colIndexes.media]?.trim()
        ? row[colIndexes.media].trim()
        : "";

    let images: string[] = [];
    if (rawMedia) {
      if (rawMedia.includes("|")) {
        images = rawMedia.split("|").map((s) => s.trim()).filter(Boolean);
      } else if (rawMedia.includes(";")) {
        images = rawMedia.split(";").map((s) => s.trim()).filter(Boolean);
      } else {
        images = [rawMedia];
      }
    }

    const status =
      colIndexes.status !== -1 ? parseStatus(row[colIndexes.status]) : "Active";

    const basePrice =
      colIndexes.basePrice !== -1 ? parseNumeric(row[colIndexes.basePrice], 0) : 0;

    const comparePrice =
      colIndexes.compareAtPrice !== -1
        ? parseNumeric(row[colIndexes.compareAtPrice], 0)
        : undefined;

    const sku =
      colIndexes.sku !== -1 && row[colIndexes.sku]?.trim()
        ? row[colIndexes.sku].trim()
        : undefined;

    const barcode =
      colIndexes.barcodes !== -1 && row[colIndexes.barcodes]?.trim()
        ? row[colIndexes.barcodes].trim()
        : undefined;

    const inventory =
      colIndexes.inventoryQuantity !== -1
        ? parseInteger(row[colIndexes.inventoryQuantity], 0)
        : 0;

    const category =
      colIndexes.category !== -1 && row[colIndexes.category]?.trim()
        ? row[colIndexes.category].trim()
        : "Books & Workbooks";

    const type =
      colIndexes.type !== -1 && row[colIndexes.type]?.trim()
        ? row[colIndexes.type].trim()
        : "Workbook";

    const vendor =
      colIndexes.vendor !== -1 && row[colIndexes.vendor]?.trim()
        ? row[colIndexes.vendor].trim()
        : "Prasanthi Craft";

    const pageTitle =
      colIndexes.pageTitle !== -1 && row[colIndexes.pageTitle]?.trim()
        ? row[colIndexes.pageTitle].trim()
        : undefined;

    const metaDescription =
      colIndexes.metaDescription !== -1 && row[colIndexes.metaDescription]?.trim()
        ? row[colIndexes.metaDescription].trim()
        : undefined;

    const urlHandle =
      colIndexes.urlHandle !== -1 && row[colIndexes.urlHandle]?.trim()
        ? row[colIndexes.urlHandle].trim()
        : undefined;

    products.push({
      name: rawTitle,
      description,
      images,
      status,
      priceUsd: basePrice,
      compareAtPrice: comparePrice && comparePrice > 0 ? comparePrice : undefined,
      sku,
      barcode,
      inventory,
      category,
      type,
      vendor,
      pageTitle,
      metaDescription,
      urlHandle,
    });
  }

  return {
    products,
    errors,
    totalRows: matrix.length - 1,
  };
}

/**
 * Generates the sample CSV content matching exact requested columns:
 * 1. Product title
 * 2. Description
 * 3. Product media
 * 4. Status
 * 5. Base price
 * 6. Compare-at price
 * 7. SKU
 * 8. Barcodes
 * 9. Inventory quantity
 * 10. Category
 * 11. Type
 * 12. Vendor
 * 13. Page title
 * 14. Meta description
 * 15. URL handle
 */
export function getSampleProductsCsv(): string {
  const headers = [
    "Product title",
    "Description",
    "Product media",
    "Status",
    "Base price",
    "Compare-at price",
    "SKU",
    "Barcodes",
    "Inventory quantity",
    "Category",
    "Type",
    "Vendor",
    "Page title",
    "Meta description",
    "URL handle",
  ];

  const sampleRows = [
    [
      "Abacus Year 2 Workbook 3",
      "Official primary mathematics workbook for Year 2 students covering core arithmetic operations.",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
      "Active",
      "2450.00",
      "2800.00",
      "SKU-ABACUS-02",
      "9780123456789",
      "15",
      "Books & Workbooks",
      "Workbook",
      "Prasanthi Craft",
      "Abacus Year 2 Workbook 3 - Prasanthi Craft",
      "Buy Abacus Year 2 Workbook 3 online at Prasanthi Craft. Fast delivery across Sri Lanka.",
      "abacus-year-2-workbook-3",
    ],
    [
      "Sinhala Kiyaveem Potha 5",
      "Grade 5 Sinhala reading, comprehension, and literature guide for primary school exams.",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
      "Active",
      "1800.00",
      "2000.00",
      "SKU-SINH-05",
      "9780987654321",
      "25",
      "Books & Workbooks",
      "Reader",
      "Prasanthi Craft",
      "Sinhala Kiyaveem Potha Grade 5 - Prasanthi Craft",
      "Official Grade 5 Sinhala reading guide textbook for school curriculum.",
      "sinhala-kiyaveem-potha-5",
    ],
    [
      "Oxford Student Learners Dictionary",
      "Comprehensive English learners dictionary with modern definitions, usage examples, and phonetics.",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600",
      "Draft",
      "3500.00",
      "4000.00",
      "SKU-OXF-01",
      "9780194425711",
      "8",
      "Books & Workbooks",
      "Reference",
      "Oxford Press",
      "Oxford Student Learners Dictionary - Prasanthi Craft",
      "Oxford Student Learners Dictionary with clear grammar explanations and guides.",
      "oxford-student-learners-dictionary",
    ],
  ];

  const escapeCell = (cell: string) => {
    if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  };

  const csvLines = [
    headers.join(","),
    ...sampleRows.map((row) => row.map(escapeCell).join(",")),
  ];

  return csvLines.join("\r\n");
}
