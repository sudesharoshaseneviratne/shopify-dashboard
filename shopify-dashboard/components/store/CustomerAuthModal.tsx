"use client";

import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "@/lib/store/customerAuthContext";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  ShoppingBag,
  KeyRound,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { 
  requestCustomerPasswordResetAction, 
  resetCustomerPasswordAction 
} from "@/app/actions/customers";

export function CustomerAuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    openAuthModal, 
    login, 
    register 
  } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Colombo, Sri Lanka");

  // Forgot password states
  const [resetStep, setResetStep] = useState<"request" | "verify">("request");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetHintCode, setResetHintCode] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(authModalTab);
    setErrorMessage(null);
    setResetSuccessMessage(null);
  }, [authModalTab, isAuthModalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || "Failed to sign in.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await register({
      name,
      email,
      password,
      phone,
      location,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || "Failed to sign up.");
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setResetSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await requestCustomerPasswordResetAction(resetEmail);
      if (res.success) {
        setResetStep("verify");
        if (res.hintCode) {
          setResetHintCode(res.hintCode);
        }
      } else {
        setErrorMessage(res.error || "Failed to request password reset.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await resetCustomerPasswordAction({
        email: resetEmail,
        code: resetCode,
        newPassword,
      });

      if (res.success) {
        setResetSuccessMessage(res.message || "Password updated successfully!");
        setEmail(resetEmail);
        setPassword(newPassword);
        setTimeout(() => {
          setActiveTab("login");
          setResetStep("request");
          setResetCode("");
          setNewPassword("");
          setConfirmPassword("");
          setResetHintCode(null);
          setResetSuccessMessage("Password reset successful! Please sign in with your new password.");
        }, 1500);
      } else {
        setErrorMessage(res.error || "Failed to reset password.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
      {/* Backdrop Click Outside */}
      <div 
        className="absolute inset-0" 
        onClick={closeAuthModal} 
        aria-label="Close modal backdrop"
      />

      {/* Modal Container: 100% Solid & Opaque Window */}
      <div 
        className="relative w-full max-w-md bg-[#0F131F] border border-amber-500/40 rounded-3xl shadow-2xl shadow-black overflow-hidden z-10 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-b from-[#FFB800]/20 to-transparent blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFB800] to-amber-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
              <ShoppingBag className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-black text-white tracking-wide uppercase">
                Prasanthi Craft <span className="text-[#FFD600]">Account</span>
              </h2>
              <p className="text-[10px] font-mono text-slate-400">
                Customer Sign In &amp; Registration
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-2 relative z-10">
          {activeTab === "forgot" ? (
            <div className="flex items-center justify-between p-2 px-3 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold">
              <span className="text-[#FFD600] flex items-center gap-1.5 font-bold">
                <KeyRound className="w-3.5 h-3.5" />
                Password Recovery
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMessage(null);
                  setResetSuccessMessage(null);
                }}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] transition cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Sign In</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === "login"
                    ? "bg-[#FFB800] text-slate-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition-all text-center cursor-pointer ${
                  activeTab === "register"
                    ? "bg-[#FFB800] text-slate-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-2 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="px-6 py-4 overflow-y-auto space-y-4">
          {activeTab === "login" ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@gmail.com"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("forgot");
                      setResetStep("request");
                      setResetEmail(email);
                      setErrorMessage(null);
                      setResetSuccessMessage(null);
                      setResetHintCode(null);
                    }}
                    className="text-[11px] text-[#FFB800] hover:text-[#FFD600] hover:underline transition cursor-pointer font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#FFB800] hover:brightness-110 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block animate-spin">⏳</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setErrorMessage(null);
                  }}
                  className="text-xs text-slate-400 hover:text-[#FFB800] transition"
                >
                  Need an account? <span className="font-bold underline">Create one</span>
                </button>
              </div>
            </form>
          ) : activeTab === "forgot" ? (
            /* ================= FORGOT PASSWORD FLOW ================= */
            <div className="space-y-4">
              {resetSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{resetSuccessMessage}</span>
                </div>
              )}

              {resetStep === "request" ? (
                /* Step 1: Request verification code */
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#FFB800]" />
                      <span>Forgot Password?</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Enter your registered email address below. We'll generate a 6-digit verification code to securely reset your password.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>Registered Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="customer@gmail.com"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#FFB800] hover:brightness-110 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin">⏳</span>
                    ) : (
                      <>
                        <span>Send Reset Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("login");
                        setErrorMessage(null);
                        setResetSuccessMessage(null);
                      }}
                      className="text-xs text-slate-400 hover:text-[#FFB800] transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Enter code & set new password */
                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <div className="space-y-1">
                    <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#FFB800]" />
                      <span>Create New Password</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Enter the 6-digit code for <span className="text-white font-semibold">{resetEmail}</span>.
                    </p>
                  </div>

                  {resetHintCode && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                      <span className="text-[11px]">Security code:</span>
                      <span className="font-mono font-bold tracking-widest text-[#FFD600] text-sm">{resetHintCode}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-slate-300">
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-center font-mono text-base tracking-widest text-white placeholder:text-slate-600 outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>New Password (min 6 characters)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>Confirm New Password</span>
                    </label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#FFB800] hover:brightness-110 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin">⏳</span>
                    ) : (
                      <>
                        <span>Reset &amp; Update Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setResetStep("request");
                        setResetCode("");
                        setErrorMessage(null);
                      }}
                      className="text-slate-400 hover:text-[#FFB800] transition text-[11px] cursor-pointer"
                    >
                      Resend code
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("login");
                        setErrorMessage(null);
                        setResetSuccessMessage(null);
                      }}
                      className="text-slate-400 hover:text-[#FFB800] transition text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amila Upulitha"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@gmail.com"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="077 123 4567"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FFB800] transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>City / Location</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Colombo, Sri Lanka"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FFB800] transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Password (min. 6 chars)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 py-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Secure customer account with instant order tracking.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#FFB800] hover:brightness-110 text-slate-950 font-heading font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block animate-spin">⏳</span>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-xs text-slate-400 hover:text-[#FFB800] transition"
                >
                  Already registered? <span className="font-bold underline">Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
