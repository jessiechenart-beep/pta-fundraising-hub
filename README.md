# PTA Fundraising Hub

A modern MVP web app for PTA fundraising visibility and coordination. It includes a public parent portal plus a simple protected PTA admin dashboard for managing campaign pages.

This app does **not** process payments. Every donation or ticket button links out to the school's official payment system.

## Features

- Public parent-facing portal with school/PTA branding
- Featured campaign and active campaign list
- Campaign detail pages with progress, deadlines, impact, and reminder signup placeholder
- Protected PTA admin dashboard with demo password
- Campaign create/edit flow
- Publish/unpublish controls
- Progress updates
- Public preview links
- Restaurant fundraiser tracking fields
- Seed campaigns for annual fund, gala, restaurant fundraiser, and class contribution
- Responsive, warm, trustworthy UI built with Tailwind CSS

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Mock seed data in `data/campaigns.ts`
- Simple client-side demo auth for the PTA admin area

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

- Public portal: `http://localhost:3000`
- PTA admin dashboard: `http://localhost:3000/admin`

Demo admin password:

```text
pta-demo
```

## Project Structure

```text
app/
  page.tsx                  Public parent portal
  campaigns/[slug]/page.tsx Campaign detail pages
  admin/page.tsx            Protected admin shell
components/
  AdminDashboard.tsx        Admin UI and mock edit flow
  CampaignCard.tsx          Reusable campaign card
  DonationButton.tsx        External payment-system link button
  ProgressBar.tsx           Campaign progress display
  PublicHeader.tsx          Parent portal header
  RestaurantPanel.tsx       Restaurant fundraiser details
data/
  campaigns.ts              School profile and seed campaigns
lib/
  campaigns.ts              Campaign helpers
types/
  campaign.ts               Shared campaign types
```

## Notes For Production

- Replace demo auth with district SSO or a hosted auth provider.
- Connect campaigns to a database such as Postgres, SQLite, Supabase, or Firebase.
- Validate and sanitize admin form input on the server.
- Keep payment collection outside this app and continue linking to approved school systems.
- Add email/SMS provider integration only if reminder signup becomes a real feature.
