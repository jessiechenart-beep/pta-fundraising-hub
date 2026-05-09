import { AdminDashboard } from "@/components/AdminDashboard";
import { campaigns } from "@/data/campaigns";

export default function AdminPage() {
  return <AdminDashboard initialCampaigns={campaigns} />;
}
