import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthChange = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // User logged in via magic link, redirect them
        router.push("/");
      }
    };

    handleAuthChange();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.push("/");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  const resetMessages = () => {
    setMessage(null);
    setError(null);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Supabase usually sends a confirmation email
    setMessage(
      "Signup successful! Check your email to confirm your account before logging in.",
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Logged in! (For now this is just a test message.)");
  };

  const handleMagicLink = async () => {
    resetMessages();
    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    setLoading(true);

    const redirectUrl = `${window.location.origin}/auth`;

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Magic link sent! Check your email to log in.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "12px",
          padding: "32px 28px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ margin: 0, marginBottom: "8px", fontSize: "24px" }}>
          Drizzl Account
        </h1>
        <p style={{ marginTop: 0, marginBottom: "24px", color: "#555" }}>
          {mode === "login"
            ? "Log in to your Drizzl dashboard."
            : "Create your Drizzl account."}
        </p>

        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            borderRadius: "999px",
            background: "#f0f0f0",
            padding: "4px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              resetMessages();
              setMode("login");
            }}
            style={{
              flex: 1,
              border: "none",
              borderRadius: "999px",
              padding: "8px 0",
              cursor: "pointer",
              background: mode === "login" ? "#111" : "transparent",
              color: mode === "login" ? "white" : "#333",
              fontWeight: 500,
            }}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => {
              resetMessages();
              setMode("signup");
            }}
            style={{
              flex: 1,
              border: "none",
              borderRadius: "999px",
              padding: "8px 0",
              cursor: "pointer",
              background: mode === "signup" ? "#111" : "transparent",
              color: mode === "signup" ? "white" : "#333",
              fontWeight: 500,
            }}
          >
            Sign up
          </button>
        </div>

        <form
          onSubmit={mode === "login" ? handleLogin : handleSignup}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "14px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "14px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={mode === "signup" || mode === "login"}
              placeholder="••••••••"
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "4px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#111",
              color: "white",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "18px 0 10px",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#eee" }} />
          <span style={{ fontSize: "12px", color: "#888" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#eee" }} />
        </div>

        {/* Magic link button */}
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "white",
            cursor: loading ? "default" : "pointer",
            fontSize: "14px",
          }}
        >
          Send me a magic login link
        </button>

        {/* Messages */}
        {message && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "#e6ffed",
              color: "#126b34",
              fontSize: "13px",
            }}
          >
            {message}
          </div>
        )}
        {error && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "#ffe6e6",
              color: "#a11a1a",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <p style={{ marginTop: "18px", fontSize: "12px", color: "#888" }}>
          Magic link + password auth powered by Supabase.
        </p>
      </div>
    </div>
  );
}
