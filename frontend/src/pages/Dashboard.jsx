import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plane,
  ArrowRight,
  Star,
  CheckCircle,
  Globe,
  BarChart3,
  Target,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export function Dashboard() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

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

  const formatDate = (date) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysLeft = (date) => {
    if (!date) return 0;
    const today = new Date();
    const tripDate = new Date(date);
    const diff = tripDate - today;
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  const getLocation = (trip) => {
    if (!trip.destinations || trip.destinations.length === 0) return "Destination not set";
    const first = trip.destinations[0];
    if (typeof first === "string") return first;
    return [first.city, first.country].filter(Boolean).join(", ") || first.name || "Destination";
  };

  const getImage = () =>
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=600&fit=crop&auto=format";

  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
  const upcomingTrips = trips.filter((trip) => getDaysLeft(trip.startDate) >= 0);
  const completedTrips = trips.filter((trip) => trip.status === "completed");

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="min-h-[calc(100vh-73px)] py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-8 h-8" />
                <span className="text-xl opacity-90">{greeting}, Traveler!</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to TripPlanner
              </h1>

              <p className="text-blue-100 text-lg max-w-2xl">
                You have no trips yet. Create your first adventure or let AI build a smart travel plan for you.
              </p>
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <span className="text-6xl">🧳</span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                No trips yet
              </h2>

              <p className="text-slate-500 max-w-md mb-8">
                Start planning your first journey by creating a custom trip with destinations, dates, budget, and preferences.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick= {() => navigate("/ai-planner")}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg hover:shadow-xl transition"
                >
                  + Create AI Trip
                </button>

                <button
                  onClick={() => navigate("/ai-planner")}
                  className="px-6 py-3 rounded-xl border border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition"
                >
                  ✨ Try AI Planner
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Popular Destinations
                </h3>
                <button
                  onClick={() => navigate("/explore")}
                  className="text-blue-600 font-semibold text-sm"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Paris, France", "4.9", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500"],
                  ["Bali, Indonesia", "4.8", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500"],
                  ["Tokyo, Japan", "4.9", "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500"],
                  ["Santorini, Greece", "5.0", "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500"],
                ].map(([name, rating, image]) => (
                  <div
                    key={name}
                    className="rounded-2xl overflow-hidden bg-slate-50 shadow-sm"
                  >
                    <img
                      src={image}
                      alt={name}
                      className="h-32 w-full object-cover"
                    />
                    <div className="p-3">
                      <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
                      <p className="text-xs text-amber-500 font-bold">⭐ {rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Let AI plan your perfect trip
                </h3>
                <p className="text-slate-500 text-sm">
                  Answer a few questions and TripPlanner will generate an itinerary for you.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/ai-planner")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold"
            >
              Get Started
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-8 h-8" />
                <span className="text-xl opacity-90">{greeting}, Traveler!</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Travel Dashboard
              </h1>

              <p className="text-xl text-blue-100 max-w-2xl mb-8">
                You have{" "}
                <span className="font-bold text-white">
                  {upcomingTrips.length} upcoming trips
                </span>{" "}
                and{" "}
                <span className="font-bold text-white">
                  {getDaysLeft(upcomingTrips[0]?.startDate)} days
                </span>{" "}
                until your next adventure!
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/ai-planner")}
                  className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Plan New Trip
                </button>

                <button
                  onClick={() => navigate("/calendar")}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-semibold"
                >
                  View Calendar
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <StatCard icon={MapPin} value={trips.length} label="Total Trips" sub="+ this year" color="blue" />
          <StatCard icon={Globe} value={new Set(trips.map(getLocation)).size} label="Places" sub="visited/planned" color="cyan" />
          <StatCard icon={Calendar} value={upcomingTrips.length} label="Upcoming" sub="planned trips" color="indigo" />
          <StatCard icon={DollarSign} value={`$${totalBudget.toLocaleString()}`} label="Total Budget" sub="all trips" color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Upcoming Trips
              </h2>

              <button
                onClick={() => navigate("/my-trips")}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                View All
              </button>
            </div>

            <div className="space-y-6">
              {upcomingTrips.slice(0, 3).map((trip, index) => (
                <motion.div
                  key={trip._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-54 h-48 md:h-auto">
                      <img
                        src={getImage()}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                        <div className="text-xs text-gray-600">Days left</div>
                        <div className="text-xl font-bold text-blue-600">
                          {getDaysLeft(trip.startDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">
                            {trip.title || "Untitled Trip"}
                          </h3>

                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{getLocation(trip)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate("/my-trips")}
                          className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                        >
                          <ArrowRight className="w-5 h-5 text-blue-600" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <Info label="Dates" value={`${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`} />
                        <Info label="Budget" value={`$${trip.budget || 0}`} />
                        <Info label="Status" value={trip.status || "planned"} />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-600">Trip Planning</span>
                          <span className="font-semibold text-gray-800">
                            {trip.progress || 0}% Complete
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            style={{ width: `${trip.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-2">
                <QuickAction title="Trip Calendar" desc="View your upcoming trips and travel schedule" icon={Calendar} onClick={() => navigate("/calendar")} />
                <QuickAction title="Explore Destinations" desc="Discover amazing places" icon={Globe} onClick={() => navigate("/explore")} />
                <QuickAction title="My Trips" desc="Manage your itineraries, progress, and travel history." icon={BarChart3} onClick={() => navigate("/my-trips")} />
                <QuickAction title="Try AI Planner" desc="Generate a smart itinerary" icon={Sparkles} onClick={() => navigate("/ai-planner")} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Travel Goals
              </h3>

              <div className="space-y-4">
                <Goal label="Plan 5 Trips" value={`${Math.min(trips.length, 5)}/5`} width={`${Math.min((trips.length / 5) * 100, 100)}%`} />
                <Goal label="Complete 3 Trips" value={`${completedTrips.length}/3`} width={`${Math.min((completedTrips.length / 3) * 100, 100)}%`} />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Recent Activity
              </h3>

              <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
                {trips.slice(0, 3).map((trip) => (
                  <div key={trip._id} className="flex items-center gap-3 p-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        Trip created
                      </p>
                      <p className="text-xs text-gray-500">{trip.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {completedTrips.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Past Adventures
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {completedTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <img src={getImage()} alt={trip.title} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800">{trip.title}</h3>
                    <p className="text-sm text-gray-600">{getLocation(trip)}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">
              Popular Destinations
            </h3>
            <button
              onClick={() => navigate("/explore")}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Paris, France", "4.9", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500"],
              ["Bali, Indonesia", "4.8", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500"],
              ["Tokyo, Japan", "4.9", "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500"],
              ["Santorini, Greece", "5.0", "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500"],
            ].map(([name, rating, image]) => (
              <div
                key={name}
                className="group relative h-72 overflow-hidden rounded-3xl cursor-pointer"
              >
                <img
                  src={image}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                  ⭐ {rating}
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-bold text-lg">{name}</h4>
                  <p className="text-sm text-white/80">
                    Explore amazing experiences
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, sub, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    cyan: "bg-cyan-100 text-cyan-600",
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-gray-600 font-medium mb-1">{label}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

function QuickAction({ title, desc, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-lg p-4 flex items-center gap-4 hover:shadow-xl transition text-left"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1">
        <div className="font-semibold text-gray-800">{title}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>

      <ArrowRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}

function Goal({ label, value, width }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-bold">{value}</span>
      </div>

      <div className="w-full bg-white/20 rounded-full h-2">
        <div className="bg-white h-2 rounded-full" style={{ width }} />
      </div>
    </div>
  );
}