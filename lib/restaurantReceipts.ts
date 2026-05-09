export type RestaurantReceiptSubmission = {
  id: string;
  campaignId: string;
  parentName: string;
  receiptFileName: string;
  orderTotal: number;
  givebackAmount: number;
  donationPercentage: number;
  submittedAt: string;
};

export type RestaurantReceiptSummary = {
  participationCount: number;
  orderTotal: number;
  givebackAmount: number;
};

const RECEIPT_STORAGE_KEY = "pta-fundraising-hub-restaurant-receipts";

export function loadRestaurantReceipts(): RestaurantReceiptSubmission[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedReceipts = window.localStorage.getItem(RECEIPT_STORAGE_KEY);
  if (!savedReceipts) {
    return [];
  }

  try {
    const parsedReceipts = JSON.parse(savedReceipts) as RestaurantReceiptSubmission[];
    return Array.isArray(parsedReceipts) ? parsedReceipts : [];
  } catch {
    window.localStorage.removeItem(RECEIPT_STORAGE_KEY);
    return [];
  }
}

export function saveRestaurantReceipt(submission: RestaurantReceiptSubmission) {
  if (typeof window === "undefined") {
    return;
  }

  const receipts = loadRestaurantReceipts();
  window.localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify([submission, ...receipts]));
}

export function getRestaurantReceiptSummary(campaignId: string): RestaurantReceiptSummary {
  return loadRestaurantReceipts()
    .filter((receipt) => receipt.campaignId === campaignId)
    .reduce(
      (summary, receipt) => ({
        participationCount: summary.participationCount + 1,
        orderTotal: summary.orderTotal + receipt.orderTotal,
        givebackAmount: summary.givebackAmount + receipt.givebackAmount
      }),
      { participationCount: 0, orderTotal: 0, givebackAmount: 0 }
    );
}

export function detectReceiptAmountFromFileName(fileName: string): number | null {
  const matches = fileName.match(/\d+(?:\.\d{1,2})?/g);
  if (!matches?.length) {
    return null;
  }

  const likelyAmount = Math.max(...matches.map(Number));
  return Number.isFinite(likelyAmount) && likelyAmount > 0 ? likelyAmount : null;
}
