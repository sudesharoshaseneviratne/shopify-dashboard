"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  type CustomerSession, 
  type RegisterCustomerInput, 
  loginCustomerAction, 
  registerCustomerAction, 
  logoutCustomerAction, 
  getCurrentCustomerAction 
} from "@/app/actions/customers";

interface CustomerAuthContextType {
  customer: CustomerSession | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterCustomerInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "sat_customer_cached";

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  // Load initial session on mount (from cache first, then verify with server)
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        setCustomer(JSON.parse(cached));
      }
    } catch {
      // Ignore localStorage issues
    }

    getCurrentCustomerAction()
      .then((session) => {
        if (session) {
          setCustomer(session);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
          } catch {}
        } else {
          setCustomer(null);
          try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          } catch {}
        }
      })
      .catch((err) => {
        console.error("Failed to load customer session:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const openAuthModal = useCallback((tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const refreshCustomer = useCallback(async () => {
    try {
      const session = await getCurrentCustomerAction();
      setCustomer(session);
      if (session) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to refresh customer session:", e);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginCustomerAction({ email, password });
      if (res.success && res.customer) {
        setCustomer(res.customer);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.customer));
        } catch {}
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: res.error || "Login failed" };
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterCustomerInput) => {
    setIsLoading(true);
    try {
      const res = await registerCustomerAction(input);
      if (res.success && res.customer) {
        setCustomer(res.customer);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.customer));
        } catch {}
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: res.error || "Registration failed" };
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutCustomerAction();
      setCustomer(null);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {}
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        refreshCustomer,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
