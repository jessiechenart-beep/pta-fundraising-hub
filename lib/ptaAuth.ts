export type PtaUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
  phone?: string;
};

const PTA_USERS_STORAGE_KEY = "pta-fundraising-hub-users";
const PTA_SESSION_STORAGE_KEY = "pta-fundraising-hub-current-user";

export function loadPtaUsers(): PtaUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedUsers = window.localStorage.getItem(PTA_USERS_STORAGE_KEY);
  if (!savedUsers) {
    return [];
  }

  try {
    const users = JSON.parse(savedUsers) as PtaUser[];
    return Array.isArray(users) ? users : [];
  } catch {
    window.localStorage.removeItem(PTA_USERS_STORAGE_KEY);
    return [];
  }
}

export function savePtaUsers(users: PtaUser[]) {
  window.localStorage.setItem(PTA_USERS_STORAGE_KEY, JSON.stringify(users));
}

export function loadCurrentPtaUser(): PtaUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const currentUserId = window.localStorage.getItem(PTA_SESSION_STORAGE_KEY);
  if (!currentUserId) {
    return null;
  }

  return loadPtaUsers().find((user) => user.id === currentUserId) ?? null;
}

export function saveCurrentPtaUser(userId: string) {
  window.localStorage.setItem(PTA_SESSION_STORAGE_KEY, userId);
}

export function clearCurrentPtaUser() {
  window.localStorage.removeItem(PTA_SESSION_STORAGE_KEY);
}

export function getDisplayName(user: Pick<PtaUser, "firstName" | "lastName">): string {
  return `${user.firstName} ${user.lastName.charAt(0).toUpperCase()}.`;
}

export function getInitials(user: Pick<PtaUser, "firstName" | "lastName">): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}
