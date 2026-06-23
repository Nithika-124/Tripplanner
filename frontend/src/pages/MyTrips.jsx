import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  MoreVertical,
  Share2,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Plane,
  Hotel,
  Clock,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&h=600&fit=crop&auto=format";

const getLocation = (trip) => {
  if (!trip.destinations || trip.destinations.length === 0) return "Location TBD";

  const first = trip.destinations[0];

  if (typeof first === "string") return first;

  return (
    [first.city, first.country].filter(Boolean).join(", ") ||
    first.name ||
    "Location TBD"
  );
};

const formatDate = (date) => {
  if (!date) return "TBD";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "0 Days";

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  return `${Math.max(diff, 1)} Days`;
};

const getDaysUntil = (startDate, endDate) => {
  if (!startDate) return Number.MAX_SAFE_INTEGER;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = endDate ? new Date(endDate) : start;
  end.setHours(23, 59, 59, 999);

  // Trip already finished
  if (end < today) {
    return Number.MAX_SAFE_INTEGER;
  }

  // Trip is happening today
  if (start <= today && end >= today) {
    return 0;
  }

  // Upcoming trip
  return Math.ceil((start - today) / (1000 * 60 * 60 * 24));
};

const getTripStatus = (startDate, endDate, progress) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // Trip is happening now
  if (today >= start && today <= end) {
    return "ongoing";
  }

  // Trip has ended
  if (today > end) {
    // If completed (100% progress), mark as completed
    if (progress === 100) {
      return "completed";
    }
    // Otherwise mark as missed (incomplete past trip)
    return "missed";
  }

  // Trip hasn't started yet - still upcoming
  return "upcoming";
};

const getDaysLeftDisplay = (startDate, endDate, progress, status) => {
  if (status === "completed") {
    return "Finished";
  }

  if (status === "missed") {
    return "Missed";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = endDate ? new Date(endDate) : start;
  end.setHours(23, 59, 59, 999);

  // Happening today
  if (start <= today && end >= today) {
    return "0 days left";
  }

  // Calculate days until start
  const daysUntil = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
  return `${daysUntil} days left`;
};

const getTripStatus_OLD = (startDate, endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  if (today < start) {
    return "planned";
  }

  if (today >= start && today <= end) {
    return "ongoing";
  }

  return "completed";
};

const normalizeTrip = (trip) => {
  const progress = trip.progress || 0;
  const status = getTripStatus(trip.startDate, trip.endDate, progress);
  const daysLeftDisplay = getDaysLeftDisplay(trip.startDate, trip.endDate, progress, status);
  
  return {
    ...trip,
    id: trip._id,
    title: trip.title || "Untitled Trip",
    location: getLocation(trip),
    image: trip.image || fallbackImage,
    startDate: formatDate(trip.startDate),
    endDate: formatDate(trip.endDate),
    duration: getDuration(trip.startDate, trip.endDate),
    travelers: trip.travelers || 1,
    budget:
      typeof trip.budget === "number"
        ? `$${trip.budget.toLocaleString()}`
        : "$0",
    progress: progress,
    status: status,
    daysLeftDisplay: daysLeftDisplay,
    daysUntil: getDaysUntil(trip.startDate, trip.endDate),
    tasks: trip.tasks || [],
  };
};

export function MyTrips() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskStates, setTaskStates] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await API.get("/trips/my-trips");
      setTrips((res.data || []).map(normalizeTrip));
    } catch (error) {
      console.error(error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const nearestTrip = useMemo(() => {
    if (trips.length === 0) return null;

    const upcomingTrips = trips.filter(
      (trip) => trip.daysUntil !== Number.MAX_SAFE_INTEGER
    );

    if (upcomingTrips.length === 0) return null;

    return upcomingTrips.reduce((nearest, trip) =>
      trip.daysUntil < nearest.daysUntil ? trip : nearest
    );
  }, [trips]);


  useEffect(() => {
    if (!nearestTrip) return;

    const initialStates = {};
    nearestTrip.tasks.forEach((task) => {
      initialStates[task._id] = task.completed;
    });

    setTaskStates(initialStates);
  }, [nearestTrip?.id]);

  const toggleTask = async (taskId) => {
    if (!nearestTrip) return;

    try {
      setTaskStates((prev) => ({
        ...prev,
        [taskId]: !prev[taskId],
      }));

      await API.patch(`/trips/${nearestTrip.id}/tasks/${taskId}`);
      fetchTrips();
    } catch (error) {
      console.error(error);
      alert("Failed to update task");
    }
  };

  const deleteTrip = async () => {
    if (!tripToDelete) return;

    try {
      await API.delete(`/trips/${tripToDelete._id || tripToDelete.id}`);
      setTrips((prev) => prev.filter((trip) => trip.id !== (tripToDelete._id || tripToDelete.id)));
      setShowDeleteModal(false);
      setTripToDelete(null);
      alert("Trip deleted successfully!");
      fetchTrips();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete trip");
    }
  };

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setShowDeleteModal(true);
  };

  const filteredTrips =
    filter === "all" ? trips : trips.filter((trip) => trip.status === filter);

  const completedTasks = nearestTrip
    ? nearestTrip.tasks.filter((task) => taskStates[task._id]).length
    : 0;

  const totalTasks = nearestTrip?.tasks.length || 0;

  const checklistProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-slate-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <section className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center">
            <div className="w-28 h-28 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <span className="text-6xl">🧳</span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-3">
              No trips yet
            </h1>

            <p className="text-slate-500 max-w-xl mx-auto mb-8">
              You haven't created any trips yet. Start your first adventure by creating a custom trip or generating one with AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/ai-planner")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create AI Trip
              </button>

              <button
                onClick={() => navigate("/ai-planner")}
                className="px-6 py-3 rounded-xl border border-blue-200 text-blue-600 font-bold flex items-center justify-center gap-2 hover:bg-blue-50"
              >
                <Sparkles className="w-5 h-5" />
                Try AI Planner
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {nearestTrip && (
          <section className="bg-gradient-to-br from-cyan-500 to-blue-800 rounded-3xl overflow-hidden shadow-xl mb-8 p-8">
            <div className="text-center text-white mb-8">
              <h1 className="text-4xl font-black mb-2">Manage Your Trips</h1>
              <p className="text-blue-100">
                Manage AI-generated plans, custom trips, checklists, budgets, reminders, and progress.
              </p>
            </div>

            <div className="grid lg:grid-cols-[0.9fr_1.2fr] gap-6">
              <div className="text-white">
                <div className="relative rounded-3xl overflow-hidden mb-5">
                  <img
                    src={nearestTrip.image}
                    alt={nearestTrip.title}
                    className="w-full h-72 object-cover"
                  />

                  <span className="absolute top-4 left-4 bg-white/25 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold">
                      {nearestTrip.status}
                  </span>
                </div>

                <h2 className="text-3xl font-black mb-2">
                  {nearestTrip.title}
                </h2>

                <p className="flex items-center gap-2 text-blue-100 mb-5">
                  <MapPin className="w-5 h-5" />
                  {nearestTrip.location}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <InfoBox icon={Calendar} label="Dates" value={`${nearestTrip.startDate} - ${nearestTrip.endDate}`} />
                  <InfoBox icon={Users} label="Travelers" value={`${nearestTrip.travelers} People`} />
                  <InfoBox icon={DollarSign} label="Budget" value={nearestTrip.budget} />
                  <InfoBox icon={Plane} label="Duration" value={nearestTrip.duration} />
                </div>
              </div>

              <div className="bg-white/90 rounded-3xl p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Trip Checklist
                    </h3>
                    <p className="text-slate-500">
                      {completedTasks} of {totalTasks} tasks completed
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-4xl font-black text-purple-600">
                      {checklistProgress}%
                    </p>
                    <p className="text-sm text-slate-500">Complete</p>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${checklistProgress}%` }}
                  />
                </div>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                  {nearestTrip.tasks.length === 0 ? (
                    <p className="text-slate-500 text-sm">
                      No checklist tasks available.
                    </p>
                  ) : (
                    nearestTrip.tasks.map((task) => {
                      const completed = taskStates[task._id];

                      return (
                        <button
                          key={task._id}
                          onClick={() => toggleTask(task._id)}
                          className="w-full flex items-center gap-3 text-left"
                        >
                          {completed ? (
                            <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}

                          <span
                            className={`text-sm ${
                              completed
                                ? "line-through text-slate-400"
                                : "text-slate-700"
                            }`}
                          >
                            {task.title}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
          {["all", "ongoing", "completed", "missed"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`pb-4 font-semibold capitalize ${
                filter === item
                  ? "text-cyan-600 border-b-2 border-cyan-500"
                  : "text-slate-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDeleteClick} />
          ))}
        </div>
      </div>

      {showDeleteModal && tripToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              Delete Trip?
            </h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <strong>{tripToDelete.title}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTripToDelete(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteTrip}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/20 border border-white/25 p-4">
      <div className="flex items-center gap-2 text-blue-100 text-sm mb-2">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <p className="text-white font-black">{value}</p>
    </div>
  );
}

function TripCard({ trip, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="relative">
        <img
          src={trip.image}
          alt={trip.title}
          className="w-full h-48 object-cover"
        />

        <span className="absolute top-4 left-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          {trip.daysLeftDisplay}
        </span>

        <button 
          onClick={() => onDelete(trip)}
          className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-slate-100 transition"
        >
          <MoreVertical className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-black text-slate-900 mb-1">
          {trip.title}
        </h3>

        <p className="flex items-center gap-2 text-slate-500 mb-4">
          <MapPin className="w-4 h-4" />
          {trip.location}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 mb-4">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </p>

          <p className="flex items-center gap-2 justify-end">
            <Clock className="w-4 h-4 text-blue-500" />
            {trip.duration}
          </p>

          <p className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            {trip.travelers} Travelers
          </p>

          <p className="flex items-center gap-2 justify-end">
            <DollarSign className="w-4 h-4 text-purple-500" />
            {trip.budget}
          </p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">Planning Progress</span>
            <span className="font-bold text-cyan-600">
              {trip.progress}%
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{ width: `${trip.progress}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/trip/${trip._id || trip.id}`)}
            className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 py-3 text-white font-bold hover:shadow-lg transition"
          >
            View Details
          </button>

          <button className="w-12 rounded-xl border border-slate-200 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}