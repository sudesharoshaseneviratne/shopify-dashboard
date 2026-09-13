"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { confirmGoogleAdminLoginAction } from "@/app/actions/adminAuth";

export default function AdminAuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Verifying Google authorization...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      try {
        if (typeof window === "undefined") return;

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const urlError = urlParams.get("error") || urlParams.get("error_description");

        if (urlError) {
          throw new Error(urlError);
        }

        let userEmail: string | null = null;

        // 1. If code is in URL, exchange it using the browser client (has PKCE code verifier in localStorage)
        if (code) {
          setStatus("Exchanging authorization security code...");
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn("Direct code exchange note:", exchangeError.message);
          } else if (data?.session?.user?.email) {
            userEmail = data.session.user.email;
          }
        }

        // 2. If session wasn't obtained from code, check getSession() or onAuthStateChange
        if (!userEmail) {
          setStatus("Checking active authentication session...");
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user?.email) {
            userEmail = sessionData.session.user.email;
          }
        }

        // 3. Fallback: check currentUser
        if (!userEmail) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user?.email) {
            userEmail = userData.user.email;
          }
        }

        if (!userEmail) {
          throw new Error("No authenticated Google administrator email detected.");
        }

        // 4. Validate administrator authorization on server and issue admin session cookie
        if (isMounted) {
          setStatus(`Confirming administrative access for ${userEmail}...`);
        }

        const res = await confirmGoogleAdminLoginAction(userEmail);

        if (!res.success) {
          try {
            await supabase.auth.signOut();
          } catch {
            // Ignore
          }
          throw new Error(res.error || `Access Denied. Account ${userEmail} is not an authorized administrator.`);
        }

        // 5. Success! Redirect into Merchant Admin Dashboard
        if (isMounted) {
          setStatus("Access granted. Redirecting to Dashboard...");
        }
        router.push("/admin");
        router.refresh();
      } catch (err: any) {
        console.error("❌ Google OAuth callback error:", err);
        const rawMsg = err?.message || String(err);
        const errMsg = 
          rawMsg.includes("access_denied")
            ? "Access Denied: This Google account is not an authorized administrator."
            : rawMsg;

        try {
          await supabase.auth.signOut();
        } catch {
          // Ignore
        }

        router.replace(`/admin/login?error=${encodeURIComponent(errMsg)}`);
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="w-full min-h-screen bg-[#0b0d0e] flex flex-col items-center justify-center p-6 select-none font-sans text-white">
      {/* SASLK Brand Logo */}
      <div className="mb-8 flex items-center justify-center">
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

      {/* Status Card */}
      <div className="bg-white text-[#1a1a1a] rounded-[24px] shadow-2xl p-8 w-full max-w-[420px] border border-white/10 text-center">
        {error ? (
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 mx-auto shadow-2xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-[20px] font-bold text-[#1a1a1a]">Authentication Notice</h2>
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 leading-relaxed">
                {error}
              </p>
            </div>
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#303030] transition shadow-xs cursor-pointer"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <div className="space-y-5 py-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mx-auto shadow-2xs">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-amber-700 uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ADMINISTRATOR VERIFICATION</span>
              </div>
              <p className="text-sm font-medium text-slate-700">{status}</p>
            </div>
          </div>
        )}
      </div>

      {/* Clean Bottom Copyright */}
      <div className="w-full text-center pb-6 pt-8 text-[12px] text-slate-500 font-mono">
        Merchant Administration Portal
      </div>
    </div>
  );
}
