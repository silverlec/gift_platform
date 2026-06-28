import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

export interface GiftOption {
  id: string;
  eventId: string;
  name: string;
  description: string;
  imageUrl: string;
  points: number;
}

export interface GiftSelection {
  id: string;
  eventId: string;
  recipientId: string;
  selectedOptionId: string;
  selectionDate: string;
}

export interface GiftEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  giverId: string;
  recipientId: string;
  recipientName: string;
  status: 'CREATED' | 'SENT' | 'SELECTED' | 'COMPLETED';
  options: GiftOption[];
  selection: GiftSelection | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'GIVER' | 'RECIPIENT';
}

interface AppContextType {
  currentUser: User | null;
  events: GiftEvent[];
  loading: boolean;
  login: (email: string, role: 'GIVER' | 'RECIPIENT', password?: string) => Promise<boolean>;
  register: (username: string, email: string, role: 'GIVER' | 'RECIPIENT', password?: string) => Promise<boolean>;
  logout: () => void;
  createEvent: (eventData: Omit<GiftEvent, 'id' | 'giverId' | 'status' | 'options' | 'selection'>) => Promise<string>;
  updateEvent: (eventId: string, eventData: Partial<GiftEvent>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  addGiftOption: (eventId: string, optionData: Omit<GiftOption, 'id' | 'eventId'>) => Promise<void>;
  deleteGiftOption: (eventId: string, optionId: string) => Promise<void>;
  selectGift: (eventId: string, optionId: string) => Promise<void>;
  completePurchase: (eventId: string) => Promise<void>;
  refreshEvents: () => Promise<void>;
  fetchInviteEvent: (eventId: string) => Promise<GiftEvent>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function transformEvent(e: any): GiftEvent {
  return {
    id: String(e.id),
    name: e.name,
    description: e.description,
    startDate: e.startDate,
    endDate: e.endDate,
    giverId: 'giver-1', // Default representation
    recipientId: e.recipientName ? 'recipient-1' : '',
    recipientName: e.recipientName || '',
    status: e.status || 'CREATED',
    options: (e.options || []).map((o: any) => ({
      id: String(o.id),
      eventId: String(e.id),
      name: o.name,
      description: o.description || '',
      imageUrl: o.imageUrl || '',
      points: o.points || 0,
    })),
    selection: e.selection ? {
      id: String(e.selection.id),
      eventId: String(e.id),
      recipientId: String(e.selection.recipientId),
      selectedOptionId: String(e.selection.selectedOption?.id),
      selectionDate: e.selection.selectionDate || '',
    } : null
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<GiftEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize Auth status on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('birthday_gift_user');
    const token = localStorage.getItem('birthday_gift_token');
    if (savedUser && token) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch events when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.role === 'GIVER') {
      refreshEvents();
    } else {
      setEvents([]);
    }
  }, [currentUser]);

  const refreshEvents = async () => {
    try {
      setLoading(true);
      const data = await api.events.list();
      setEvents(data.map(transformEvent));
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, role: 'GIVER' | 'RECIPIENT', password = 'password'): Promise<boolean> => {
    try {
      setLoading(true);
      const user = await api.auth.login(email, password);
      
      if (user.role !== role) {
        throw new Error('선택한 역할과 가입 정보가 일치하지 않습니다.');
      }

      const sessionUser: User = {
        id: String(user.id),
        username: user.username,
        email: user.email,
        role: user.role,
      };

      setCurrentUser(sessionUser);
      localStorage.setItem('birthday_gift_user', JSON.stringify(sessionUser));
      return true;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, role: 'GIVER' | 'RECIPIENT', password = 'password'): Promise<boolean> => {
    try {
      setLoading(true);
      const user = await api.auth.register(username, email, password, role);

      const sessionUser: User = {
        id: String(user.id),
        username: user.username,
        email: user.email,
        role: user.role,
      };

      setCurrentUser(sessionUser);
      localStorage.setItem('birthday_gift_user', JSON.stringify(sessionUser));
      return true;
    } catch (err) {
      console.error('Register failed', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('birthday_gift_user');
    localStorage.removeItem('birthday_gift_token');
  };

  const createEvent = async (eventData: Omit<GiftEvent, 'id' | 'giverId' | 'status' | 'options' | 'selection'>): Promise<string> => {
    try {
      setLoading(true);
      const created = await api.events.create({
        name: eventData.name,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        recipientName: eventData.recipientName
      });
      await refreshEvents();
      return String(created.id);
    } catch (err) {
      console.error('Create event failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<GiftEvent>) => {
    try {
      setLoading(true);
      await api.events.update(eventId, {
        name: eventData.name,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate
      });
      await refreshEvents();
    } catch (err) {
      console.error('Update event failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      setLoading(true);
      await api.events.delete(eventId);
      await refreshEvents();
    } catch (err) {
      console.error('Delete event failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addGiftOption = async (eventId: string, optionData: Omit<GiftOption, 'id' | 'eventId'>) => {
    try {
      setLoading(true);
      await api.options.add(eventId, optionData);
      await refreshEvents();
    } catch (err) {
      console.error('Add option failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGiftOption = async (eventId: string, optionId: string) => {
    try {
      setLoading(true);
      await api.options.delete(eventId, optionId);
      await refreshEvents();
    } catch (err) {
      console.error('Delete option failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectGift = async (eventId: string, optionId: string) => {
    try {
      setLoading(true);
      await api.selections.select(eventId, optionId);
      if (currentUser && currentUser.role === 'GIVER') {
        await refreshEvents();
      }
    } catch (err) {
      console.error('Select gift failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completePurchase = async (eventId: string) => {
    try {
      setLoading(true);
      await api.events.complete(eventId);
      await refreshEvents();
    } catch (err) {
      console.error('Complete purchase failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchInviteEvent = async (eventId: string): Promise<GiftEvent> => {
    try {
      setLoading(true);
      const data = await api.events.getInvite(eventId);
      const transformed = transformEvent(data);
      
      // Cache/Append this event in current events state so page can find it
      setEvents(prev => {
        const filtered = prev.filter(e => e.id !== transformed.id);
        return [...filtered, transformed];
      });
      
      return transformed;
    } catch (err) {
      console.error('Fetch invite event failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        events,
        loading,
        login,
        register,
        logout,
        createEvent,
        updateEvent,
        deleteEvent,
        addGiftOption,
        deleteGiftOption,
        selectGift,
        completePurchase,
        refreshEvents,
        fetchInviteEvent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
