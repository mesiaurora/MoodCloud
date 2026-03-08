import { useEffect, useState } from "react";
import { getDashboardData, type DashboardData } from "../api/dashboard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const [data, setData] = useState<DashboardData | null>(null);
  const navigate = useNavigate();

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
    <button onClick={() => navigate('/logentry')} className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full">
      Log an Entry
    </button>
  </div>

  {/* Analysis card */}
  <div className="bg-mint rounded-2xl shadow-lg p-6 flex flex-col items-center w-full max-w-sm">
    <p className="text-plum font-medium mb-4">Analyse your data</p>
  <button onClick={() => navigate('/analysis')} className="bg-plum text-lavender rounded-lg px-6 py-2 font-semibold hover:opacity-90 transition-opacity w-full mt-2">Analyse your data</button>
  </div>

</div>)
}