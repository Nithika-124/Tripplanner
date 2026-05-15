import { Outlet, Link, useNavigate, useLocation } from "react-router";
import {
  Plane,
  Home,
  Map,
  User,
  LogOut,
  Bell,
  Search,
  Plus,
  Settings,
  ChevronDown,
  Menu,
  X,
  Globe,
  Compass,
  Calendar,
  Bookmark,
  HelpCircle,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { NewTripModal } from "./NewTripModal";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Home, exact: true },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/my-trips", label: "My Trips", icon: Map },
  { to: "/calendar", label: "Calendar", icon: Calendar },
];

const notifications = [
  {
    id: 1,
    icon: "✈️",
    title: "Paris trip confirmed!",
    desc: "Your booking for Jun 15 is confirmed.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    icon: "🗺️",
    title: "New destination added",
    desc: "Santorini added to your bucket list.",
    time: "1d ago",
    unread: true,
  },
  {
    id: 3,
    icon: "⭐",
    title: "Rate your Venice trip",
    desc: "How was your recent adventure?",
    time: "3d ago",
    unread: false,
  },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* ── Top Navigation Bar ── */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-xl shadow-md">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                TripPlanner
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              {navLinks.map(({ to, label, icon: Icon, exact }) => {
                const active = isActive(to, exact);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      active
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-blue-50 -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-2 ml-auto">

              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setProfileOpen(false);
                  }}
                  className="relative p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <span className="font-semibold text-gray-800">Notifications</span>
                        <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                          Mark all read
                        </span>
                      </div>
                      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                              n.unread ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <span className="text-xl mt-0.5">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{n.desc}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                            </div>
                            {n.unread && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                        <button className="text-xs text-blue-600 hover:underline">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Plan New Trip CTA — desktop */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsNewTripModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                <Plus className="w-4 h-4" />
                New Trip
              </motion.button>

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => {
                    setProfileOpen((v) => !v);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-gray-800 leading-none">Alex Rivera</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Pro Member</p>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 hidden md:block transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      {/* Profile Header */}
                      <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow">
                            <span className="text-white font-bold">A</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Alex Rivera</p>
                            <p className="text-xs text-gray-500">alex@email.com</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-bold rounded-full">
                            PRO
                          </span>
                          <span className="text-xs text-gray-500">16 trips · 12 countries</span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1.5">
                        {[
                          { icon: User, label: "My Profile" },
                          { icon: Map, label: "My Trips" },
                          { icon: Bookmark, label: "Saved Places" },
                          { icon: Settings, label: "Settings" },
                          { icon: HelpCircle, label: "Help & Support" },
                        ].map(({ icon: Icon, label }) => (
                          <button
                            key={label}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 py-1.5">
                        <button
                          onClick={() => navigate("/")}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <nav className="px-4 py-3 space-y-1">
                {navLinks.map(({ to, label, icon: Icon, exact }) => {
                  const active = isActive(to, exact);
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    setIsNewTripModalOpen(true);
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Plan New Trip
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main Content ── */}
      <main className="min-h-[calc(100vh-64px)]">
        <Outlet context={{ openNewTripModal: () => setIsNewTripModalOpen(true) }} />
      </main>

      {/* New Trip Modal */}
      <NewTripModal 
        isOpen={isNewTripModalOpen} 
        onClose={() => setIsNewTripModalOpen(false)} 
      />
    </div>
  );
}