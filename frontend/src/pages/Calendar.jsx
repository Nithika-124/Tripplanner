import { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Plane,
  Hotel,
  MapPin,
  Clock,
  Sparkles,
  Utensils,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function Calendar() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await API.get("/trips/my-trips");
      setTrips(res.data || []);
    } catch (error) {
      console.log(error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const monthName = currentDate.toLocaleString("en-US", { month: "long" });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = (firstDay + 6) % 7;

  const calendarDays = useMemo(() => {
    const days = [];

    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  }, [startOffset, daysInMonth]);

  const events = useMemo(() => {
    const list = [];

    trips.forEach((trip) => {
      if (trip.startDate) {
        const start = new Date(trip.startDate);

        list.push({
          id: `${trip._id}-start`,
          day: start.getDate(),
          month: start.getMonth(),
          year: start.getFullYear(),
          time: "08:30 AM",
          title: `${trip.title || "Trip"} starts`,
          location: getLocation(trip),
          type: "Transport",
          icon: Plane,
        });
      }

      // Add daily plan events if available
      if (trip.dailyPlan && Array.isArray(trip.dailyPlan)) {
        trip.dailyPlan.forEach((day) => {
          if (trip.startDate) {
            const startDate = new Date(trip.startDate);
            const dayDate = new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate() + (day.day - 1)
            );

            // Add hotel suggestion event
            if (day.hotelSuggestion && day.hotelSuggestion.name) {
              list.push({
                id: `${trip._id}-day${day.day}-hotel`,
                day: dayDate.getDate(),
                month: dayDate.getMonth(),
                year: dayDate.getFullYear(),
                time: "15:00",
                title: `Check-in: ${day.hotelSuggestion.name}`,
                location: day.hotelSuggestion.area || getLocation(trip),
                type: "Hotel",
                icon: Hotel,
              });
            }

            // Add activity events
            if (day.activities && Array.isArray(day.activities)) {
              day.activities.forEach((activity, idx) => {
                list.push({
                  id: `${trip._id}-day${day.day}-activity${idx}`,
                  day: dayDate.getDate(),
                  month: dayDate.getMonth(),
                  year: dayDate.getFullYear(),
                  time: activity.time || "10:00 AM",
                  title: activity.place,
                  location: activity.activity || getLocation(trip),
                  type: "Activity",
                  icon: MapPin,
                  cost: activity.cost,
                });
              });
            }
          }
        });
      }

      if (trip.endDate) {
        const end = new Date(trip.endDate);

        list.push({
          id: `${trip._id}-end`,
          day: end.getDate(),
          month: end.getMonth(),
          year: end.getFullYear(),
          time: "07:00 PM",
          title: `${trip.title || "Trip"} ends`,
          location: getLocation(trip),
          type: "Trip",
          icon: MapPin,
        });
      }
    });

    return list;
  }, [trips]);

  const selectedEvents = events.filter(
    (event) =>
      event.day === selectedDay &&
      event.month === month &&
      event.year === year
  );

  const monthEvents = events.filter(
    (event) => event.month === month && event.year === year
  );

  const hasEvent = (day) => {
    // Check if any event exists on this day
    const hasDirectEvent = events.some(
      (event) =>
        event.day === day && event.month === month && event.year === year
    );

    // Check if day is within any trip's date range
    const isInTripRange = trips.some((trip) => {
      if (!trip.startDate || !trip.endDate) return false;
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const checkDate = new Date(year, month, day);

      return checkDate >= start && checkDate <= end;
    });

    return hasDirectEvent || isInTripRange;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-50">
        <p className="text-blue-600 font-bold">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Calendar</h1>
          <p className="text-slate-500 mt-1">
            Your travel schedule and plans
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* Calendar Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-slate-900">
                {monthName} {year}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const today = new Date();
                    setCurrentDate(today);
                    setSelectedDay(today.getDate());
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-bold"
                >
                  Today
                </button>

                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl hover:bg-slate-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-3">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-bold text-slate-400"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                // Check if this day is in a trip range
                const inTripRange = day && trips.some((trip) => {
                  if (!trip.startDate || !trip.endDate) return false;
                  const start = new Date(trip.startDate);
                  const end = new Date(trip.endDate);
                  const checkDate = new Date(year, month, day);
                  return checkDate >= start && checkDate <= end;
                });

                const isStartOrEnd = day && trips.some((trip) => {
                  if (!trip.startDate || !trip.endDate) return false;
                  const start = new Date(trip.startDate);
                  const end = new Date(trip.endDate);
                  return (start.getDate() === day && start.getMonth() === month && start.getFullYear() === year) ||
                         (end.getDate() === day && end.getMonth() === month && end.getFullYear() === year);
                });

                return (
                  <button
                    key={index}
                    disabled={!day}
                    onClick={() => setSelectedDay(day)}
                    className={`relative h-16 rounded-2xl text-sm font-bold transition ${
                      !day
                        ? "opacity-0"
                        : selectedDay === day
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : inTripRange
                        ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
                        : "hover:bg-blue-50 text-slate-700"
                    }`}
                  >
                    {day}

                    {day && hasEvent(day) && selectedDay !== day && (
                      <span
                        className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                          inTripRange ? "bg-blue-600" : "bg-blue-500"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 min-h-[420px]">
            {trips.length === 0 ? (
              <EmptyCalendar navigate={navigate} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase text-blue-600">
                      Selected
                    </p>
                    <h2 className="text-3xl font-black text-slate-900">
                      {monthName} {selectedDay}
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                {selectedEvents.length === 0 ? (
                  <div className="h-72 flex flex-col items-center justify-center text-center">
                    <CalendarIcon className="w-16 h-16 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">
                      No events today
                    </h3>
                    <p className="text-slate-500 text-sm mt-2">
                      Select another date or create a new trip.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {trips.length > 0 && (
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mt-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-slate-900">
                  Upcoming Events
                </h2>
                <button className="text-blue-600 text-sm font-bold">
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {monthEvents.slice(0, 4).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex flex-col items-center justify-center text-blue-600">
                      <span className="text-xs font-bold">
                        {monthName.slice(0, 3)}
                      </span>
                      <span className="text-sm font-black">{event.day}</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-500">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-black text-slate-900 mb-5">
                Quick Stats
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-blue-50 p-5 text-center">
                  <p className="text-3xl font-black text-blue-600">
                    {monthEvents.length}
                  </p>
                  <p className="text-sm text-slate-500">Events</p>
                </div>

                <div className="rounded-2xl bg-cyan-50 p-5 text-center">
                  <p className="text-3xl font-black text-cyan-600">
                    {trips.length}
                  </p>
                  <p className="text-sm text-slate-500">Trips</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const Icon = event.icon || Plane;

  // Color coding based on event type
  const getTypeColor = (type) => {
    switch (type) {
      case "Hotel":
        return { bg: "bg-purple-100", text: "text-purple-600", icon: "text-purple-600" };
      case "Activity":
        return { bg: "bg-orange-100", text: "text-orange-600", icon: "text-orange-600" };
      case "Food":
        return { bg: "bg-amber-100", text: "text-amber-600", icon: "text-amber-600" };
      case "Transport":
        return { bg: "bg-green-100", text: "text-green-600", icon: "text-green-600" };
      default:
        return { bg: "bg-blue-100", text: "text-blue-600", icon: "text-blue-600" };
    }
  };

  const colors = getTypeColor(event.type);

  return (
    <div className={`rounded-2xl border border-slate-100 ${colors.bg} p-4`}>
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between gap-3">
            <div>
              <p className={`text-xs font-bold uppercase ${colors.text}`}>
                {event.type}
              </p>
              <h3 className="font-black text-slate-900">{event.title}</h3>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 block">
                {event.time}
              </span>
              {event.cost && (
                <span className={`text-sm font-bold ${colors.text} block mt-1`}>
                  ${event.cost}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-600 mt-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {event.location}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyCalendar({ navigate }) {
  return (
    <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center mb-6">
        <CalendarIcon className="w-12 h-12 text-blue-300" />
      </div>

      <h2 className="text-2xl font-black text-slate-900">
        No events yet
      </h2>

      <p className="text-slate-500 max-w-xs mt-3 mb-6">
        Create a trip to see your itinerary and travel events here.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/ai-planner")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create AI Trip
        </button>

        <button
          onClick={() => navigate("/ai-planner")}
          className="px-6 py-3 rounded-xl border border-blue-200 text-blue-600 font-bold flex items-center gap-2 justify-center"
        >
          <Sparkles className="w-5 h-5" />
          Try AI Planner
        </button>
      </div>
    </div>
  );
}

function getLocation(trip) {
  if (!trip.destinations || trip.destinations.length === 0) return "Location TBD";

  const first = trip.destinations[0];

  if (typeof first === "string") return first;

  return (
    [first.city, first.country].filter(Boolean).join(", ") ||
    first.name ||
    "Location TBD"
  );
}