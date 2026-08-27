'use client';

import { UserProfile, OpeningSession, UniversalCard } from '@/types/pokemon';

const STORAGE_USERS_KEY = 'hit2u_registered_users';
const STORAGE_CURRENT_USER_KEY = 'hit2u_current_active_user';

export const UserAuthService = {
  getUsers(): UserProfile[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  register(email: string, password: string, name?: string): { success: boolean; user?: UserProfile; error?: string } {
    const users = this.getUsers();
    const cleanEmail = email.toLowerCase().trim();

    if (users.find(u => u.email === cleanEmail)) {
      return { success: false, error: 'Este correo electrónico ya está registrado.' };
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      name: name?.trim() || cleanEmail.split('@')[0],
      tier: 'pro',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      createdAt: new Date().toISOString(),
      savedSessions: [],
      portfolioCards: []
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser };
  },

  login(email: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    const users = this.getUsers();
    const cleanEmail = email.toLowerCase().trim();

    let user = users.find(u => u.email === cleanEmail);

    // If new email on login, auto-register seamless experience
    if (!user) {
      const res = this.register(cleanEmail, password);
      return res;
    }

    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  },

  saveSession(session: OpeningSession): UserProfile | null {
    const current = this.getCurrentUser();
    if (!current) return null;

    const existingIndex = current.savedSessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      current.savedSessions[existingIndex] = session;
    } else {
      current.savedSessions.unshift(session);
    }

    // Add cards to portfolio (deduplicated by id)
    session.cards.forEach(card => {
      const cardIdx = current.portfolioCards.findIndex(c => c.id === card.id);
      if (cardIdx >= 0) {
        current.portfolioCards[cardIdx] = card;
      } else {
        current.portfolioCards.unshift(card);
      }
    });

    // Update in users database
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === current.id);
    if (userIndex >= 0) {
      users[userIndex] = current;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(current));

    return current;
  },

  updateCard(cardId: string, updates: Partial<UniversalCard>): UniversalCard | null {
    const current = this.getCurrentUser();
    if (!current) return null;

    let updatedCard: UniversalCard | null = null;

    // Update in portfolio
    current.portfolioCards = current.portfolioCards.map(c => {
      if (c.id === cardId) {
        updatedCard = { ...c, ...updates };
        return updatedCard;
      }
      return c;
    });

    // Update in sessions
    current.savedSessions = current.savedSessions.map(session => ({
      ...session,
      cards: session.cards.map(c => (c.id === cardId ? { ...c, ...updates } : c)),
      topHitCard: session.topHitCard?.id === cardId ? { ...session.topHitCard, ...updates } : session.topHitCard
    }));

    // Persist
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === current.id);
    if (userIndex >= 0) {
      users[userIndex] = current;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(current));

    return updatedCard;
  }
};
