"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password" | "forgot_password">("email");
  const [email, setEmail] = useState("learnixlk@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleContinueEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStep("password");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0d0e] flex flex-col items-center justify-between p-6 select-none font-sans text-white relative">
      {/* Top Container */}
      <div className="w-full flex flex-col items-center pt-8">
        {/* Shopify Logo */}
        <div className="mb-6">
          <svg viewBox="0 0 100 115" className="w-12 h-14 drop-shadow-md">
            <path fill="#95bf47" d="M82.6 25.4c-.1-.7-.7-1.2-1.4-1.2h-11.7v-4.4c0-8.8-7.2-16-16-16s-16 7.2-16 16v4.4H25.8c-.7 0-1.3.5-1.4 1.2L16 93.8c-.1.9.6 1.7 1.5 1.7h72c.9 0 1.6-.8 1.5-1.7l-8.4-68.4z" />
            <path fill="#ffffff" d="M41.5 19.8c0-6.6 5.4-12 12-12s12 5.4 12 12v4.4h-24v-4.4z" />
            <path fill="#ffffff" d="M54.5 42c-7.2 0-11.8 3.8-11.8 8.8 0 10.8 17.5 7.6 17.5 15.6 0 3.6-3.8 5.6-8.2 5.6-6.2 0-11.2-3.4-11.2-3.4l-2.2 6.8s5.4 4 13.8 4c9.2 0 14.8-4.8 14.8-11.4 0-11.4-17.5-8.2-17.5-15.4 0-2.8 2.8-4.6 6.8-4.6 5.2 0 9 2.4 9 2.4l2.2-6.5S62 42 54.5 42z" />
          </svg>
        </div>

        {/* Login Modal Card */}
        <div className="bg-white text-[#1a1a1a] rounded-[24px] shadow-2xl p-8 w-full max-w-[420px] border border-white/10 transition-all duration-300">
          {step === "forgot_password" ? (
            /* Step 3: Forgot Password View (New Screenshot) */
            <form onSubmit={(e) => { e.preventDefault(); setStep("password"); }} className="flex flex-col">
              <h1 className="text-[24px] font-bold text-[#1a1a1a] tracking-tight">Forgot your password?</h1>
              <p className="text-[14px] text-[#616161] mt-1 mb-6 leading-normal">
                We'll email instructions to <span className="font-medium text-[#1a1a1a]">{email}</span> on how to reset it
              </p>

              {/* Email Pill Card */}
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

              {/* Email Password Reset Button */}
              <button
                type="submit"
                className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#303030] transition shadow-xs flex items-center justify-center mt-2"
              >
                Email password reset
              </button>

              {/* Lost access footer link */}
              <div className="mt-6 text-[13px] text-[#616161]">
                Lost access to email?{" "}
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-[#005bd3] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Recover account <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-[26px] font-bold text-[#1a1a1a] tracking-tight">Log in</h1>
              <p className="text-[14px] text-[#616161] mt-0.5 mb-6">Continue to Shopify</p>

              {step === "email" ? (
                /* Step 1: Email Form (Screenshot 1) */
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

                  {/* Continue Button with Last Used Badge */}
                  <div className="relative mt-4">
                    <button
                      type="submit"
                      className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#303030] transition shadow-xs flex items-center justify-center gap-2"
                    >
                      Continue with email
                    </button>
                    <span className="absolute -top-2.5 right-4 bg-[#e0f2fe] text-[#0369a1] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#bae6fd] shadow-2xs pointer-events-none">
                      Last used
                    </span>
                  </div>

                  {/* Divider or */}
                  <div className="relative flex items-center justify-center my-6">
                    <div className="border-t border-[#e1e3e5] w-full" />
                    <span className="bg-white px-3 text-[12px] text-[#616161] absolute">or</span>
                  </div>

                  {/* Passkey Button */}
                  <button
                    type="button"
                    className="w-full bg-[#f1f2f4] text-[#1a1a1a] py-2.5 rounded-xl text-[14px] font-medium hover:bg-[#e4e5e7] transition flex items-center justify-center gap-2 mb-4 border border-[#e1e3e5]"
                  >
                    <KeyRound className="w-4 h-4 text-[#1a1a1a]" />
                    <span>Sign in with passkey</span>
                  </button>

                  {/* Social Login Grid (4 Buttons) */}
                  <div className="grid grid-cols-4 gap-2.5">
                    <button type="button" className="bg-[#f6f6f7] hover:bg-[#e8e8ea] border border-[#e1e3e5] rounded-xl py-2.5 flex items-center justify-center transition">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </button>
                    <button type="button" className="bg-[#f6f6f7] hover:bg-[#e8e8ea] border border-[#e1e3e5] rounded-xl py-2.5 flex items-center justify-center transition text-[#1a1a1a]">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.97.99-3.12-.97.04-2.16.65-2.85 1.46-.6.7-1.13 1.84-.98 2.97 1.09.08 2.21-.5 2.84-1.31z"/>
                      </svg>
                    </button>
                    <button type="button" className="bg-[#f6f6f7] hover:bg-[#e8e8ea] border border-[#e1e3e5] rounded-xl py-2.5 flex items-center justify-center transition">
                      <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button type="button" className="bg-[#f6f6f7] hover:bg-[#e8e8ea] border border-[#e1e3e5] rounded-xl py-2.5 flex items-center justify-center transition">
                      <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Footer Link */}
                  <div className="mt-6 text-[13px] text-[#616161]">
                    New to Shopify?{" "}
                    <a href="#" className="text-[#005bd3] font-semibold hover:underline inline-flex items-center gap-1">
                      Get started <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </form>
              ) : (
                /* Step 2: Password Form (Screenshot 2) */
                <form onSubmit={handleLoginSubmit} className="flex flex-col">
                  {/* Email Pill Card */}
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

                  {/* Submit Log In Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#303030] transition shadow-xs flex items-center justify-center mt-6"
                  >
                    Log In
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Help & Terms Footer */}
      <div className="w-full text-center pb-4 pt-8">
        <a href="#" className="text-[12px] text-[#a1a1aa] hover:underline block">
          Need Help?
        </a>
        <p className="text-[10px] text-[#616161] mt-2 max-w-sm mx-auto leading-relaxed">
          By continuing, you agree to the{" "}
          <a href="#" className="underline hover:text-[#a1a1aa]">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-[#a1a1aa]">
            Privacy Policy
          </a>
          , and to receive marketing emails from Shopify. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
