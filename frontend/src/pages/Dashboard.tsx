import { useEffect, useState } from "react";
import { getDashboardData, type DashboardData } from "../api/dashboard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const [data, setData] = useState<DashboardData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const currentMonth = new Date().getMonth() + 1;
  const startWeekDayOfMonth = new Date(year, currentMonth - 1, 1).getDay();
  const daysInMonth = new Date(year, currentMonth, 0).getDate();
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];



  const currentMonthDates = data?.entries_last_30_days.filter(d => d.startsWith(`${year}-${month}`));



  if (!data) return <div>Loading...</div>;

  return (<div className="min-h-screen bg-frost flex flex-col items-center pt-16 px-4">
  
  {/* Streak card */}
  <div className="bg-mint rounded-2xl shadow-lg p-10 flex flex-col items-center mb-8 w-full max-w-sm">
    <div>
      <p className="text-plum text-sm font-medium uppercase tracking-widest mb-2">Current Streak</p>
      <p className="text-8xl font-bold text-plum">{data.streak}</p>
      <p className="text-plum text-sm mt-2">{data.streak === 1 ? 'day' : 'days'}</p>
    </div>
    <div className="grid grid-cols-7 gap-1 mt-6 text-xs text-center text-plum font-semibold">
        {weekDays.map((day, i) => (
          <div key={i}>{day}</div>
        ))}
        {Array.from({ length: startWeekDayOfMonth === 0 ? 6 : startWeekDayOfMonth - 1 }).map((_, i) => (
        <div key={`empty-${i}`} />
      ))}
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateStr = `${year}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const logged = currentMonthDates?.includes(dateStr);
        return (
          <div key={day} className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs ${logged ? 'bg-teal text-white' : 'bg-steel text-plum'}`}>
            {day}
          </div>
        );
      })}   
    </div>
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