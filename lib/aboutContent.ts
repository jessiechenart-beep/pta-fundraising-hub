import { principalProfile, ptaTeam } from "@/data/campaigns";

export type PrincipalProfile = typeof principalProfile;
export type PtaTeamMember = (typeof ptaTeam)[number] & { id: string; section?: "board" | "committee" };

export type AboutContent = {
  principal: PrincipalProfile;
  team: PtaTeamMember[];
  committeeChairs: PtaTeamMember[];
  contactEmail: string;
};

const aboutStorageKey = "pta-about-content";

export const defaultAboutContent: AboutContent = {
  principal: principalProfile,
  contactEmail: "qrepta@gmail.com",
  team: [
    { id: "board-president", name: "Michelle Fabregas", role: "President", image: "", section: "board" },
    { id: "board-executive-vp", name: "Stephanie Smith SooHoo", role: "Executive V.P.", image: "", section: "board" },
    { id: "board-secretary", name: "Chandu Jasti", role: "Secretary", image: "", section: "board" },
    { id: "board-treasurer", name: "Paul Guo", role: "Treasurer", image: "", section: "board" },
    { id: "board-financial-secretary", name: "Sherry Chen", role: "Financial Secretary", image: "", section: "board" },
    { id: "board-vp-programs", name: "Sandra Lei", role: "VP Programs", image: "", section: "board" },
    { id: "board-auditor", name: "Shilpi Jain", role: "Auditor", image: "", section: "board" },
    { id: "board-parliamentarian", name: "Amanda Brazinski", role: "Parliamentarian", image: "", section: "board" },
    { id: "board-principal", name: "Bassant Abdelrahman", role: "Principal", image: "", section: "board" }
  ],
  committeeChairs: [
    { id: "committee-after-school-enrichment", name: "Kavinya Padmanabhan", role: "After school Enrichment", image: "", section: "committee" },
    { id: "committee-box-tops", name: "Vinod Krishan", role: "Box Tops for Education", image: "", section: "committee" },
    { id: "committee-communications", name: "Naomi Evans", role: "Communications", image: "", section: "committee" },
    { id: "committee-corporate-sponsors", name: "Sankara Rajagopalan", role: "Corporate Sponsors Liaison", image: "", section: "committee" },
    { id: "committee-dei", name: "Kavinya Padmanabhan", role: "DEI Diversity, Equity, Inclusion", image: "", section: "committee" },
    { id: "committee-event-photographers", name: "Vinod Krishan & Jenner Flores", role: "Event Photographers", image: "", section: "committee" },
    { id: "committee-fall-festival", name: "Nikita Joshi & Amanda Brazinski", role: "Fall Festival", image: "", section: "committee" },
    { id: "committee-family-engagement", name: "Trisha Lim", role: "Family Engagement", image: "", section: "committee" },
    { id: "committee-financial-reviewer", name: "Shilpi Jain", role: "Financial Reviewer/Audit", image: "", section: "committee" },
    { id: "committee-halloween", name: "Nikita Joshi & Amanda Brazinski", role: "Halloween Trunk or Treat", image: "", section: "committee" },
    { id: "committee-historian", name: "Lily Chen", role: "Historian", image: "", section: "committee" },
    { id: "committee-hospitality", name: "Dena Lin", role: "Hospitality/Welcome", image: "", section: "committee" },
    { id: "committee-learning-fund", name: "Meghan Goldman", role: "Learning Fund Rep", image: "", section: "committee" },
    { id: "committee-restaurant", name: "Sarah Navarro", role: "Restaurant Liaison", image: "", section: "committee" },
    { id: "committee-staff-appreciation", name: "Noelle Bronson & Qiana Bronson", role: "Staff Appreciation", image: "", section: "committee" },
    { id: "committee-website", name: "Lilly Tan", role: "Website", image: "", section: "committee" }
  ]
};

export function loadAboutContentFromBrowser(): AboutContent {
  if (typeof window === "undefined") {
    return defaultAboutContent;
  }

  const savedContent = window.localStorage.getItem(aboutStorageKey);

  if (!savedContent) {
    return defaultAboutContent;
  }

  try {
    const parsedContent = JSON.parse(savedContent) as Partial<AboutContent>;
    return {
      ...defaultAboutContent,
      ...parsedContent,
      team: parsedContent.team ?? defaultAboutContent.team,
      committeeChairs: parsedContent.committeeChairs ?? defaultAboutContent.committeeChairs,
      contactEmail: parsedContent.contactEmail ?? defaultAboutContent.contactEmail
    };
  } catch {
    return defaultAboutContent;
  }
}

export function saveAboutContentToBrowser(content: AboutContent) {
  window.localStorage.setItem(aboutStorageKey, JSON.stringify(content));
}
