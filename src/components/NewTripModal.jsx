import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Home, Navigation, Tag } from "lucide-react";

export function NewTripModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
              <h2 className="text-xl font-bold text-slate-800">Plan a New Trip</h2>
              <button
                onClick={onClose}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              {/* Trip Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-500" /> Trip Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer in Paris"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" /> Destination
                </label>
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" /> Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-shadow text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" /> End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-shadow text-slate-700"
                  />
                </div>
              </div>

              {/* Hotel & Transportation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Home className="w-4 h-4 text-amber-500" /> Hotel Preference
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-shadow text-slate-700 appearance-none">
                    <option value="">Select Hotel Type</option>
                    <option value="luxury">Luxury Hotel</option>
                    <option value="boutique">Boutique Hotel</option>
                    <option value="budget">Budget / Hostel</option>
                    <option value="airbnb">Airbnb / Rental</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-cyan-500" /> Transportation
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-shadow text-slate-700 appearance-none">
                    <option value="">Select Transportation</option>
                    <option value="flight">Flight</option>
                    <option value="train">Train</option>
                    <option value="car">Rental Car</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 sticky bottom-0 z-20">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-200/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95"
              >
                Create Trip
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
