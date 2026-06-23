import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  ArrowLeft,
  Clock,
  MapPinIcon,
  Utensils,
  Home,
  AlertCircle,
} from "lucide-react";
import API from "../../api/api";

export function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/trips/${id}`);
        setTrip(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load trip");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-slate-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/my-trips")}
            className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Trips
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Error Loading Trip
            </h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/my-trips")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Return to Trips
            </button>
          </div>
        </div>
      </div>
    );
  }

  const budget = trip.budgetBreakdown || {};
  const dailyPlan = trip.dailyPlan || [];

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/my-trips")}
          className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Trips
        </button>

        {/* Header */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white p-8 mb-8 shadow-xl">
          <h1 className="text-4xl font-black mb-3">{trip.title}</h1>
          {trip.summary && <p className="text-blue-100 text-lg mb-6">{trip.summary}</p>}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                <MapPin className="w-4 h-4" />
                Location
              </div>
              <p className="text-white font-bold">
                {trip.destinations?.[0]?.city || trip.startLocation || "TBD"}
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Duration
              </div>
              <p className="text-white font-bold">
                {trip.travelers || 0} days
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                <Users className="w-4 h-4" />
                Travelers
              </div>
              <p className="text-white font-bold">{trip.travelers || 0}</p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Budget
              </div>
              <p className="text-white font-bold">${trip.budget || 0}</p>
            </div>
          </div>
        </section>

        {/* Budget Breakdown */}
        {Object.keys(budget).length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Budget Breakdown
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {budget.flight > 0 && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-slate-600 text-sm mb-2">Flights</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${budget.flight}
                  </p>
                </div>
              )}
              {budget.hotel > 0 && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-slate-600 text-sm mb-2">Hotels</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ${budget.hotel}
                  </p>
                </div>
              )}
              {budget.food > 0 && (
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-slate-600 text-sm mb-2">Food</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ${budget.food}
                  </p>
                </div>
              )}
              {budget.transport > 0 && (
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-slate-600 text-sm mb-2">Transport</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${budget.transport}
                  </p>
                </div>
              )}
              {budget.activities > 0 && (
                <div className="bg-pink-50 rounded-xl p-4">
                  <p className="text-slate-600 text-sm mb-2">Activities</p>
                  <p className="text-2xl font-bold text-pink-600">
                    ${budget.activities}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Daily Plan */}
        {dailyPlan.length > 0 ? (
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Day-by-Day Itinerary
            </h2>

            <div className="space-y-6">
              {dailyPlan.map((day, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-6 pb-6 relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-3 top-0 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Day {day.day}: {day.title}
                      </h3>
                      {day.route && (
                        <p className="text-slate-600 flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" />
                          {day.route}
                        </p>
                      )}
                    </div>
                    {day.estimatedCost > 0 && (
                      <div className="bg-slate-100 rounded-lg px-4 py-2">
                        <p className="text-sm text-slate-600">Est. Cost</p>
                        <p className="text-lg font-bold text-slate-900">
                          ${day.estimatedCost}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Hotel Suggestion */}
                  {day.hotelSuggestion && (
                    <div className="bg-purple-50 rounded-lg p-4 mb-4 flex items-start gap-3">
                      <Home className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {day.hotelSuggestion.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {day.hotelSuggestion.area} •{" "}
                          <span className="font-semibold">
                            ${day.hotelSuggestion.estimatedNightlyCost}/night
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Activities */}
                  {day.activities && day.activities.length > 0 && (
                    <div className="space-y-3">
                      {day.activities.map((activity, actIndex) => (
                        <div
                          key={actIndex}
                          className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-3">
                              <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {activity.place}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {activity.activity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">
                                {activity.time}
                              </p>
                              {activity.cost > 0 && (
                                <p className="font-semibold text-slate-900">
                                  ${activity.cost}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No daily itinerary available for this trip.</p>
          </section>
        )}

        {/* Recommendations */}
        {trip.recommendations && trip.recommendations.length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Recommendations
            </h2>

            <div className="space-y-3">
              {trip.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">{rec}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trip Info */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Trip Information
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {trip.travelStyle && (
              <div>
                <p className="text-slate-600 text-sm mb-1">Travel Style</p>
                <p className="font-semibold text-slate-900 capitalize">
                  {trip.travelStyle}
                </p>
              </div>
            )}

            {trip.startLocation && (
              <div>
                <p className="text-slate-600 text-sm mb-1">Start Location</p>
                <p className="font-semibold text-slate-900">
                  {trip.startLocation}
                </p>
              </div>
            )}

            {trip.interests && trip.interests.length > 0 && (
              <div className="md:col-span-3">
                <p className="text-slate-600 text-sm mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {trip.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {trip.notes && (
              <div className="md:col-span-3">
                <p className="text-slate-600 text-sm mb-2">Notes</p>
                <p className="text-slate-700">{trip.notes}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
