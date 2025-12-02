import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [status, setStatus] = useState("Connecting to Supabase...");

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("test").select("*").limit(1);

      if (error) {
        setStatus("❌ Supabase connected BUT no test table found yet.");
        console.error(error);
      } else {
        setStatus("✅ Supabase is LIVE and working!");
        console.log(data);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Drizzl Supabase Connection Test</h1>
      <p>{status}</p>
    </div>
  );
}
