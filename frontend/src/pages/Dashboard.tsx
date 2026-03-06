import { useEffect, useState } from "react";
import { getDashboardData, type DashboardData } from "../api/dashboard";

export default function Dashboard() {

  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (<div className="min-h-screen bg-frost flex flex-col items-center pt-16 px-4">
  
  {/* Streak hero card */}
  <div className="bg-mint rounded-2xl shadow-lg p-10 flex flex-col items-center mb-8 w-full max-w-sm">
    <p className="text-plum text-sm font-medium uppercase tracking-widest mb-2">Current Streak</p>
    <p className="text-8xl font-bold text-plum">{data.streak}</p>
    <p className="text-plum text-sm mt-2">{data.streak === 1 ? 'day' : 'days'}</p>
  </div>

  {/* Log entry card */}
  <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center mb-4 w-full max-w-sm">
    <p className="text-plum font-medium mb-4">Ready to log?</p>
    <button className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full">
      Log an Entry
    </button>
  </div>

  {/* Analysis card */}
  <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center w-full max-w-sm">
    <p className="text-plum font-medium mb-4">Analyse your data</p>
    {data.has_entries_last_7_days 
      ? <button className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full mb-2">Analyse this week</button>
      : <p className="text-plum text-sm text-center">No entries this week yet.</p>
    }
    {data.has_entries_last_30_days 
      ? <button className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full mt-2">Analyse this month</button>
      : <p className="text-plum text-sm text-center">No entries this month yet.</p>
    }
  </div>

</div>)
}