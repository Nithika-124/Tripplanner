import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon, Clock, MapPin, Bell,
  ChevronLeft, ChevronRight, Check, AlertTriangle
} from "lucide-react";

const events = [
  { id: 1, day: 15, time: "08:30", title: "Flight to Paris", location: "Colombo Airport", type: "Transport", color: "bg-blue-500" },
  { id: 2, day: 15, time: "15:00", title: "Hotel check-in", location: "Le Marais Hotel", type: "Hotel", color: "bg-purple-500" },
  { id: 3, day: 16, time: "09:00", title: "Eiffel Tower visit", location: "Champ de Mars", type: "Activity", color: "bg-cyan-500" },
  { id: 4, day: 16, time: "13:30", title: "Louvre Museum", location: "Rue de Rivoli", type: "Activity", color: "bg-emerald-500" },
  { id: 5, day: 18, time: "19:30", title: "Dinner reservation", location: "Le Jules Verne", type: "Food", color: "bg-rose-500" },
  { id: 6, day: 20, time: "10:00", title: "Versailles day trip", location: "Palace of Versailles", type: "Trip", color: "bg-amber-500" },
];

const reminders = [
  { title: "Leave hotel 30 minutes early", time: "Tomorrow, 8:00 AM", icon: AlertTriangle },
  { title: "Check Louvre ticket QR code", time: "Jun 16, 12:30 PM", icon: Check },
  { title: "Taxi pickup confirmation", time: "Jun 20, 9:15 AM", icon: Bell },
];

const categories = ["All", "Transport", "Hotel", "Activity", "Food", "Trip"];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function Calendar() {
  const [selectedDay, setSelectedDay] = useState(15);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const resetToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Calendar Logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const startOffset = (firstDayOfMonth + 6) % 7; // Adjust for Monday start

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) for (let i = 0; i < remaining; i++) days.push(null);
    return days;
  }, [startOffset, daysInMonth]);

  const filteredEvents = useMemo(() => {
    const isCurrentMonthJune2026 = currentDate.getMonth() === 5 && currentDate.getFullYear() === 2026;
    if (!isCurrentMonthJune2026) return [];
    
    return events.filter((e) => {
      const matchDay = e.day === selectedDay;
      const matchCat = activeCategory === "All" || e.type === activeCategory;
      return matchDay && matchCat;
    });
  }, [selectedDay, activeCategory, currentDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 font-sans text-slate-800">



      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Calendar Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Schedule</p>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{currentMonthName} {currentYear}</h2>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={resetToToday} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg">Today</button>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
              {weekDays.map(d => <div key={d} className="p-2 text-center text-xs font-bold text-slate-400">{d}</div>)}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => {
                const isCurrentMonthJune2026 = currentDate.getMonth() === 5 && currentDate.getFullYear() === 2026;
                const dayEvents = isCurrentMonthJune2026 ? events.filter(e => e.day === day) : [];
                const isSelected = selectedDay === day;
                const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <button
                    key={i}
                    onClick={() => day && setSelectedDay(day)}
                    disabled={!day}
                    className={`group relative aspect-square p-1.5 md:p-2 border-t border-r border-slate-100/50 transition-all duration-150 text-left
                      ${!day ? "bg-slate-50/40 cursor-default" : isSelected ? "bg-blue-50 z-10 ring-inset ring-1 ring-blue-200" : "bg-white hover:bg-slate-50"}`}
                  >
                    {day && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className={`flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full text-[11px] md:text-xs font-bold transition-all
                            ${isToday ? "bg-blue-600 text-white shadow-sm" : isSelected ? "bg-blue-100 text-blue-700" : "text-slate-500 group-hover:text-slate-800"}`}>
                            {day}
                          </span>
                        </div>
                        <div className="mt-0.5 md:mt-1 space-y-0.5 hidden md:block">
                          {dayEvents.slice(0, 2).map(event => (
                            <div key={event.id} className="flex items-center gap-1">
                              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${event.color}`} />
                              <span className="text-[10px] font-medium text-slate-600 truncate">{event.title}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Agenda */}
        <div className="space-y-6">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-200/80"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Selected</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{currentMonthName} {selectedDay}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition"
                  >
                    <div className={`w-1 h-full min-h-[40px] rounded-full ${event.color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{event.type}</span>
                        <span className="text-xs font-bold text-slate-500">{event.time}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 mt-0.5">{event.title}</h4>
                      <div className="flex items-center gap-1 mt-1 text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs">{event.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">No events planned</p>
                </div>
              )}
            </div>
          </motion.div>

          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-[1.5rem] p-5 shadow-sm text-white">
            <h3 className="text-sm font-bold mb-3">Quick Filters</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${activeCategory === cat ? "bg-white text-blue-600 shadow-sm" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <h3 className="text-sm font-bold mb-3">Reminders</h3>
              <div className="space-y-2">
                {reminders.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition">
                      <r.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="text-xs text-blue-100">{r.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}