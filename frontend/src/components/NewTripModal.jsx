import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Tag,
  MapPin,
  Calendar,
  Hotel,
  Plane,
  Plus,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import API from "../../api/api";
import { Loader2 } from "lucide-react";

export function NewTripModal({ isOpen, onClose }) {
  const [destinations, setDestinations] = useState([
    { id: Date.now(), value: "" },
  ]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 1,
    hotelPreference: "",
    transportationPreference: "driving-car",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanDestinations = destinations
      .map((d) => d.value.trim())
      .filter(Boolean);

    if (!formData.title.trim()) {
      alert("Please enter a trip name");
      return;
    }

    if (cleanDestinations.length === 0) {
      alert("Please enter at least one destination");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert("Please select start and end dates");
      return;
    }

    try {
      setLoading(true);

      const previewRes = await API.post("/trips/preview", {
        title: formData.title,
        destinations: cleanDestinations,
        startDate: formData.startDate,
        endDate: formData.endDate,
        hotelPreference: formData.hotelPreference,
        transportationPreference: formData.transportationPreference,
        budget: Number(formData.budget) || 0,
      });

      await API.post("/trips", {
        ...previewRes.data,
        travelers: Number(formData.travelers) || 1,
      });

      alert("Trip created successfully!");

      setFormData({
        title: "",
        startDate: "",
        endDate: "",
        budget: "",
        travelers: 1,
        hotelPreference: "",
        transportationPreference: "driving-car",
      });

      setDestinations([{ id: Date.now(), value: "" }]);
      onClose();

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Trip creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 my-6 w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-8 py-7 text-white">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 left-24 h-40 w-40 rounded-full bg-cyan-300/30 blur-3xl" />

              <button
                type="button"
                aria-label="Close modal"
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute right-6 top-6 z-[9999] flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
              >
                <X className="h-5 w-5 pointer-events-none" />
              </button>

              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-md">
                  <Sparkles className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-100">
                    TripPlanner
                  </p>
                  <h2 className="text-3xl font-black">Plan a New Trip</h2>
                  <p className="mt-1 text-sm text-blue-50">
                    Create a custom trip with destinations, dates, budget, and travel preferences.
                  </p>
                </div>
              </div>
            </div>

            <form 
              onSubmit={handleSubmit} 
              className="grid max-h-[70vh] gap-6 p-6 overflow-y-auto sm:p-8"
            >
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Tag className="h-4 w-4 text-blue-600" />
                  Trip Name
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Summer in Paris"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    Destinations
                  </label>

                  <button
                    type="button"
                    onClick={() => setDestinations([...destinations, { id: Date.now(), value: "" }])}
                    className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another
                  </button>
                </div>

                <div className="space-y-3">
                    {destinations.map((destination) => (
                        <div
                        key={destination.id}
                        className="group relative"
                        >
                        <input
                            type="text"
                            value={destination.value}
                            placeholder="Enter destination"
                            onChange={(e) =>
                            setDestinations(
                                destinations.map((d) =>
                                d.id === destination.id
                                    ? { ...d, value: e.target.value }
                                    : d
                                )
                            )
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 pr-14 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />

                        {destinations.length > 1 && (
                            <button
                            type="button"
                            onClick={() =>
                                setDestinations(
                                destinations.filter(
                                    (d) => d.id !== destination.id
                                )
                                )
                            }
                            className="
                                absolute right-4 top-1/2
                                -translate-y-1/2
                                opacity-0
                                group-hover:opacity-100
                                transition-all duration-200
                                text-slate-400
                                hover:text-red-500
                            "
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7L5 7M10 11V17M14 11V17M6 7L7 19C7 20.1 7.9 21 9 21H15C16.1 21 17 20.1 17 19L18 7M9 7V5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5V7"
                                />
                            </svg>
                            </button>
                        )}
                        </div>
                    ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Wallet className="h-4 w-4 text-cyan-500" />
                    Budget
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    placeholder="e.g. 1500"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Users className="h-4 w-4 text-indigo-500" />
                    Travelers
                  </label>
                  <input
                    type="number"
                    value={formData.travelers}
                    onChange={(e) =>
                      setFormData({ ...formData, travelers: e.target.value })
                    }
                    placeholder="e.g. 2"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Hotel className="h-4 w-4 text-orange-500" />
                    Hotel Preference
                  </label>
                  <select
                    value={formData.hotelPreference}
                    onChange={(e) =>
                      setFormData({ ...formData, hotelPreference: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option>Select Hotel Type</option>
                    <option>Budget</option>
                    <option>Mid Range</option>
                    <option>Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Plane className="h-4 w-4 text-blue-500" />
                    Transportation
                  </label>
                  <select
                    value={formData.transportationPreference}
                    onChange={(e) =>
                      setFormData({ ...formData, transportationPreference: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option>Select Transportation</option>
                    <option>Flight</option>
                    <option>Train</option>
                    <option>Bus</option>
                    <option>Car Rental</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
                <p className="text-sm font-bold text-slate-800">AI Trip Assist</p>
                <p className="mt-1 text-xs text-slate-500">
                  TripPlanner can later generate itinerary suggestions, budget breakdowns, and reminders from this trip.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl px-6 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Trip"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}