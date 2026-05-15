import { motion } from "framer-motion";
import { Plus, MapPin, Calendar, Users, TrendingUp, Clock,
  DollarSign, Plane, ArrowRight, Star, CheckCircle,
  Globe, BarChart3, Target
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

const upcomingTrips = [
  {
    id: "1",
    name: "Summer in Paris",
    destination: "Paris, France",
    image: "https://images.unsplash.com/photo-1687858349767-fec548333fa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    dates: "Jun 15 - Jun 22, 2026",
    daysLeft: 42,
    travelers: 2,
    budget: 3000,
    spent: 450,
    status: "confirmed",
    activities: 12,
    progress: 85,
  },
  {
    id: "2",
    name: "London Adventure",
    destination: "London, UK",
    image: "https://images.unsplash.com/photo-1775582854287-83568dbc9c8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    dates: "Aug 10 - Aug 17, 2026",
    daysLeft: 98,
    travelers: 4,
    budget: 5000,
    spent: 200,
    status: "planning",
    activities: 8,
    progress: 45,
  },
];

const pastTrips = [
  {
    id: "3",
    name: "Venice Getaway",
    destination: "Venice, Italy",
    image: "https://images.unsplash.com/photo-1767564272518-875ef88de331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    dates: "Mar 5 - Mar 10, 2026",
    travelers: 2,
    rating: 5,
  },
  {
    id: "4",
    name: "Singapore Exploration",
    destination: "Singapore",
    image: "https://images.unsplash.com/photo-1768557410710-01f506326bf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    dates: "Jan 12 - Jan 18, 2026",
    travelers: 3,
    rating: 4,
  },
  {
    id: "5",
    name: "Kyoto in Spring",
    destination: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=280&fit=crop&auto=format",
    dates: "Apr 1 – Apr 7, 2025",
    rating: 5,
  },
  {
    id: "6",
    name: "Santorini Escape",
    destination: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=280&fit=crop&auto=format",
    dates: "Sep 14 – Sep 20, 2025",
    rating: 5,
  },
];

const quickActions = [
  {
    title: "Plan New Trip",
    description: "Start planning your next adventure",
    icon: Plus,
    color: "from-blue-500 to-cyan-500",
    action: "/new-trip",
  },
  {
    title: "Explore Destinations",
    description: "Discover amazing places",
    icon: Globe,
    color: "from-indigo-500 to-purple-500",
    action: "/explore",
  },
  {
    title: "Travel Insights",
    description: "View your travel statistics",
    icon: BarChart3,
    color: "from-cyan-500 to-blue-500",
    action: "/insights",
  },
  {
    title: "Bucket List",
    description: "Manage your dream destinations",
    icon: Target,
    color: "from-purple-500 to-indigo-600",
    action: "/bucket-list",
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { openNewTripModal } = useOutletContext() || {};
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-[calc(100vh-73px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Personalized Header */}
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
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Plane className="w-8 h-8" />
                </motion.div>
                <span className="text-xl opacity-90">{greeting}, Traveler!</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Travel Dashboard
              </h1>

              <p className="text-xl text-blue-100 max-w-2xl mb-8">
                You have <span className="font-bold text-white">{upcomingTrips.length} upcoming trips</span> and
                <span className="font-bold text-white"> {upcomingTrips[0].daysLeft} days</span> until your next adventure!
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openNewTripModal ? openNewTripModal() : navigate("/new-trip")}
                  className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Plan New Trip
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/calendar")}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-semibold flex items-center gap-2"
                >
                  View Calendar
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">16</div>
            <div className="text-gray-600 font-medium mb-1">Total Trips</div>
            <div className="text-xs text-gray-500">+3 this year</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">12</div>
            <div className="text-gray-600 font-medium mb-1">Countries</div>
            <div className="text-xs text-gray-500">4 continents</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">42d</div>
            <div className="text-gray-600 font-medium mb-1">Next Trip</div>
            <div className="text-xs text-gray-500">Paris, France</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">$12.5k</div>
            <div className="text-gray-600 font-medium mb-1">Total Spent</div>
            <div className="text-xs text-gray-500">This year</div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Upcoming Trips */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Upcoming Trips
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                View All
              </button>
            </div>

            <div className="space-y-6">
              {upcomingTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  onClick={() => navigate(`/app/trips/${trip.id}`)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                      <img
                        src={trip.image}
                        alt={trip.destination}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          trip.status === "confirmed"
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-500 text-white"
                        }`}>
                          {trip.status === "confirmed" ? "✓ Confirmed" : "Planning"}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                        <div className="text-xs text-gray-600">Days left</div>
                        <div className="text-xl font-bold text-blue-600">{trip.daysLeft}</div>
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">{trip.name}</h3>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{trip.destination}</span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                        >
                          <ArrowRight className="w-5 h-5 text-blue-600" />
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Dates</div>
                          <div className="text-sm font-semibold text-gray-800">{trip.dates}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Travelers</div>
                          <div className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {trip.travelers}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Activities</div>
                          <div className="text-sm font-semibold text-gray-800">{trip.activities} planned</div>
                        </div>
                      </div>

                      {/* Budget Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-600">Budget</span>
                          <span className="font-semibold text-gray-800">
                            ${trip.spent} / ${trip.budget}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                            style={{ width: `${(trip.spent / trip.budget) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Trip Progress */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-600">Trip Planning</span>
                          <span className="font-semibold text-gray-800">{trip.progress}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                            style={{ width: `${trip.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (action.action === "/new-trip" && openNewTripModal) {
                        openNewTripModal();
                      } else if (action.action) {
                        navigate(action.action);
                      }
                    }}
                    className="w-full bg-white rounded-xl shadow-lg p-4 flex items-center gap-4 hover:shadow-xl transition-shadow text-left"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Travel Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                2026 Travel Goals
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Visit 5 Countries</span>
                    <span className="text-sm font-bold">3/5</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Plan 8 Trips</span>
                    <span className="text-sm font-bold">6/8</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
                <div className="flex items-center gap-3 p-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">Added 3 activities</p>
                    <p className="text-xs text-gray-500">Paris</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">2h ago</span>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">Updated dates</p>
                    <p className="text-xs text-gray-500">London</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">1d ago</span>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">Invited 2 travelers</p>
                    <p className="text-xs text-gray-500">Venice</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">3d ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Past Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Past Adventures
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/app/trips/${trip.id}`)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
              >
                <div className="relative h-40">
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-800">{trip.rating}.0</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1">{trip.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{trip.destination}</p>
                  <p className="text-xs text-gray-500">{trip.dates}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}