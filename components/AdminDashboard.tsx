"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ChevronDown,
  CircleHelp,
  Eye,
  GripVertical,
  HeartHandshake,
  LockKeyhole,
  LogOut,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UserPlus,
  X
} from "lucide-react";
import {
  defaultAboutContent,
  loadAboutContentFromBrowser,
  saveAboutContentToBrowser,
  type AboutContent,
  type PtaTeamMember
} from "@/lib/aboutContent";
import { formatCurrency, formatDate, getPublicCampaignStatus, sortCampaignsLatestFirst } from "@/lib/campaigns";
import {
  loadCampaignsFromBrowser,
  rememberDeletedCampaignId,
  saveCampaignsToBrowser
} from "@/lib/localCampaignStorage";
import {
  clearCurrentPtaUser,
  getDisplayName,
  getInitials,
  loadCurrentPtaUser,
  loadPtaUsers,
  saveCurrentPtaUser,
  savePtaUsers,
  type PtaUser
} from "@/lib/ptaAuth";
import { getRestaurantReceiptSummary, type RestaurantReceiptSummary } from "@/lib/restaurantReceipts";
import type {
  Campaign,
  CampaignCategory,
  CampaignStatus,
  CampaignType,
  PayoutStatus
} from "@/types/campaign";
import { ProgressBar } from "./ProgressBar";
import { StatusPill } from "./StatusPill";

const campaignTypes: CampaignType[] = [
  "Direct Donation",
  "Gala / Event",
  "Restaurant Fundraiser",
  "Class Contribution",
  "Class event",
  "School event"
];

const payoutStatuses: PayoutStatus[] = ["pending", "requested", "paid"];
const emptyReceiptSummary: RestaurantReceiptSummary = {
  participationCount: 0,
  orderTotal: 0,
  givebackAmount: 0
};

type AdminView = "campaigns" | "events" | "partners" | "about";

const adminNavItems: Array<{ id: AdminView; label: string }> = [
  { id: "campaigns", label: "Campaigns" },
  { id: "events", label: "Events" },
  { id: "about", label: "About PTA" }
];

type AboutSelection = "principal" | string;

type AboutForm = {
  name: string;
  title: string;
  role: string;
  image: string;
  message: string;
  contactEmail: string;
};

type CampaignForm = {
  title: string;
  type: CampaignType;
  shortDescription: string;
  fullDescription: string;
  supports: string;
  goalAmount: string;
  amountRaised: string;
  startDate: string;
  deadline: string;
  heroImage: string;
  heroImageFit: "cover" | "contain";
  heroImagePositionX: string;
  heroImagePositionY: string;
  externalDonationUrl: string;
  externalActionLabel: string;
  status: CampaignStatus;
  restaurantName: string;
  restaurantLocation: string;
  restaurantInstructions: string;
  donationPercentage: string;
  promoCode: string;
  participationCount: string;
  expectedDonation: string;
  actualReceivedAmount: string;
  payoutStatus: PayoutStatus;
  parentSelfReportNote: string;
};

export function AdminDashboard({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [currentUser, setCurrentUser] = useState<PtaUser | null>(null);
  const [ptaUsers, setPtaUsers] = useState<PtaUser[]>([]);
  const [authForm, setAuthForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profileImage: ""
  });
  const [authMessage, setAuthMessage] = useState("");
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [adminView, setAdminView] = useState<AdminView>("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [editorMode, setEditorMode] = useState<"create" | "edit">("edit");
  const [form, setForm] = useState<CampaignForm>(() => toForm());
  const [saveMessage, setSaveMessage] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: ""
  });
  const [openActionsId, setOpenActionsId] = useState<string | null>(null);
  const [openManagerId, setOpenManagerId] = useState<string | null>(null);
  const [draggedCampaignId, setDraggedCampaignId] = useState<string | null>(null);
  const [dragOverCampaignId, setDragOverCampaignId] = useState<string | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent);
  const [selectedAboutId, setSelectedAboutId] = useState<AboutSelection>("principal");
  const [aboutForm, setAboutForm] = useState<AboutForm>(() => toAboutForm("principal", defaultAboutContent));
  const [receiptSummaryByCampaignId, setReceiptSummaryByCampaignId] = useState<
    Record<string, RestaurantReceiptSummary>
  >({});

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedId),
    [campaigns, selectedId]
  );
  const visibleCampaigns = useMemo(
    () => {
      if (adminView === "partners") {
        return [];
      }

      return searchCampaigns(
        sortCampaignsLatestFirst(
          campaigns.filter((campaign) =>
            adminView === "events" ? isParticipationEvent(campaign) : !isParticipationEvent(campaign)
          )
        ),
        searchQuery
      );
    },
    [adminView, campaigns, searchQuery]
  );
  const selectedReceiptSummary = selectedCampaign
    ? receiptSummaryByCampaignId[selectedCampaign.id] ?? emptyReceiptSummary
    : emptyReceiptSummary;

  useEffect(() => {
    setPtaUsers(loadPtaUsers());
    const savedUser = loadCurrentPtaUser();
    setCurrentUser(savedUser);
    if (savedUser) {
      setProfileForm(toProfileForm(savedUser));
    }
    const savedAboutContent = loadAboutContentFromBrowser();
    setAboutContent(savedAboutContent);
    setAboutForm(toAboutForm("principal", savedAboutContent));

    const savedCampaigns = loadCampaignsFromBrowser(initialCampaigns);
    if (savedCampaigns) {
      setCampaigns(savedCampaigns);
      setSelectedId("");
      setForm(toForm());
    }
  }, []);

  useEffect(() => {
    const nextSummaryByCampaignId = campaigns.reduce<Record<string, RestaurantReceiptSummary>>(
      (summaries, campaign) => {
        if (campaign.restaurant) {
          summaries[campaign.id] = getRestaurantReceiptSummary(campaign.id);
        }
        return summaries;
      },
      {}
    );
    setReceiptSummaryByCampaignId(nextSummaryByCampaignId);
  }, [campaigns]);

  function signIn() {
    const user = ptaUsers.find(
      (item) =>
        item.email.toLowerCase() === authForm.email.trim().toLowerCase() &&
        item.password === authForm.password
    );

    if (!user) {
      setAuthMessage("We could not find that PTA account. Check the email/password or sign up.");
      return;
    }

    saveCurrentPtaUser(user.id);
    setCurrentUser(user);
    setProfileForm(toProfileForm(user));
    setAuthMessage("");
  }

  function signUp() {
    if (!authForm.firstName.trim() || !authForm.lastName.trim() || !authForm.email.trim() || !authForm.password) {
      setAuthMessage("Please add first name, last name, email, and password.");
      return;
    }

    if (ptaUsers.some((user) => user.email.toLowerCase() === authForm.email.trim().toLowerCase())) {
      setAuthMessage("That email already has a PTA account. Try signing in.");
      return;
    }

    const newUser: PtaUser = {
      id: `pta-user-${Date.now()}`,
      firstName: authForm.firstName.trim(),
      lastName: authForm.lastName.trim(),
      email: authForm.email.trim(),
      password: authForm.password,
      profileImage: authForm.profileImage,
      phone: ""
    };
    const nextUsers = [...ptaUsers, newUser];
    savePtaUsers(nextUsers);
    saveCurrentPtaUser(newUser.id);
    setPtaUsers(nextUsers);
    setCurrentUser(newUser);
    setProfileForm(toProfileForm(newUser));
    setAuthMessage("");
  }

  function signOut() {
    clearCurrentPtaUser();
    setCurrentUser(null);
    setAuthForm((current) => ({ ...current, password: "" }));
    setIsProfileModalOpen(false);
  }

  function handleProfileImage(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) {
      setAuthMessage("Please choose an image file for the profile photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAuthForm((current) => ({ ...current, profileImage: reader.result as string }));
        setAuthMessage("Profile photo added.");
      }
    };
    reader.readAsDataURL(file);
  }

  function openProfileModal() {
    if (currentUser) {
      setProfileForm(toProfileForm(currentUser));
    }
    setIsProfileMenuOpen(false);
    setIsProfileModalOpen(true);
  }

  function handleProfileModalImage(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) {
      setSaveMessage("Please choose an image file for your profile photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileForm((current) => ({ ...current, profileImage: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  }

  function saveProfile() {
    if (!currentUser) {
      return;
    }

    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      setSaveMessage("Please add a first and last name.");
      return;
    }

    const updatedUser: PtaUser = {
      ...currentUser,
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      profileImage: profileForm.profileImage,
      phone: profileForm.phone.trim()
    };
    const nextUsers = ptaUsers.map((user) => (user.id === currentUser.id ? updatedUser : user));
    savePtaUsers(nextUsers);
    setPtaUsers(nextUsers);
    setCurrentUser(updatedUser);
    setProfileForm(toProfileForm(updatedUser));
    setIsProfileModalOpen(false);
    setSaveMessage("Profile updated.");
  }

  function assignManager(campaignId: string, managerUserId: string) {
    setCampaigns((current) => {
      const nextCampaigns = current.map((campaign) =>
        campaign.id === campaignId
          ? { ...campaign, managerUserId: managerUserId || undefined }
          : campaign
      );
      saveCampaignsToBrowser(nextCampaigns);
      return nextCampaigns;
    });
    setSaveMessage(managerUserId ? "Manager assigned." : "Manager removed.");
  }

  function selectCampaign(campaign: Campaign) {
    setSelectedId(campaign.id);
    setEditorMode("edit");
    setForm(toForm(campaign));
    setOpenActionsId(null);

    window.setTimeout(() => {
      const selectedCard = document.getElementById(`admin-card-${campaign.id}`);
      if (selectedCard) {
        const stickyNavOffset = 128;
        const nextTop = selectedCard.getBoundingClientRect().top + window.scrollY - stickyNavOffset;
        window.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
      }
      document.getElementById("admin-edit-panel")?.scrollTo({ top: 0, behavior: "smooth" });
    }, 80);
  }

  function switchAdminView(nextView: AdminView) {
    if (nextView === "partners" || nextView === "about") {
      setAdminView(nextView);
      setSelectedId("");
      setEditorMode("edit");
      setForm(toForm());
      return;
    }

    setAdminView(nextView);
    setSelectedId("");
    setEditorMode("edit");
    setForm(toForm());
  }

  function selectAboutItem(id: AboutSelection) {
    setSelectedAboutId(id);
    setAboutForm(toAboutForm(id, aboutContent));
  }

  function addTeamMember() {
    const newMember: PtaTeamMember = {
      id: `team-member-${Date.now()}`,
      name: "New PTA Member",
      role: "Volunteer",
      image: "",
      section: "board"
    };
    const nextContent = {
      ...aboutContent,
      team: [...aboutContent.team, newMember]
    };

    setAboutContent(nextContent);
    saveAboutContentToBrowser(nextContent);
    setSelectedAboutId(newMember.id);
    setAboutForm(toAboutForm(newMember.id, nextContent));
    setSaveMessage("New team member added.");
  }

  function addCommitteeChair() {
    const newMember: PtaTeamMember = {
      id: `committee-chair-${Date.now()}`,
      name: "New Committee Chair",
      role: "Committee Chair",
      image: "",
      section: "committee"
    };
    const nextContent = {
      ...aboutContent,
      committeeChairs: [...aboutContent.committeeChairs, newMember]
    };

    setAboutContent(nextContent);
    saveAboutContentToBrowser(nextContent);
    setSelectedAboutId(newMember.id);
    setAboutForm(toAboutForm(newMember.id, nextContent));
    setSaveMessage("New committee chair added.");
  }

  function saveAboutItem() {
    const nextContent =
      selectedAboutId === "principal"
        ? {
            ...aboutContent,
            principal: {
              name: aboutForm.name,
              title: aboutForm.title,
              image: aboutForm.image,
              message: aboutForm.message
            },
            contactEmail: aboutForm.contactEmail
          }
        : {
            ...aboutContent,
            team: aboutContent.team.map((member) =>
              member.id === selectedAboutId
                ? {
                    ...member,
                    name: aboutForm.name,
                    role: aboutForm.role,
                    image: aboutForm.image
                  }
                : member
            ),
            committeeChairs: aboutContent.committeeChairs.map((member) =>
              member.id === selectedAboutId
                ? {
                    ...member,
                    name: aboutForm.name,
                    role: aboutForm.role,
                    image: aboutForm.image
                  }
                : member
            ),
            contactEmail: aboutForm.contactEmail || aboutContent.contactEmail
          };

    setAboutContent(nextContent);
    saveAboutContentToBrowser(nextContent);
    setSaveMessage("About page saved in this browser.");
  }

  function deleteTeamMember(memberId: string) {
    const nextContent = {
      ...aboutContent,
      team: aboutContent.team.filter((member) => member.id !== memberId),
      committeeChairs: aboutContent.committeeChairs.filter((member) => member.id !== memberId)
    };
    setAboutContent(nextContent);
    saveAboutContentToBrowser(nextContent);
    setSelectedAboutId("principal");
    setAboutForm(toAboutForm("principal", nextContent));
    setSaveMessage("Team member removed.");
  }

  function handleAboutImageFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) {
      setSaveMessage("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAboutForm((current) => ({ ...current, image: reader.result as string }));
        setSaveMessage("Image added. Save About page to keep it.");
      }
    };
    reader.readAsDataURL(file);
  }

  function createCampaign() {
    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      slug: `new-campaign-${Date.now()}`,
      title: "New PTA Campaign",
      type: "Direct Donation",
      shortDescription: "Briefly describe why families may want to support this effort.",
      fullDescription: "Add the longer parent-facing explanation for this campaign.",
      supports: "Describe the supplies, programs, or student experiences this funding supports.",
      goalAmount: 5000,
      amountRaised: 0,
      startDate: "2026-05-06",
      deadline: "2026-06-06",
      heroImage:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
      heroImageFit: "contain",
      heroImagePosition: "50% 50%",
      externalDonationUrl: "https://example.edu/payments/new-campaign",
      externalActionLabel: "Donate now",
      status: "draft",
      category: "campaign",
      pastImpact: ["Add a past impact example before publishing."]
    };

    setCampaigns((current) => {
      const nextCampaigns = placeCampaignFirst([newCampaign, ...current], newCampaign.id, "campaign");
      saveCampaignsToBrowser(nextCampaigns);
      return nextCampaigns;
    });
    setAdminView("campaigns");
    setSelectedId(newCampaign.id);
    setEditorMode("create");
    setForm(toForm(newCampaign));
    setSaveMessage("New draft created.");
  }

  function createEvent() {
    const newEvent: Campaign = {
      id: `event-${Date.now()}`,
      slug: `new-event-${Date.now()}`,
      title: "New PTA Event",
      type: "Gala / Event",
      shortDescription: "Briefly describe how families can participate in this event.",
      fullDescription: "Add the longer parent-facing explanation for this event.",
      supports: "Describe the volunteer need, signup purpose, or school community benefit.",
      goalAmount: 0,
      amountRaised: 0,
      startDate: "2026-05-06",
      deadline: "2026-06-06",
      heroImage: "/teacher-staff-appreciation-week.jpg",
      heroImageFit: "contain",
      heroImagePosition: "50% 50%",
      externalDonationUrl:
        "https://m.signupgenius.com/#!/showSignUp/60B0C4EAEA922A5F94-63567652-teacher?useFullSite=false",
      externalActionLabel: "Sign up",
      status: "draft",
      category: "event",
      pastImpact: ["Add a past impact or participation note before publishing."]
    };

    setCampaigns((current) => {
      const nextCampaigns = placeCampaignFirst([newEvent, ...current], newEvent.id, "event");
      saveCampaignsToBrowser(nextCampaigns);
      return nextCampaigns;
    });
    setAdminView("events");
    setSelectedId(newEvent.id);
    setEditorMode("create");
    setForm(toForm(newEvent));
    setSaveMessage("New event draft created.");
  }

  function saveCampaign() {
    setCampaigns((current) => {
      const nextCampaigns = current.map((campaign) =>
        campaign.id === selectedId ? fromForm(form, campaign) : campaign
      );
      saveCampaignsToBrowser(nextCampaigns);
      return nextCampaigns;
    });
    setEditorMode("edit");
    setSaveMessage("Saved in this browser.");
  }

  function handleImageFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) {
      setSaveMessage("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setForm((current) => ({
        ...current,
        heroImage: reader.result as string,
        heroImageFit: "contain",
        heroImagePositionX: "50",
        heroImagePositionY: "50"
      }));
      setSaveMessage("Image added. Save changes to keep it.");
    };
    reader.readAsDataURL(file);
  }

  function togglePublish(campaign: Campaign) {
    const nextStatus: CampaignStatus = campaign.status === "active" ? "draft" : "active";
    setCampaigns((current) => {
      const nextCampaigns = current.map((item) =>
        item.id === campaign.id ? { ...item, status: nextStatus } : item
      );
      saveCampaignsToBrowser(nextCampaigns);
      return nextCampaigns;
    });
    if (campaign.id === selectedId) {
      setForm((current) => ({ ...current, status: nextStatus }));
    }
  }

  function updateProgress(campaign: Campaign, value: string) {
    const amountRaised = Number(value);
    if (Number.isNaN(amountRaised)) {
      return;
    }
    setCampaigns((current) => {
      const nextCampaigns = current.map((item) =>
        item.id === campaign.id ? { ...item, amountRaised } : item
      );
      saveCampaignsToBrowser(nextCampaigns);
      return nextCampaigns;
    });
    if (campaign.id === selectedId) {
      setForm((current) => ({ ...current, amountRaised: String(amountRaised) }));
    }
  }

  function deleteCampaign(campaign: Campaign) {
    const confirmed = window.confirm(`Delete "${campaign.title}" from the admin and public portal?`);
    if (!confirmed) {
      return;
    }

    const initialCampaignIds = new Set(initialCampaigns.map((item) => item.id));
    if (initialCampaignIds.has(campaign.id)) {
      rememberDeletedCampaignId(campaign.id);
    }

    setCampaigns((current) => {
      const nextCampaigns = current.filter((item) => item.id !== campaign.id);
      saveCampaignsToBrowser(nextCampaigns);

      const nextVisibleCampaigns = sortCampaignsLatestFirst(
        nextCampaigns.filter((item) =>
          adminView === "events" ? isParticipationEvent(item) : !isParticipationEvent(item)
        )
      );
      const nextSelectedCampaign = nextVisibleCampaigns[0];
      setSelectedId(nextSelectedCampaign?.id ?? "");
      setEditorMode("edit");
      setForm(toForm(nextSelectedCampaign));

      return nextCampaigns;
    });
    setSaveMessage(`Deleted "${campaign.title}".`);
  }

  function convertCampaignCategory(campaign: Campaign) {
    const nextCategory: CampaignCategory = isParticipationEvent(campaign) ? "campaign" : "event";
    const nextView = nextCategory === "event" ? "events" : "campaigns";

    setCampaigns((current) => {
      const movedCampaigns = current.map((item) =>
        item.id === campaign.id ? { ...item, category: nextCategory } : item
      );
      const nextCampaigns = placeCampaignFirst(movedCampaigns, campaign.id, nextCategory);
      saveCampaignsToBrowser(nextCampaigns);
      return nextCampaigns;
    });
    setAdminView(nextView);
    setSelectedId(campaign.id);
    setEditorMode("edit");
    setForm(toForm({ ...campaign, category: nextCategory }));
    setSaveMessage(`Moved "${campaign.title}" to ${nextView}.`);
  }

  function reorderCampaigns(sourceId: string, targetId: string) {
    if (sourceId === targetId || adminView === "partners") {
      return;
    }

    setCampaigns((current) => {
      const currentVisibleCampaigns = sortCampaignsLatestFirst(
        current.filter((item) =>
          adminView === "events" ? isParticipationEvent(item) : !isParticipationEvent(item)
        )
      );
      const sourceIndex = currentVisibleCampaigns.findIndex((item) => item.id === sourceId);
      const targetIndex = currentVisibleCampaigns.findIndex((item) => item.id === targetId);

      if (sourceIndex < 0 || targetIndex < 0) {
        return current;
      }

      const nextVisibleCampaigns = [...currentVisibleCampaigns];
      const [draggedCampaign] = nextVisibleCampaigns.splice(sourceIndex, 1);
      nextVisibleCampaigns.splice(targetIndex, 0, draggedCampaign);

      const displayOrderById = new Map(
        nextVisibleCampaigns.map((item, index) => [item.id, index + 1])
      );
      const nextCampaigns = current.map((item) =>
        displayOrderById.has(item.id)
          ? { ...item, displayOrder: displayOrderById.get(item.id) }
          : item
      );
      saveCampaignsToBrowser(nextCampaigns);
      return nextCampaigns;
    });
    setSaveMessage("Display order updated.");
  }

  if (!currentUser) {
    return (
      <main className="grid min-h-screen place-items-center px-4 py-10">
        <section className="w-full max-w-lg rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-coral text-white">
              {authMode === "signin" ? (
                <LockKeyhole aria-hidden className="h-5 w-5" />
              ) : (
                <UserPlus aria-hidden className="h-5 w-5" />
              )}
            </span>
            <div>
              <p className="text-sm font-semibold text-coral">PTA admin access</p>
              <h1 className="text-2xl font-black">
                {authMode === "signin" ? "Sign in to manage campaigns" : "Create a PTA account"}
              </h1>
            </div>
          </div>
          <div className="mt-6 inline-flex rounded-md border border-ink/10 bg-linen p-1">
            <button
              className={`focus-ring rounded px-3 py-2 text-sm font-bold ${
                authMode === "signin" ? "bg-coral text-white" : "text-ink/68"
              }`}
              onClick={() => setAuthMode("signin")}
              type="button"
            >
              Sign in
            </button>
            <button
              className={`focus-ring rounded px-3 py-2 text-sm font-bold ${
                authMode === "signup" ? "bg-coral text-white" : "text-ink/68"
              }`}
              onClick={() => setAuthMode("signup")}
              type="button"
            >
              Sign up
            </button>
          </div>
          {authMode === "signup" ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Field
                label="First name"
                value={authForm.firstName}
                onChange={(value) => setAuthForm({ ...authForm, firstName: value })}
              />
              <Field
                label="Last name"
                value={authForm.lastName}
                onChange={(value) => setAuthForm({ ...authForm, lastName: value })}
              />
              <label className="text-sm font-bold sm:col-span-2">
                Profile image
                <span className="mt-1 flex items-center gap-3">
                  <Avatar
                    user={
                      authForm.profileImage
                        ? {
                            id: "preview",
                            firstName: authForm.firstName || "P",
                            lastName: authForm.lastName || "T",
                            email: "",
                            password: "",
                            profileImage: authForm.profileImage
                          }
                        : null
                    }
                  />
                  <span className="focus-ring inline-flex cursor-pointer rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-bold">
                    Choose photo
                    <input
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => handleProfileImage(event.target.files?.[0])}
                      type="file"
                    />
                  </span>
                </span>
              </label>
            </div>
          ) : null}
          <label className="mt-5 block text-sm font-bold" htmlFor="email">
            Email
          </label>
          <input
            className="field-control py-3"
            id="email"
            onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
            placeholder="pta@example.com"
            type="email"
            value={authForm.email}
          />
          <label className="mt-4 block text-sm font-bold" htmlFor="password">
            Password
          </label>
          <input
            className="field-control py-3"
            id="password"
            onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                authMode === "signin" ? signIn() : signUp();
              }
            }}
            placeholder="Choose a password"
            type="password"
            value={authForm.password}
          />
          <button
            className="focus-ring mt-4 w-full rounded-md bg-coral px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-meadow"
            onClick={authMode === "signin" ? signIn : signUp}
            type="button"
          >
            {authMode === "signin" ? "Sign in" : "Create account"}
          </button>
          {authMessage ? (
            <p className="mt-4 rounded-md bg-honey/20 px-3 py-2 text-sm font-semibold text-ink/70">
              {authMessage}
            </p>
          ) : null}
          <p className="mt-4 text-sm leading-6 text-ink/62">
            MVP local auth for demos. Replace with a hosted auth provider before production.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/78 shadow-[0_10px_40px_rgba(36,48,47,0.08)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-[98rem] gap-4 px-4 py-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] md:items-center lg:px-8">
          <div className="flex items-center gap-3 md:justify-self-start">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-coral text-white shadow-[0_14px_30px_rgba(244,111,86,0.28)] rotate-[-3deg]">
              <HeartHandshake aria-hidden className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-coral">PTA Fundraising Hub</p>
              <h1 className="text-xl font-black tracking-tight">Admin dashboard</h1>
            </div>
          </div>
          <nav className="flex items-center gap-7 md:justify-self-center" aria-label="Admin sections">
            {adminNavItems.map((item) => (
              <button
                className={`focus-ring border-b-2 px-1 py-2 text-sm font-black transition ${
                  adminView === item.id
                    ? "border-coral text-ink"
                    : "border-transparent text-ink/58 hover:border-coral/35 hover:text-ink"
                }`}
                key={item.id}
                onClick={() => switchAdminView(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="relative flex items-center gap-3 md:justify-self-end">
            <Link
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold shadow-sm transition hover:-translate-y-0.5"
              href="/"
            >
              <Eye aria-hidden className="h-4 w-4" />
              Public portal
            </Link>
            <button
              aria-expanded={isProfileMenuOpen}
              className="focus-ring rounded-full border border-white/70 bg-white p-1 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              <Avatar user={currentUser} />
            </button>
            {isProfileMenuOpen ? (
              <div className="absolute right-0 top-14 z-40 w-44 overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-joyful">
                <button
                  className="focus-ring w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-ink/78 transition hover:bg-sunshine/45"
                  onClick={openProfileModal}
                  type="button"
                >
                  Profile
                </button>
                <button
                  className="focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-ink/78 transition hover:bg-sunshine/45"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    signOut();
                  }}
                  type="button"
                >
                  <LogOut aria-hidden className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {isProfileModalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/42 px-4 py-8 backdrop-blur-sm">
          <section className="w-full max-w-xl rounded-3xl border border-white/70 bg-white p-6 shadow-joyful">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Profile</p>
                <h2 className="mt-1 text-3xl font-black">Your PTA account</h2>
              </div>
              <button
                aria-label="Close profile"
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-ink/58 transition hover:bg-coral/10 hover:text-coral"
                onClick={() => setIsProfileModalOpen(false)}
                type="button"
              >
                <X aria-hidden className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              {profileForm.profileImage ? (
                <img
                  alt="Profile preview"
                  className="h-24 w-24 shrink-0 rounded-3xl object-cover shadow-soft"
                  src={profileForm.profileImage}
                />
              ) : (
                <span className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-linen text-2xl font-black text-ink/58 shadow-soft">
                  {`${(profileForm.firstName || "P").charAt(0)}${(profileForm.lastName || "T").charAt(0)}`.toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-sm font-bold text-ink/68">Profile image</p>
                <p className="mt-1 text-sm leading-6 text-ink/58">
                  Upload a headshot to replace your initials in the admin portal.
                </p>
                <label className="focus-ring mt-3 inline-flex cursor-pointer rounded-full border border-ink/10 bg-linen px-4 py-2 text-sm font-bold shadow-sm transition hover:-translate-y-0.5">
                  Choose image
                  <input
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handleProfileModalImage(event.target.files?.[0])}
                    type="file"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                value={profileForm.firstName}
                onChange={(value) => setProfileForm({ ...profileForm, firstName: value })}
              />
              <Field
                label="Last name"
                value={profileForm.lastName}
                onChange={(value) => setProfileForm({ ...profileForm, lastName: value })}
              />
              <label className="text-sm font-semibold text-ink/55">
                <span>Email</span>
                <input
                  className="field-control cursor-not-allowed bg-zinc-100 text-ink/64"
                  readOnly
                  type="email"
                  value={profileForm.email}
                />
              </label>
              <Field
                label="Phone number"
                type="tel"
                value={profileForm.phone}
                onChange={(value) => setProfileForm({ ...profileForm, phone: value })}
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="focus-ring rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5"
                onClick={() => setIsProfileModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="focus-ring rounded-2xl bg-coral px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-meadow"
                onClick={saveProfile}
                type="button"
              >
                Save profile
              </button>
            </div>
          </section>
        </div>
      ) : null}

      <section
        className={`mx-auto grid max-w-[98rem] gap-6 px-4 py-8 sm:px-6 lg:px-8 ${
          selectedCampaign
            ? "xl:grid-cols-[minmax(0,1fr)_minmax(36rem,0.72fr)]"
            : "xl:grid-cols-1"
        }`}
      >
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-meadow">
                {adminView === "campaigns" ? "Campaigns" : adminView === "events" ? "Events" : adminView === "about" ? "About PTA" : "Partners"}
              </p>
              <h2 className="mt-1 text-3xl font-black">
                Manage {adminView === "campaigns" ? "campaigns" : adminView === "events" ? "events" : adminView === "about" ? "About PTA page" : "partners"}
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {adminView !== "partners" && adminView !== "about" ? (
              <label className="relative block w-full sm:w-80">
                <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/42" />
                <input
                  className="field-control mt-0 rounded-full py-3 pl-16"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={`Search ${adminView}`}
                  style={{ paddingLeft: "3.25rem" }}
                  type="text"
                  value={searchQuery}
                />
              </label>
            ) : null}
            {adminView === "campaigns" ? (
              <button
                className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-full bg-meadow px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5"
                onClick={createCampaign}
                type="button"
              >
                <Plus aria-hidden className="h-4 w-4" />
                Add campaign
              </button>
            ) : null}
            {adminView === "events" ? (
              <button
                className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-full bg-honey px-4 py-2 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5"
                onClick={createEvent}
                type="button"
              >
                <Plus aria-hidden className="h-4 w-4" />
                Add event
              </button>
            ) : null}
            </div>
          </div>

          {adminView === "about" ? (
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(32rem,0.58fr)]">
              <div className="space-y-4">
                <article
                  className={`cursor-pointer rounded-3xl border-2 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-white hover:shadow-joyful ${
                    selectedAboutId === "principal" ? "border-coral" : "border-white/70"
                  }`}
                  onClick={() => selectAboutItem("principal")}
                >
                  <div className="flex items-center gap-4">
                    <PersonImage className="h-24 w-24 rounded-2xl" image={aboutContent.principal.image} name={aboutContent.principal.name} />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Principal message</p>
                      <h3 className="mt-1 text-2xl font-black">{aboutContent.principal.name}</h3>
                      <p className="text-sm font-bold text-meadow">{aboutContent.principal.title}</p>
                    </div>
                  </div>
                </article>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-black">2025-2026 PTA Board</h3>
                  <button
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-meadow px-4 py-2 text-sm font-bold text-white shadow-sm"
                    onClick={addTeamMember}
                    type="button"
                  >
                    <Plus aria-hidden className="h-4 w-4" />
                    Add team member
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {aboutContent.team.map((member) => (
                    <article
                      className={`cursor-pointer rounded-3xl border-2 bg-white/88 p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-white hover:shadow-joyful ${
                        selectedAboutId === member.id ? "border-coral bg-white" : "border-white/70"
                      }`}
                      key={member.id}
                      onClick={() => selectAboutItem(member.id)}
                    >
                      <div className="flex items-center gap-3">
                        <PersonImage className="h-16 w-16 rounded-2xl" image={member.image} name={member.name} />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-lg font-black">{member.name}</h4>
                          <p className="truncate text-sm font-bold text-meadow">{member.role}</p>
                        </div>
                        <button
                          className="focus-ring rounded-full p-2 text-coral hover:bg-coral/10"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteTeamMember(member.id);
                          }}
                          type="button"
                        >
                          <Trash2 aria-hidden className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-black">2025-2026 Committee Chairs</h3>
                  <button
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-honey px-4 py-2 text-sm font-bold text-ink shadow-sm"
                    onClick={addCommitteeChair}
                    type="button"
                  >
                    <Plus aria-hidden className="h-4 w-4" />
                    Add chair
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {aboutContent.committeeChairs.map((member) => (
                    <article
                      className={`cursor-pointer rounded-3xl border-2 bg-white/88 p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-white hover:shadow-joyful ${
                        selectedAboutId === member.id ? "border-coral bg-white" : "border-white/70"
                      }`}
                      key={member.id}
                      onClick={() => selectAboutItem(member.id)}
                    >
                      <div className="flex items-center gap-3">
                        <PersonImage className="h-16 w-16 rounded-2xl" image={member.image} name={member.name} />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-lg font-black">{member.name}</h4>
                          <p className="truncate text-sm font-bold text-meadow">{member.role}</p>
                        </div>
                        <button
                          className="focus-ring rounded-full p-2 text-coral hover:bg-coral/10"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteTeamMember(member.id);
                          }}
                          type="button"
                        >
                          <Trash2 aria-hidden className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <aside className="h-fit rounded-3xl border border-white/70 bg-white/86 p-5 shadow-joyful backdrop-blur xl:sticky xl:top-28">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black">Edit About PTA</h2>
                  <Link
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-3 py-2 text-sm font-bold text-white"
                    href="/about"
                  >
                    <Eye aria-hidden className="h-4 w-4" />
                    Preview
                  </Link>
                </div>
                <div className="grid gap-5">
	                  <FormSection title={selectedAboutId === "principal" ? "Principal details" : "Team member details"}>
                    <Field label="Name" value={aboutForm.name} onChange={(value) => setAboutForm({ ...aboutForm, name: value })} />
                    {selectedAboutId === "principal" ? (
                      <>
                        <Field label="Title" value={aboutForm.title} onChange={(value) => setAboutForm({ ...aboutForm, title: value })} />
                        <Field label="PTA contact email" value={aboutForm.contactEmail} onChange={(value) => setAboutForm({ ...aboutForm, contactEmail: value })} />
                        <TextArea label="Principal message" value={aboutForm.message} onChange={(value) => setAboutForm({ ...aboutForm, message: value })} />
                      </>
                    ) : (
                      <Field label="Role" value={aboutForm.role} onChange={(value) => setAboutForm({ ...aboutForm, role: value })} />
                    )}
                    <Field label="Image URL" value={aboutForm.image} onChange={(value) => setAboutForm({ ...aboutForm, image: value })} />
                    <div className="rounded-2xl bg-linen p-4">
                      <p className="text-sm font-black">Profile image</p>
                      <p className="mt-1 text-xs leading-5 text-ink/58">Drag and drop a headshot here, or choose an image file.</p>
                      <div
                        className="mt-3 grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-coral/30 bg-white bg-cover bg-center bg-no-repeat transition hover:border-coral hover:shadow-soft"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          handleAboutImageFile(event.dataTransfer.files[0]);
                        }}
                        style={{
                          backgroundImage: aboutForm.image ? `url(${aboutForm.image})` : undefined
                        }}
                      >
                        {!aboutForm.image ? (
                          <span className="text-sm font-bold text-ink/42">Drop image here</span>
                        ) : null}
                      </div>
                      <label className="focus-ring mt-3 inline-flex cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">
                        Choose image
                        <input
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) => handleAboutImageFile(event.target.files?.[0])}
                          type="file"
                        />
                      </label>
                    </div>
                  </FormSection>
                  <button
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-meadow"
                    onClick={saveAboutItem}
                    type="button"
                  >
                    <Save aria-hidden className="h-4 w-4" />
                    Save About PTA page
                  </button>
                </div>
              </aside>
            </section>
          ) : null}

          {adminView === "partners" ? (
            <section className="rounded-3xl border border-white/70 bg-white/88 p-8 shadow-soft backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Partner directory</p>
              <h3 className="mt-2 text-2xl font-black">Partners are ready for the next build step</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/66">
                This section can become the place to manage restaurant partners, auction sponsors, and
                community supporters without mixing them into campaigns or events.
              </p>
            </section>
          ) : null}

          {adminView !== "partners" && adminView !== "about" && visibleCampaigns.length === 0 ? (
            <section className="rounded-3xl border border-white/70 bg-white/88 p-8 text-center shadow-soft backdrop-blur">
              <p className="text-lg font-black">No {adminView} found</p>
              <p className="mt-2 text-sm text-ink/62">Try another keyword or clear the search.</p>
            </section>
          ) : null}

          {adminView !== "partners" && adminView !== "about" ? visibleCampaigns.map((campaign) => (
            <article
              className={`group scroll-mt-32 rounded-3xl p-4 shadow-soft outline-none backdrop-blur transition hover:-translate-y-0.5 hover:shadow-joyful md:h-[19.5rem] ${
                selectedId === campaign.id
                  ? "border-[3px] border-coral bg-white shadow-[0_26px_70px_rgba(244,111,86,0.28)]"
                  : "border-2 border-white/70 bg-white/88 hover:border-white hover:bg-white/95"
              } ${
                draggedCampaignId === campaign.id
                  ? "scale-[0.99] border-coral bg-coral/10 shadow-[0_24px_60px_rgba(244,111,86,0.26)]"
                  : ""
              } ${
                dragOverCampaignId === campaign.id && draggedCampaignId !== campaign.id
                  ? "border-coral bg-sunshine/35 shadow-[0_28px_80px_rgba(244,111,86,0.3)] ring-4 ring-coral/15"
                  : ""
              }`}
              id={`admin-card-${campaign.id}`}
              key={campaign.id}
              onClick={() => selectCampaign(campaign)}
              onDragLeave={() => {
                if (dragOverCampaignId === campaign.id) {
                  setDragOverCampaignId(null);
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (draggedCampaignId && draggedCampaignId !== campaign.id) {
                  setDragOverCampaignId(campaign.id);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedCampaignId) {
                  reorderCampaigns(draggedCampaignId, campaign.id);
                  setDraggedCampaignId(null);
                  setDragOverCampaignId(null);
                }
              }}
            >
              <div className="grid h-full gap-4 md:grid-cols-[13rem_minmax(0,1fr)_2.75rem]">
                <div className="space-y-3">
                  <button
                    className="focus-ring block h-[17.5rem] w-full overflow-hidden rounded-2xl border border-ink/10 bg-linen bg-cover bg-center bg-no-repeat text-left"
                    onClick={(event) => {
                      event.stopPropagation();
                      selectCampaign(campaign);
                    }}
                    style={{
                      backgroundImage: `url(${campaign.heroImage})`,
                      backgroundPosition: campaign.heroImagePosition ?? "50% 50%"
                    }}
                    type="button"
                  />
                </div>
                <div className="flex h-full flex-col text-left">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <button
                      className="focus-ring block min-w-0 flex-1 text-left"
                      onClick={(event) => {
                        event.stopPropagation();
                        selectCampaign(campaign);
                      }}
                      type="button"
                    >
                      <h3 className="text-xl font-black">{campaign.title}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusPill status={getPublicCampaignStatus(campaign)} />
                        <span className="text-xs font-bold text-ink/48">{formatDate(campaign.deadline)}</span>
                      </div>
                    </button>
                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:ml-auto sm:justify-end">
                    <div className="relative">
                      <button
                        className="focus-ring inline-flex items-center justify-center p-2 text-ink/62 transition hover:text-coral"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenActionsId(openActionsId === campaign.id ? null : campaign.id);
                        }}
                        type="button"
                      >
                        <MoreHorizontal aria-hidden className="h-5 w-5" />
                      </button>
                      {openActionsId === campaign.id ? (
                        <div className="absolute right-0 top-10 z-20 w-52 overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-joyful">
                          <button
                            className="focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-ink/76 transition hover:bg-sunshine/45"
                            onClick={(event) => {
                              event.stopPropagation();
                              convertCampaignCategory(campaign);
                              setOpenActionsId(null);
                            }}
                            type="button"
                          >
                            <ArrowLeftRight aria-hidden className="h-4 w-4" />
                            {isParticipationEvent(campaign) ? "Move to campaigns" : "Move to events"}
                          </button>
                          <button
                            className="focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-coral transition hover:bg-coral/10"
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteCampaign(campaign);
                              setOpenActionsId(null);
                            }}
                            type="button"
                          >
                            <Trash2 aria-hidden className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <Link
                      className="focus-ring inline-flex items-center justify-center rounded-full bg-ink px-3 py-2 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5"
                      href={`/campaigns/${campaign.slug}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Eye aria-hidden className="mr-1 h-4 w-4" />
                      Preview
                    </Link>
                    <button
                      className="focus-ring inline-flex items-center justify-center rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-black shadow-sm transition hover:bg-mint"
                      onClick={(event) => {
                        event.stopPropagation();
                        togglePublish(campaign);
                      }}
                      type="button"
                    >
                      {campaign.status === "active" ? (
                        <ToggleRight aria-hidden className="mr-1 h-4 w-4 text-meadow" />
                      ) : (
                        <ToggleLeft aria-hidden className="mr-1 h-4 w-4" />
                      )}
                      {campaign.status === "active" ? "Unpublish" : "Publish"}
                    </button>
                    </div>
                  </div>
                  <button
                    className="focus-ring mt-3 block w-full text-left"
                    onClick={(event) => {
                      event.stopPropagation();
                      selectCampaign(campaign);
                    }}
                    type="button"
                  >
                    <p
                      className="max-w-2xl text-sm leading-6 text-ink/66"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {campaign.shortDescription}
                    </p>
                  </button>
                  <ManagerControl
                    campaign={campaign}
                    isOpen={openManagerId === campaign.id}
                    onToggle={() => setOpenManagerId(openManagerId === campaign.id ? null : campaign.id)}
                    users={ptaUsers}
                    onChange={(managerUserId) => {
                      assignManager(campaign.id, managerUserId);
                      setOpenManagerId(null);
                    }}
                  />
                  {isParticipationEvent(campaign) ? (
                    <p className="mt-4 rounded-md bg-linen p-3 text-sm font-semibold text-ink/66">
                      Event signup link: {campaign.externalDonationUrl}
                    </p>
                  ) : (
                    <div className="mt-3 flex flex-col gap-3 pr-3 sm:flex-row sm:items-end">
                      <div className="min-w-0 flex-1 sm:max-w-lg">
                        <ProgressBar campaign={campaign} />
                        <p className="mt-2 text-xs leading-5 text-ink/66">
                          {formatCurrency(campaign.amountRaised)} raised of {formatCurrency(campaign.goalAmount)}
                        </p>
                      </div>
                      <label className="text-sm font-semibold text-ink/55 sm:w-48">
                        Update progress
                        <input
                          className="field-control"
                          min="0"
                          onChange={(event) => updateProgress(campaign, event.target.value)}
                          onClick={(event) => event.stopPropagation()}
                          type="number"
                          value={campaign.amountRaised}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div
                  aria-label={`Drag ${campaign.title} to reorder`}
                  className="focus-ring hidden h-24 cursor-grab items-center justify-center self-center rounded-2xl text-ink/45 transition hover:bg-coral/10 hover:text-coral active:cursor-grabbing md:flex"
                  draggable
                  onDragEnd={() => {
                    setDraggedCampaignId(null);
                    setDragOverCampaignId(null);
                  }}
                  onDragStart={(event) => {
                    setDraggedCampaignId(campaign.id);
                    event.dataTransfer.effectAllowed = "move";
                    const card = document.getElementById(`admin-card-${campaign.id}`);
                    if (card) {
                      const rect = card.getBoundingClientRect();
                      const dragPreview = card.cloneNode(true) as HTMLElement;
                      dragPreview.style.position = "fixed";
                      dragPreview.style.top = "-1000px";
                      dragPreview.style.left = "-1000px";
                      dragPreview.style.width = `${rect.width}px`;
                      dragPreview.style.height = `${rect.height}px`;
                      dragPreview.style.opacity = "1";
                      dragPreview.style.background = "#fffaf0";
                      dragPreview.style.boxShadow = "0 30px 90px rgba(244,111,86,0.34)";
                      dragPreview.style.pointerEvents = "none";
                      document.body.appendChild(dragPreview);
                      event.dataTransfer.setDragImage(dragPreview, rect.width - 24, rect.height / 2);
                      window.setTimeout(() => dragPreview.remove(), 0);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  title="Drag to reorder"
                >
                  <GripVertical aria-hidden className="h-6 w-6" />
                </div>
              </div>
            </article>
          )) : null}
        </div>

        {selectedCampaign && adminView !== "about" ? (
        <aside
          className="scroll-mt-28 min-w-0 h-fit rounded-3xl border border-white/70 bg-white/86 p-5 shadow-joyful backdrop-blur xl:sticky xl:top-28"
          id="admin-edit-panel"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">{editorMode === "create" ? "Create" : "Edit"}</h2>
            <button
              aria-label="Close edit panel"
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/58 transition hover:bg-coral/10 hover:text-coral"
	              onClick={() => {
	                setSelectedId("");
                setEditorMode("edit");
	                setForm(toForm());
	              }}
              type="button"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-5">
            <FormSection title="Details">
            <Field label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
            <SelectField
              label="Type"
              onChange={(value) => setForm({ ...form, type: value as CampaignType })}
              options={campaignTypes.map((type) => ({ label: type, value: type }))}
              value={form.type}
            />
            {selectedCampaign ? (
              <SelectField
                label="Manager / volunteer lead"
                onChange={(value) => assignManager(selectedCampaign.id, value)}
                options={[
                  { label: "No manager assigned", value: "" },
                  ...ptaUsers.map((user) => ({
                    label: `${getDisplayName(user)} - ${user.email}`,
                    value: user.id
                  }))
                ]}
                value={selectedCampaign.managerUserId ?? ""}
              />
            ) : null}
            <Field label="Short description" value={form.shortDescription} onChange={(value) => setForm({ ...form, shortDescription: value })} />
            <TextArea label="Full description" value={form.fullDescription} onChange={(value) => setForm({ ...form, fullDescription: value })} />
            <TextArea label="What the money supports" value={form.supports} onChange={(value) => setForm({ ...form, supports: value })} />
            </FormSection>
            <FormSection title={adminView === "events" ? "Timeline" : "Timeline and goal"}>
            <div className="grid gap-4 sm:grid-cols-2">
              {adminView !== "events" ? (
                <>
                  <Field label="Goal amount" type="number" value={form.goalAmount} onChange={(value) => setForm({ ...form, goalAmount: value })} />
                  <Field label="Amount raised" type="number" value={form.amountRaised} onChange={(value) => setForm({ ...form, amountRaised: value })} />
                </>
              ) : null}
              <Field label="Start date" type="date" value={form.startDate} onChange={(value) => setForm({ ...form, startDate: value })} />
              <Field label="Deadline" type="date" value={form.deadline} onChange={(value) => setForm({ ...form, deadline: value })} />
            </div>
            </FormSection>
            <FormSection title="Visuals and links">
            <Field label="Hero image URL" value={form.heroImage} onChange={(value) => setForm({ ...form, heroImage: value })} />
            <div className="rounded-2xl bg-linen p-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-black">Image framing</p>
                <p className="text-xs leading-5 text-ink/58">
                  Drag an image onto the preview, or choose a file. It saves locally in this browser.
                </p>
              </div>
              <div
                className="mt-3 aspect-[3/4] w-full rounded-2xl border border-dashed border-coral/30 bg-white bg-no-repeat transition hover:border-coral hover:shadow-soft"
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleImageFile(event.dataTransfer.files[0]);
                }}
                style={{
                  backgroundImage: `url(${form.heroImage})`,
                  backgroundPosition: `${form.heroImagePositionX}% ${form.heroImagePositionY}%`,
                  backgroundSize: form.heroImageFit
                }}
              />
              <div className="mt-4 grid gap-4">
                <label className="focus-ring inline-flex cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold shadow-sm">
                  Choose image
                  <input
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handleImageFile(event.target.files?.[0])}
                    type="file"
                  />
                </label>
                <SelectField
                  label="Fit"
                  onChange={(value) => setForm({ ...form, heroImageFit: value as "cover" | "contain" })}
                  options={[
                    { label: "Show full image", value: "contain" },
                    { label: "Fill frame, crop edges", value: "cover" }
                  ]}
                  value={form.heroImageFit}
                />
                <Slider
                  label="Horizontal position"
                  value={form.heroImagePositionX}
                  onChange={(value) => setForm({ ...form, heroImagePositionX: value })}
                />
                <Slider
                  label="Vertical position"
                  value={form.heroImagePositionY}
                  onChange={(value) => setForm({ ...form, heroImagePositionY: value })}
                />
              </div>
            </div>
            <Field
              label={adminView === "events" ? "External signup URL" : "External donation URL"}
              value={form.externalDonationUrl}
              onChange={(value) => setForm({ ...form, externalDonationUrl: value })}
            />
            <Field
              label="External button label"
              value={form.externalActionLabel}
              onChange={(value) => setForm({ ...form, externalActionLabel: value })}
            />
            </FormSection>
            {form.type === "Restaurant Fundraiser" ? (
              <FormSection title="Restaurant details">
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <AdminMetric
                    label="Parent reports"
                    value={`${selectedReceiptSummary.participationCount}`}
                  />
                  <AdminMetric
                    label="Reported sales"
                    value={formatCurrency(selectedReceiptSummary.orderTotal)}
                  />
                  <AdminMetric
                    label="Estimated giveback"
                    value={formatCurrency(selectedReceiptSummary.givebackAmount)}
                  />
                </div>
                <div className="mt-3 grid gap-3">
                  <Field label="Restaurant name" value={form.restaurantName} onChange={(value) => setForm({ ...form, restaurantName: value })} />
                  <Field label="Location" value={form.restaurantLocation} onChange={(value) => setForm({ ...form, restaurantLocation: value })} />
                  <TextArea label="Dine-in / takeout instructions" value={form.restaurantInstructions} onChange={(value) => setForm({ ...form, restaurantInstructions: value })} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Donation percentage" type="number" value={form.donationPercentage} onChange={(value) => setForm({ ...form, donationPercentage: value })} />
                    <Field label="Promo code / QR placeholder" value={form.promoCode} onChange={(value) => setForm({ ...form, promoCode: value })} />
                    <Field label="Participation count" type="number" value={form.participationCount} onChange={(value) => setForm({ ...form, participationCount: value })} />
                    <Field label="Expected donation" type="number" value={form.expectedDonation} onChange={(value) => setForm({ ...form, expectedDonation: value })} />
                    <Field label="Actual received amount" type="number" value={form.actualReceivedAmount} onChange={(value) => setForm({ ...form, actualReceivedAmount: value })} />
                    <label className="text-sm font-semibold text-ink/55">
                      Payout status
                      <select
                        className="field-control"
                        onChange={(event) => setForm({ ...form, payoutStatus: event.target.value as PayoutStatus })}
                        value={form.payoutStatus}
                      >
                        {payoutStatuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <TextArea
                    label="Parent self-report placeholder, marked unverified"
                    value={form.parentSelfReportNote}
                    onChange={(value) => setForm({ ...form, parentSelfReportNote: value })}
                  />
                </div>
              </FormSection>
            ) : null}

            <button
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-meadow"
              onClick={saveCampaign}
              type="button"
            >
              <Save aria-hidden className="h-4 w-4" />
              Save changes
            </button>
            {saveMessage ? (
              <p className="rounded-md bg-meadow/10 px-3 py-2 text-sm font-semibold text-meadow">
                {saveMessage}
              </p>
            ) : null}
            <p className="text-xs leading-5 text-ink/58">
              This mock dashboard saves edits in this browser. Connect the campaign model to a
              database before launch so every PTA admin sees the same changes.
            </p>
          </div>
        </aside>
        ) : null}
      </section>
    </main>
  );
}

function Field({
  label,
  onChange,
  type = "text",
  value
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="text-sm font-semibold text-ink/55">
      <span>{label}</span>
      <input
        className="field-control"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function FormSection({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-black">{title}</h3>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative text-sm font-semibold text-ink/55">
      <span>{label}</span>
      <button
        aria-expanded={isOpen}
        className="focus-ring mt-1 flex w-full items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white px-3 py-2.5 pr-5 text-left text-sm font-bold text-ink shadow-sm transition hover:border-coral/35 focus:border-coral focus:ring-2 focus:ring-coral/20"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="min-w-0 truncate">{selectedOption?.label ?? "Select"}</span>
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 shrink-0 text-ink/70 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-40 max-h-72 overflow-auto rounded-2xl border border-ink/10 bg-white p-2 shadow-joyful">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                className={`focus-ring w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                  isSelected
                    ? "bg-coral/10 text-coral"
                    : "text-ink/76 hover:bg-sunshine/45 hover:text-ink"
                }`}
                key={`${label}-${option.value || "empty"}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function Avatar({ user }: { user: PtaUser | null }) {
  if (!user) {
    return (
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-linen text-xs font-black text-ink/50">
        --
      </span>
    );
  }

  if (user.profileImage) {
    return (
      <img
        alt={`${getDisplayName(user)} profile`}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
        src={user.profileImage}
      />
    );
  }

  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral text-xs font-black text-white">
      {getInitials(user)}
    </span>
  );
}

function PersonImage({
  className,
  image,
  name
}: {
  className: string;
  image: string;
  name: string;
}) {
  if (image) {
    return <img alt="" className={`${className} object-cover`} src={image} />;
  }

  return (
    <span className={`${className} grid shrink-0 place-items-center bg-zinc-100 text-sm font-black text-zinc-600`}>
      {name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)}
    </span>
  );
}

function ManagerControl({
  campaign,
  isOpen,
  onChange,
  onToggle,
  users
}: {
  campaign: Campaign;
  isOpen: boolean;
  onChange: (managerUserId: string) => void;
  onToggle: () => void;
  users: PtaUser[];
}) {
  const selectedUser = users.find((user) => user.id === campaign.managerUserId) ?? null;

  return (
    <div className="relative mt-3 max-w-max">
      <button
        aria-expanded={isOpen}
        className="focus-ring inline-flex items-center gap-2 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        type="button"
      >
        {selectedUser ? (
          selectedUser.profileImage ? (
            <img
              alt={`${getDisplayName(selectedUser)} profile`}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
              src={selectedUser.profileImage}
            />
          ) : (
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-honey text-xs font-black text-ink">
              {getInitials(selectedUser)}
            </span>
          )
        ) : (
          <span className="grid h-9 w-9 shrink-0 place-items-center text-zinc-600">
            <CircleHelp aria-hidden className="h-7 w-7" />
          </span>
        )}
        <span>{selectedUser ? `Managed by ${getDisplayName(selectedUser)}` : "Select a manager/volunteer"}</span>
        <ChevronDown aria-hidden className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen ? (
        <div className="absolute left-0 top-12 z-30 w-64 overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-joyful">
          <button
            className="focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-ink/70 transition hover:bg-sunshine/45"
            onClick={(event) => {
              event.stopPropagation();
              onChange("");
            }}
            type="button"
          >
            <CircleHelp aria-hidden className="h-5 w-5 text-zinc-500" />
            Unassign
          </button>
          {users.map((user) => (
            <button
              className="focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-ink/76 transition hover:bg-sunshine/45"
              key={user.id}
              onClick={(event) => {
                event.stopPropagation();
                onChange(user.id);
              }}
              type="button"
            >
              {user.profileImage ? (
                <img
                  alt=""
                  className="h-7 w-7 rounded-full object-cover"
                  src={user.profileImage}
                />
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-honey text-xs font-black text-ink">
                  {getInitials(user)}
                </span>
              )}
              {getDisplayName(user)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ManagerBadge({ user }: { user: PtaUser | null }) {
  if (!user) {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full bg-linen px-3 py-1 text-xs font-bold text-ink/58">
        No manager assigned
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-mint px-2.5 py-1 text-xs font-bold text-meadow">
      <Avatar user={user} />
      Managed by {getDisplayName(user)}
    </span>
  );
}

function AdminMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-coral/20 bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-ink/52">{label}</p>
      <p className="mt-1 text-2xl font-black text-coral">{value}</p>
    </div>
  );
}

function TextArea({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="text-sm font-semibold text-ink/55">
      <span>{label}</span>
      <textarea
        className="field-control min-h-28 resize-y"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function toProfileForm(user: PtaUser) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? "",
    profileImage: user.profileImage
  };
}

function toForm(campaign?: Campaign): CampaignForm {
  return {
    title: campaign?.title ?? "",
    type: campaign?.type ?? "Direct Donation",
    shortDescription: campaign?.shortDescription ?? "",
    fullDescription: campaign?.fullDescription ?? "",
    supports: campaign?.supports ?? "",
    goalAmount: String(campaign?.goalAmount ?? 0),
    amountRaised: String(campaign?.amountRaised ?? 0),
    startDate: campaign?.startDate ?? "",
    deadline: campaign?.deadline ?? "",
    heroImage: campaign?.heroImage ?? "",
    heroImageFit: campaign?.heroImageFit ?? "contain",
    heroImagePositionX: parsePosition(campaign?.heroImagePosition, 0),
    heroImagePositionY: parsePosition(campaign?.heroImagePosition, 1),
    externalDonationUrl: campaign?.externalDonationUrl ?? "",
    externalActionLabel: campaign?.externalActionLabel ?? "",
    status: campaign?.status ?? "draft",
    restaurantName: campaign?.restaurant?.restaurantName ?? "",
    restaurantLocation: campaign?.restaurant?.location ?? "",
    restaurantInstructions: campaign?.restaurant?.instructions ?? "",
    donationPercentage: String(campaign?.restaurant?.donationPercentage ?? 20),
    promoCode: campaign?.restaurant?.promoCode ?? "",
    participationCount: String(campaign?.restaurant?.participationCount ?? 0),
    expectedDonation: String(campaign?.restaurant?.expectedDonation ?? 0),
    actualReceivedAmount: String(campaign?.restaurant?.actualReceivedAmount ?? 0),
    payoutStatus: campaign?.restaurant?.payoutStatus ?? "pending",
    parentSelfReportNote:
      campaign?.restaurant?.parentSelfReportNote ??
      "Parent self-reports are unverified backup information until payout is confirmed."
  };
}

function fromForm(form: CampaignForm, existing: Campaign): Campaign {
  return {
    ...existing,
    title: form.title,
    type: form.type,
    shortDescription: form.shortDescription,
    fullDescription: form.fullDescription,
    supports: form.supports,
    goalAmount: Number(form.goalAmount),
    amountRaised: Number(form.amountRaised),
    startDate: form.startDate,
    deadline: form.deadline,
    heroImage: form.heroImage,
    heroImageFit: form.heroImageFit,
    heroImagePosition: `${form.heroImagePositionX}% ${form.heroImagePositionY}%`,
    externalDonationUrl: form.externalDonationUrl,
    externalActionLabel: form.externalActionLabel,
    status: form.status,
    restaurant:
      form.type === "Restaurant Fundraiser"
        ? {
            restaurantName: form.restaurantName,
            location: form.restaurantLocation,
            instructions: form.restaurantInstructions,
            donationPercentage: Number(form.donationPercentage),
            promoCode: form.promoCode,
            participationCount: Number(form.participationCount),
            expectedDonation: Number(form.expectedDonation),
            actualReceivedAmount: Number(form.actualReceivedAmount),
            payoutStatus: form.payoutStatus,
            parentSelfReportNote: form.parentSelfReportNote
          }
        : undefined
  };
}

function toAboutForm(selection: AboutSelection, content: AboutContent): AboutForm {
  if (selection === "principal") {
    return {
      name: content.principal.name,
      title: content.principal.title,
      role: "",
      image: content.principal.image,
      message: content.principal.message,
      contactEmail: content.contactEmail
    };
  }

  const member =
    content.team.find((item) => item.id === selection) ??
    content.committeeChairs.find((item) => item.id === selection) ??
    content.team[0];

  return {
    name: member?.name ?? "",
    title: "",
    role: member?.role ?? "",
    image: member?.image ?? "",
    message: "",
    contactEmail: content.contactEmail
  };
}

function isParticipationEvent(campaign: Campaign): boolean {
  if (campaign.category) {
    return campaign.category === "event";
  }

  return (
    campaign.id === "teacher-staff-appreciation-week" ||
    campaign.id.startsWith("event-") ||
    (campaign.id !== "fifth-grade-gift" &&
      campaign.externalActionLabel?.toLowerCase().includes("sign up") === true)
  );
}

function placeCampaignFirst(
  campaignsToOrder: Campaign[],
  campaignId: string,
  category: CampaignCategory
): Campaign[] {
  const visibleCampaigns = sortCampaignsLatestFirst(
    campaignsToOrder.filter((campaign) =>
      category === "event" ? isParticipationEvent(campaign) : !isParticipationEvent(campaign)
    )
  );
  const selectedCampaign = visibleCampaigns.find((campaign) => campaign.id === campaignId);

  if (!selectedCampaign) {
    return campaignsToOrder;
  }

  const orderedVisibleCampaigns = [
    selectedCampaign,
    ...visibleCampaigns.filter((campaign) => campaign.id !== campaignId)
  ];
  const displayOrderById = new Map(
    orderedVisibleCampaigns.map((campaign, index) => [campaign.id, index + 1])
  );

  return campaignsToOrder.map((campaign) =>
    displayOrderById.has(campaign.id)
      ? { ...campaign, displayOrder: displayOrderById.get(campaign.id) }
      : campaign
  );
}

function searchCampaigns(campaigns: Campaign[], query: string): Campaign[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return campaigns;
  }

  return campaigns.filter((campaign) =>
    [
      campaign.title,
      campaign.type,
      campaign.shortDescription,
      campaign.fullDescription,
      campaign.supports,
      campaign.status,
      campaign.externalActionLabel,
      campaign.restaurant?.restaurantName,
      campaign.restaurant?.location,
      campaign.restaurant?.instructions,
      campaign.restaurant?.promoCode
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  );
}

function Slider({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="text-sm font-semibold text-ink/55">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="text-ink/58">{value}%</span>
      </span>
      <input
        className="mt-2 w-full accent-meadow"
        max="100"
        min="0"
        onChange={(event) => onChange(event.target.value)}
        type="range"
        value={value}
      />
    </label>
  );
}

function parsePosition(position: string | undefined, index: 0 | 1): string {
  const fallback = "50";
  const value = position?.split(" ")[index]?.replace("%", "");
  return value && !Number.isNaN(Number(value)) ? value : fallback;
}
