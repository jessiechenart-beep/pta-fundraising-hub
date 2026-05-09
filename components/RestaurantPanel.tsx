"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, MapPin, ReceiptText, Sparkles, Upload, Utensils } from "lucide-react";
import { formatCurrency } from "@/lib/campaigns";
import {
  detectReceiptAmountFromFileName,
  getRestaurantReceiptSummary,
  saveRestaurantReceipt
} from "@/lib/restaurantReceipts";
import type { Campaign } from "@/types/campaign";

export function RestaurantPanel({ campaign }: { campaign: Campaign }) {
  const [submissionVersion, setSubmissionVersion] = useState(0);
  const receiptSummary = useMemo(
    () => getRestaurantReceiptSummary(campaign.id),
    [campaign.id, submissionVersion]
  );

  useEffect(() => {
    function refreshSummary() {
      setSubmissionVersion((current) => current + 1);
    }

    window.addEventListener("restaurantReceiptSubmitted", refreshSummary);
    return () => window.removeEventListener("restaurantReceiptSubmitted", refreshSummary);
  }, []);

  if (!campaign.restaurant) {
    return null;
  }

  const restaurant = campaign.restaurant;
  const reportedParticipationCount = restaurant.participationCount + receiptSummary.participationCount;
  const reportedExpectedDonation = receiptSummary.givebackAmount;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/92 shadow-soft backdrop-blur">
      <div className="grid gap-0 lg:grid-cols-[0.62fr_0.38fr]">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-coral/12 text-coral">
              <Utensils aria-hidden className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-meadow">Restaurant night</p>
              <h2 className="text-3xl font-black">{restaurant.restaurantName}</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-linen/70 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-black">
                <MapPin aria-hidden className="h-4 w-4" />
                Location
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/72">{restaurant.location}</p>
            </div>
            <div className="rounded-2xl bg-linen/70 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-black">
                <ReceiptText aria-hidden className="h-4 w-4" />
                How to participate
              </p>
              <div className="mt-3">
                <div>
                  {restaurant.promoCode ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-black text-white">
                      <Sparkles aria-hidden className="h-4 w-4 text-honey" />
                      Use code {restaurant.promoCode}
                    </span>
                  ) : null}
                  <p className="mt-3 text-sm leading-6 text-ink/72">{restaurant.instructions}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-ink p-6 text-white">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-white/76">Community snapshot</p>
          <div className="mt-5 grid gap-4">
            <RestaurantMetric label="Giveback" value={`${restaurant.donationPercentage}%`} />
            <RestaurantMetric label="Orders reported" value={`${reportedParticipationCount}`} />
            <RestaurantMetric label="Estimated giveback" value={formatCurrency(reportedExpectedDonation)} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function RestaurantReceiptReport({ campaign }: { campaign: Campaign }) {
  const [receiptFileName, setReceiptFileName] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [receiptMessage, setReceiptMessage] = useState("");

  if (!campaign.restaurant) {
    return null;
  }

  const restaurant = campaign.restaurant;
  const numericOrderTotal = Number(orderTotal);
  const givebackAmount =
    Number.isFinite(numericOrderTotal) && numericOrderTotal > 0
      ? numericOrderTotal * (restaurant.donationPercentage / 100)
      : 0;

  function handleReceiptFile(file: File | undefined) {
    if (!file) {
      return;
    }

    setReceiptFileName(file.name);
    const detectedAmount = detectReceiptAmountFromFileName(file.name);
    if (detectedAmount) {
      setOrderTotal(String(detectedAmount));
      setReceiptMessage("We found a possible total from the file name. Please confirm it before submitting.");
    } else {
      setReceiptMessage("Receipt added. Please enter the receipt total so we can calculate the giveback.");
    }
  }

  function submitReceiptReport() {
    if (!Number.isFinite(numericOrderTotal) || numericOrderTotal <= 0) {
      setReceiptMessage("Please enter the receipt total before submitting.");
      return;
    }

    saveRestaurantReceipt({
      id: `receipt-${Date.now()}`,
      campaignId: campaign.id,
      parentName: "Anonymous",
      receiptFileName: receiptFileName || "No receipt file attached",
      orderTotal: numericOrderTotal,
      givebackAmount,
      donationPercentage: restaurant.donationPercentage,
      submittedAt: new Date().toISOString()
    });
    setReceiptFileName("");
    setOrderTotal("");
    setReceiptMessage("Thanks, your order receipt was added for the PTA to review.");
    window.dispatchEvent(new Event("restaurantReceiptSubmitted"));
  }

  return (
    <section className="mt-6 rounded-3xl border border-coral/18 bg-white/92 p-5 shadow-soft backdrop-blur">
      <div>
        <h3 className="text-2xl font-black">Tell the PTA you participated</h3>
        <p className="mt-1 text-sm leading-6 text-ink/66">
          Upload or take a receipt photo, confirm the total, and we will estimate the
          {` ${restaurant.donationPercentage}%`} giveback.
        </p>
      </div>
      <div className="mt-5 space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5">
            <Upload aria-hidden className="h-4 w-4" />
            Upload receipt
            <input
              accept="image/*,.pdf"
              className="sr-only"
              onChange={(event) => handleReceiptFile(event.target.files?.[0])}
              type="file"
            />
          </label>
          <label className="focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5">
            <Camera aria-hidden className="h-4 w-4" />
            Photo
            <input
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(event) => handleReceiptFile(event.target.files?.[0])}
              type="file"
            />
          </label>
        </div>
        {receiptFileName ? (
          <p className="rounded-2xl bg-linen px-3 py-2 text-sm font-semibold text-ink/66">
            Attached: {receiptFileName}
          </p>
        ) : null}
        <label className="block pt-3 text-sm font-bold text-ink/72">
          Receipt total
          <input
            className="field-control mt-1 rounded-2xl py-3"
            min="0"
            onChange={(event) => setOrderTotal(event.target.value)}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={orderTotal}
          />
        </label>
        <div className="rounded-2xl bg-linen/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-meadow">Estimated giveback</p>
          <p className="mt-1 text-4xl font-black text-coral">{formatCurrency(givebackAmount)}</p>
          <p className="mt-1 text-sm leading-6 text-ink/62">
            Based on {restaurant.donationPercentage}% of {formatCurrency(numericOrderTotal || 0)}.
          </p>
        </div>
        <button
          className="focus-ring w-full rounded-2xl bg-coral px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-meadow"
          onClick={submitReceiptReport}
          type="button"
        >
          Submit order receipt
        </button>
        {receiptMessage ? (
          <p className="rounded-2xl bg-meadow/10 px-3 py-2 text-sm font-semibold text-meadow">
            {receiptMessage}
          </p>
        ) : null}
      </div>
      <p className="mt-4 rounded-2xl bg-linen p-4 text-xs leading-5 text-ink/62">
        Parent reports help PTA estimate participation until the restaurant confirms final eligible sales.
      </p>
    </section>
  );
}

function RestaurantMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/14 p-4">
      <p className="text-4xl font-black capitalize leading-none text-white">{value}</p>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-white/72">{label}</p>
    </div>
  );
}
