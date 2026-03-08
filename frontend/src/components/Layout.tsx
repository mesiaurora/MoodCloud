import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Settings } from 'lucide-react';

export default function Layout() {
  
const { isAuthenticated, logout, user } = useAuth();

const { pathname } = useLocation();
const navigate = useNavigate();


  return (
  <>
    <nav className="bg-plum flex items-center justify-between px-6 py-3">  ¨
      {/* Left */}
      <div className="flex-1 flex justify-start">
        <h1 onClick={() => navigate('/')} className="text-lavender font-bold text-xl cursor-pointer">MoodCloud</h1>
        <span className="text-lavender text-sm ml-2">Hello {user?.username}!</span>
      </div>

     {/* Center */}
     <div className="flex-1 flex justify-center">
      <div className="flex items-center gap-8 font-medium">
      {isAuthenticated && (
          <div className="flex items-center gap-6">
            <Link to="/" className={pathname === '/' ? 'hidden' : 'text-lavender hover:text-frost text-sm'}>Dashboard</Link>
            <Link to="/logentry" className={pathname === '/logentry' ? 'hidden' : 'text-lavender hover:text-frost text-sm'}>Log an Entry</Link>
            <Link to="/analysis" className={pathname === '/analysis' ? 'hidden' : 'text-lavender hover:text-frost text-sm'}>Analysis</Link>
            <Link to="/history" className={pathname === '/history' ? 'hidden' : 'text-lavender hover:text-frost text-sm'}>Log history</Link>
          </div>)}
     </div>


      {/* Right */}
      <div className="flex-1 flex justify-end items-center gap-2">
        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <Link to="/settings"><Settings size={20} className="text-lavender hover:text-frost" /></Link>
            <button onClick={logout} className="bg-darklavender text-mist rounded-lg px-3 py-1 text-sm font-medium hover:opacity-90">Logout</button>
          </div>)}
        </div>
        </div>
    </nav>
    <Outlet />
  </>
  )
}