"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound,
  RotateCcw
} from "lucide-react";
import { 
  initiateAdminLoginAction, 
  verifyAdminTwoStepAction,
  confirmGoogleAdminLoginAction
} from "@/app/actions/adminAuth";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password" | "two_step" | "forgot_password">("email");
  const [email, setEmail] = useState("prasanthicrafts@gmail.com");
  const [password, setPassword] = useState("");
  const [twoStepCode, setTwoStepCode] = useState("");
  const [securityHint, setSecurityHint] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check URL error params and listen for OAuth redirects
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      if (urlError) {
        setError(urlError);
      }
      // If arriving after explicit logout, clear any leftover Supabase session
      if (params.get("logged_out")) {
        supabase.auth.signOut().catch(() => {});
        return;
      }
    }

    const hasOAuthHash = typeof window !== "undefined" && window.location.hash.includes("access_token");

    // Auto-detect and confirm OAuth session only on explicit sign in or OAuth return hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email && (event === "SIGNED_IN" || (hasOAuthHash && event === "INITIAL_SESSION"))) {
        setGoogleLoading(true);
        try {
          const res = await confirmGoogleAdminLoginAction(session.user.email);
          if (res.success) {
            router.push("/admin");
            router.refresh();
          } else {
            setError(res.error || "Google account is not authorized as an administrator.");
            await supabase.auth.signOut();
          }
        } catch {
          setError("Failed to verify administrative authorization.");
        } finally {
          setGoogleLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Step 1: Continue with email
  const handleContinueEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email.trim()) {
      setStep("password");
    }
  };

  // Google Login via Supabase Auth
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/admin/auth/callback`,
        },
      });

      if (error) {
        // If Google OAuth provider is not yet enabled in Supabase project dashboard,
        // provide graceful feedback and allow immediate test login
        console.warn("Supabase Google OAuth response:", error);
        setError(`Google OAuth notice: ${error.message}. Please verify Google provider credentials in your Supabase project settings.`);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to initialize Google authentication.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Step 2: Validate Password & Initiate 2-Step Verification
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await initiateAdminLoginAction({ email, password });
      if (res.success && res.twoStepRequired) {
        setSecurityHint(res.hintCode || "849201");
        setStep("two_step");
      } else {
        setError(res.error || "Invalid administrator credentials.");
      }
    } catch {
      setError("An unexpected error occurred during administrative authentication.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify 6-digit 2-Step Security Code
  const handleTwoStepVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoStepCode || twoStepCode.length < 6) {
      setError("Please enter the 6-digit verification security code.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await verifyAdminTwoStepAction({ email, code: twoStepCode });
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Invalid verification code. Please check and try again.");
      }
    } catch {
      setError("An unexpected error occurred verifying your 2-step security code.");
    } finally {
      setLoading(false);
    }
  };

  // Resend 2-step verification code
  const handleResendCode = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await initiateAdminLoginAction({ email, password });
      if (res.success && res.hintCode) {
        setSecurityHint(res.hintCode);
        setTwoStepCode("");
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0d0e] flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans text-white relative">
      {/* Centered Login Box Container */}
      <div className="w-full max-w-[420px] flex flex-col items-center my-auto">
        {/* SASLK Brand Logo from Admin TopBar */}
        <div className="mb-6 flex items-center justify-center">
          <Link 
            href="https://www.saslk.com" 
            target="_blank" 
            className="flex items-center gap-2 hover:opacity-90 transition group cursor-pointer"
          >
            <span className="text-[18px] font-semibold tracking-tight text-white/90">Powered by</span>
            <span className="text-[32px] font-extrabold italic tracking-tight text-[#00FFFF] drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">
              SASLK
            </span>
          </Link>
        </div>

        {/* Login Modal Card */}
        <div className="bg-white text-[#1a1a1a] rounded-[24px] shadow-2xl p-8 w-full border border-white/10 transition-all duration-300">
          {step === "forgot_password" ? (
            /* Forgot Password View */
            <form onSubmit={(e) => { e.preventDefault(); setStep("password"); }} className="flex flex-col">
              <h1 className="text-[24px] font-bold text-[#1a1a1a] tracking-tight">Forgot your password?</h1>
              <p className="text-[14px] text-[#616161] mt-1 mb-6 leading-normal">
                We'll email instructions to <span className="font-medium text-[#1a1a1a]">{email}</span> on how to reset it
              </p>

              <div className="bg-[#f6f6f7] border border-[#e1e3e5] rounded-xl p-3.5 flex items-center justify-between mb-5">
                <span className="text-[14px] font-medium text-[#1a1a1a]">{email}</span>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-[12px] font-semibold text-[#005bd3] hover:underline"
                >
                  Change email
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#303030] transition shadow-xs flex items-center justify-center cursor-pointer"
              >
                Email password reset
              </button>

              <div className="mt-6 text-center text-[13px] text-[#616161]">
                Remembered your password?{" "}
                <button
                  type="button"
                  onClick={() => setStep("password")}
                  className="text-[#005bd3] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Log in <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : step === "two_step" ? (
            /* Step 3: 2-Step Verification View */
            <form onSubmit={handleTwoStepVerify} className="flex flex-col">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight leading-tight">
                    2-Step Verification
                  </h1>
                  <span className="text-[11px] font-mono font-bold text-amber-700 uppercase">
                    Security Challenge
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-[#616161] mb-4 leading-normal">
                Enter the 6-digit security code generated for your administrator account.
              </p>

              {/* Admin Email Pill */}
              <div className="bg-[#f6f6f7] border border-[#e1e3e5] rounded-xl p-3 flex items-center justify-between mb-4">
                <span className="text-[13px] font-medium text-[#1a1a1a] truncate max-w-[220px]">{email}</span>
                <button
                  type="button"
                  onClick={() => { setStep("password"); setError(null); }}
                  className="text-[12px] font-semibold text-[#005bd3] hover:underline shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Demo Security Code Helper Toast */}
              {securityHint && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-4 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <span className="font-semibold">Security Code: </span>
                      <span className="font-mono font-black text-sm tracking-wider">{securityHint}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoStepCode(securityHint)}
                    className="px-2 py-0.5 rounded-md bg-amber-200/80 hover:bg-amber-300 text-[11px] font-bold text-amber-900 border border-amber-400 transition cursor-pointer"
                  >
                    Fill Code
                  </button>
                </div>
              )}

              {/* 6-Digit Code Input */}
              <label className="block text-[13px] font-semibold text-[#303030] mb-1.5">
                6-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                autoFocus
                placeholder="• • • • • •"
                value={twoStepCode}
                onChange={(e) => setTwoStepCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full border-2 border-[#1a1a1a] rounded-xl px-3.5 py-3 text-[20px] font-mono font-bold text-center tracking-[0.5em] focus:border-[#005bd3] focus:ring-2 focus:ring-[#005bd3]/20 outline-none transition placeholder:tracking-[0.3em] placeholder:text-slate-400 bg-slate-50"
              />

              {error && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Verify & Enter Admin Dashboard Button */}
              <button
                type="submit"
                disabled={loading || twoStepCode.length < 6}
                className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#303030] disabled:opacity-50 transition shadow-xs flex items-center justify-center gap-2 mt-5 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#FFD600]" />
                    <span>Verify & Sign In</span>
                  </>
                )}
              </button>

              {/* Resend & Back Navigation */}
              <div className="mt-4 flex items-center justify-between text-[12px] font-semibold">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-[#005bd3] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resend code</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setStep("password"); setError(null); }}
                  className="text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Back to password
                </button>
              </div>
            </form>
          ) : (
            /* Default: Step 1 (Email) or Step 2 (Password) */
            <>
              <h1 className="text-[26px] font-bold text-[#1a1a1a] tracking-tight">Log in</h1>
              <p className="text-[14px] text-[#616161] mt-0.5 mb-6">Continue to Administration Portal</p>

              {step === "email" ? (
                /* Step 1: Email Form */
                <form onSubmit={handleContinueEmail} className="flex flex-col">
                  <label className="block text-[13px] font-semibold text-[#303030] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-xl px-3.5 py-2.5 text-[14px] focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] outline-none transition"
                  />

                  {/* Continue Button */}
                  <div className="relative mt-4">
                    <button
                      type="submit"
                      className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#303030] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Continue with email
                    </button>
                  </div>

                  {/* Divider or */}
                  <div className="relative flex items-center justify-center my-5">
                    <div className="border-t border-[#e1e3e5] w-full" />
                    <span className="bg-white px-3 text-[12px] text-[#616161] absolute">or</span>
                  </div>

                  {/* Single Google Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full bg-[#f6f6f7] hover:bg-[#e8e8ea] border border-[#e1e3e5] rounded-xl py-2.5 px-4 flex items-center justify-center gap-3 transition font-medium text-[14px] text-[#1a1a1a] shadow-2xs cursor-pointer disabled:opacity-60"
                  >
                    {googleLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#1a1a1a]" />
                    ) : (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </button>
                </form>
              ) : (
                /* Step 2: Password Form */
                <form onSubmit={handlePasswordSubmit} className="flex flex-col">
                  {/* Email Pill Card */}
                  <div className="bg-[#f6f6f7] border border-[#e1e3e5] rounded-xl p-3.5 flex items-center justify-between mb-5">
                    <span className="text-[14px] font-medium text-[#1a1a1a]">{email}</span>
                    <button
                      type="button"
                      onClick={() => { setStep("email"); setError(null); }}
                      className="text-[12px] font-semibold text-[#005bd3] hover:underline"
                    >
                      Change email
                    </button>
                  </div>

                  {/* Password Label & Input */}
                  <label className="block text-[13px] font-semibold text-[#303030] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-[#c9cccf] rounded-xl px-3.5 py-2.5 text-[14px] pr-10 focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#616161] hover:text-[#1a1a1a]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="mt-1.5">
                    <button
                      type="button"
                      onClick={() => setStep("forgot_password")}
                      className="text-[12px] font-semibold text-[#005bd3] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Continue to 2-Step Verification Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#303030] disabled:opacity-60 transition shadow-xs flex items-center justify-center gap-2 mt-6 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <span>Continue to 2-Step Verification</span>
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Clean Bottom Copyright */}
        <div className="w-full text-center pt-6 text-[12px] text-slate-500 font-mono">
          Merchant Administration Portal
        </div>
      </div>
    </div>
  );
}
