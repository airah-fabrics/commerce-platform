/** Seller details printed on documents. Public business details only. */
export const SELLER = {
  "name": "Airah Fabrics",
  "legal": "Airah Fabrics Ltd",
  "line1": "Shop # Lg 43, City Tower, Main Boulevard, Gulberg II",
  "line2": "Lahore, Pakistan",
  "phone": "+92 316 4341886",
  "email": "info@airahfabrics.com",
  "website": "https://airahfabrics.com"
} as const;

export const INVOICE_LOGO = {"src":"/brand-logo.png","width":355,"height":289,"cssH":80} as const;

export type DocumentKind = "Invoice" | "Estimate";

export type InvoiceLine = {
  date: string;
  service: string;
  description: string;
  quantity: number;
  rate: number;
};

export type InvoiceData = {
  kind: DocumentKind;
  number: string;
  date: string;
  billTo: string[];
  shipTo: string[];
  lines: InvoiceLine[];
  discountPercent: number;
  /** Fixed discount from the order; used instead of discountPercent when set. */
  discountAmount?: number;
  shipping?: number;
  currency: string;
  /** Short note printed under the totals. */
  notes?: string;
};

export function lineAmount(line: InvoiceLine) {
  return line.quantity * line.rate;
}

export function invoiceTotals(invoice: InvoiceData) {
  const subtotal = invoice.lines.reduce((sum, line) => sum + lineAmount(line), 0);
  const discount = invoice.discountAmount ?? (subtotal * invoice.discountPercent) / 100;
  const shipping = invoice.shipping ?? 0;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

export function formatAmount(value: number) {
  return value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatTotal(value: number, currency: InvoiceData["currency"]) {
  const symbol = currency === "PKR" ? "Rs " : currency === "GBP" ? "£" : currency + " ";
  return symbol + formatAmount(value);
}
