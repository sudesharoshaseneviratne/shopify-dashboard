"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StoreProduct, BTC_USD_RATE, STORE_PRODUCTS } from "./products";
import { checkDiscountAction } from "@/app/actions/discounts";

export type CurrencyMode = "LKR" | "USD" | "SATS" | "BTC";

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: StoreProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  currency: CurrencyMode;
  setCurrency: (currency: CurrencyMode) => void;
  quickViewProduct: StoreProduct | null;
  setQuickViewProduct: (product: StoreProduct | null) => void;
  totalUsd: number;
  totalSats: number;
  totalBtc: number;
  totalItemsCount: number;
  formatPrice: (amount: number, forceCurrency?: CurrencyMode) => string;
  discountCode: string;
  discountPercent: number;
  applyDiscount: (code: string) => Promise<boolean>;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  compareList: string[];
  toggleCompare: (productId: string) => void;
  isCompared: (productId: string) => boolean;
  clearCompare: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyMode>("LKR");
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);

  const addItem = (product: StoreProduct, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyDiscount = async (code: string): Promise<boolean> => {
    const clean = code.trim().toUpperCase();
    try {
      const result = await checkDiscountAction(clean);
      if (result.valid && result.code) {
        setDiscountCode(result.code);
        setDiscountPercent(result.discountPercent || 21);
        return true;
      }
    } catch {
      // Fallback in case of network glitch
      if (clean === "SATOSHI21" || clean === "HALVING" || clean === "BITCOIN") {
        setDiscountCode(clean);
        setDiscountPercent(21);
        return true;
      }
      if (clean === "GENESIS10" || clean === "DISPATCH10" || clean === "VIP10") {
        setDiscountCode(clean);
        setDiscountPercent(10);
        return true;
      }
    }
    return false;
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const isCompared = (productId: string) => compareList.includes(productId);

  const clearCompare = () => {
    setCompareList([]);
  };

  const subtotalUsd = items.reduce(
    (sum, item) => sum + item.product.priceUsd * item.quantity,
    0
  );

  const totalUsd = discountPercent > 0
    ? subtotalUsd * (1 - discountPercent / 100)
    : subtotalUsd;

  const totalSats = Math.round((totalUsd / BTC_USD_RATE) * 100_000_000);
  const totalBtc = +(totalUsd / BTC_USD_RATE).toFixed(6);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (amount: number, forceCurrency?: CurrencyMode): string => {
    const activeCurr = forceCurrency || currency;
    if (activeCurr === "SATS") {
      const sats = Math.round((amount / BTC_USD_RATE) * 100_000_000);
      return `${sats.toLocaleString()} sats`;
    }
    if (activeCurr === "BTC") {
      const btc = (amount / BTC_USD_RATE).toFixed(6);
      return `₿ ${btc}`;
    }
    if (activeCurr === "USD") {
      return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    return `LKR ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        currency,
        setCurrency,
        quickViewProduct,
        setQuickViewProduct,
        totalUsd,
        totalSats,
        totalBtc,
        totalItemsCount,
        formatPrice,
        discountCode,
        discountPercent,
        applyDiscount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        compareList,
        toggleCompare,
        isCompared,
        clearCompare
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
