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
  Plus,
  Search,
  Loader2,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";
import API from "../../api/api";

export function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    type: "hotel",
    title: "",
    provider: "",
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    price: 0,
    notes: "",
  });
  const [bookingSaving, setBookingSaving] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  const [destinations, setDestinations] = useState([]);
  const [searchCountry, setSearchCountry] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [destinationsSaving, setDestinationsSaving] = useState(false);
  const [destinationsMessage, setDestinationsMessage] = useState("");

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

  useEffect(() => {
    if (!trip) return;

    const defaultHotel = trip.hotels?.[0]?.name || trip.hotels?.[0]?.title || "";
    const defaultLocation = trip.destinations?.[0]?.city || trip.startLocation || "";
    const defaultPlanTitle = trip.dailyPlan?.[0]?.title || trip.title || "";

    setBookingForm((prev) => ({
      ...prev,
      title: prev.title || (defaultHotel || defaultPlanTitle || ""),
      provider: prev.provider || defaultHotel || "",
      location: prev.location || defaultLocation,
      price: prev.price || trip.budgetBreakdown?.hotel || 0,
    }));
  }, [trip]);

  useEffect(() => {
    if (!trip) return;

    setDestinations(trip.destinations || []);
    setSearchCountry(
      trip.destinations?.[0]?.country || trip.startLocation || "Sri Lanka"
    );
  }, [trip]);

  useEffect(() => {
    if (!destinationSearch.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchDestinationSuggestions(destinationSearch);
    }, 400);

    return () => clearTimeout(timer);
  }, [destinationSearch, searchCountry]);

  const fetchDestinationSuggestions = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const country = searchCountry || "Sri Lanka";
      const res = await API.get("/destinations/live", {
        params: {
          country,
          category: "all",
          search: query,
        },
      });

      setSearchResults(res.data.slice(0, 8));
    } catch (err) {
      console.error("Destination search failed:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddDestination = (destination) => {
    if (!destination || !destination.name) return;

    setDestinations((prev) => {
      const existing = prev.find(
        (item) => item.name === destination.name && item.city === destination.city
      );
      if (existing) return prev;
      return [...prev, destination];
    });

    setDestinationSearch("");
    setSearchResults([]);
  };

  const handleRemoveDestination = (index) => {
    setDestinations((prev) => prev.filter((_, i) => i !== index));
  };

  const moveDestination = (index, direction) => {
    setDestinations((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const updated = [...prev];
      const item = updated[index];
      updated[index] = updated[nextIndex];
      updated[nextIndex] = item;
      return updated;
    });
  };

  const handleSaveDestinations = async () => {
    if (!trip) return;

    try {
      setDestinationsSaving(true);
      setDestinationsMessage("");

      const response = await API.patch(`/trips/${trip._id}/destinations`, {
        destinations,
      });

      setTrip(response.data);
      setDestinations(response.data.destinations || []);
      setDestinationsMessage("Trip destinations saved successfully.");
    } catch (err) {
      console.error("Failed to save destinations:", err);
      setDestinationsMessage(
        err.response?.data?.message || "Failed to save destinations"
      );
    } finally {
      setDestinationsSaving(false);
    }
  };

  const handleDestinationSearchChange = (value) => {
    setDestinationSearch(value);
    setDestinationsMessage("");
  };

  const renderDestinationSearch = () => (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Edit Destinations</h2>
          <p className="text-slate-500 text-sm">
            Search real travel destinations and update the order of your trip.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          Search country: <strong>{searchCountry || "Sri Lanka"}</strong>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Search destination
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={destinationSearch}
              onChange={(event) =>
                handleDestinationSearchChange(event.target.value)
              }
              placeholder="Type a destination name..."
              className="w-full pl-11 pr-4 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => fetchDestinationSuggestions(destinationSearch)}
            disabled={!destinationSearch.trim() || searchLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
          >
            {searchLoading ? "Searching..." : "Search"
            }
          </button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-3 mb-4">
          {searchResults.map((result) => (
            <button
              key={result._id || result.xid || `${result.name}-${result.city}`}
              type="button"
              onClick={() => handleAddDestination(result)}
              className="w-full text-left rounded-2xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-slate-50 transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{result.name}</p>
                  <p className="text-sm text-slate-500">
                    {result.city && `${result.city}, `}
                    {result.country}
                  </p>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  Add
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {destinationsMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 mb-4">
          {destinationsMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          {destinations.length === 0 ? (
            <p className="text-slate-500">No destinations added yet.</p>
          ) : (
            destinations.map((destination, index) => (
              <div
                key={`${destination.name}-${index}`}
                className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {destination.name || destination.city}
                    </p>
                    <p className="text-sm text-slate-500">
                      {destination.city && `${destination.city}, `}
                      {destination.country}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveDestination(index, -1)}
                      disabled={index === 0}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDestination(index, 1)}
                      disabled={index === destinations.length - 1}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveDestination(index)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={handleSaveDestinations}
          disabled={destinationsSaving}
          className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-white font-semibold shadow-xl hover:shadow-2xl transition disabled:opacity-50"
        >
          {destinationsSaving ? "Saving..." : "Save destinations"}
        </button>
      </div>
    </div>
  );

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    if (!bookingForm.title.trim()) {
      setBookingMessage("Please enter a booking title.");
      return;
    }

    try {
      setBookingSaving(true);
      setBookingMessage("");

      const response = await API.post(`/trips/${trip._id}/bookings`, {
        ...bookingForm,
        guests: Number(bookingForm.guests || 1),
        price: Number(bookingForm.price || 0),
        status: "pending",
      });

      setTrip((prev) =>
        prev
          ? {
              ...prev,
              bookings: [...(prev.bookings || []), response.data.booking],
            }
          : prev
      );

      setBookingMessage(
        `${bookingForm.type === "hotel" ? "Hotel" : "Plan"} booking saved successfully.`
      );
      setBookingForm((prev) => ({
        ...prev,
        title: "",
        provider: "",
        location: trip.destinations?.[0]?.city || trip.startLocation || "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        price: trip.budgetBreakdown?.hotel || 0,
        notes: "",
      }));
    } catch (err) {
      setBookingMessage(err.response?.data?.message || "Failed to save booking");
    } finally {
      setBookingSaving(false);
    }
  };

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

        {renderDestinationSearch()}

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

        {/* Booking Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Hotel & Plan Bookings
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Reserve hotels or booking packages directly from your saved trip.
              </p>
            </div>
            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {(trip.bookings || []).length} booked
            </div>
          </div>

          {bookingMessage && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {bookingMessage}
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="grid gap-4 md:grid-cols-2 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Booking Type
              </label>
              <select
                value={bookingForm.type}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, type: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              >
                <option value="hotel">Hotel</option>
                <option value="plan">Plan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title
              </label>
              <input
                value={bookingForm.title}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Grand Hotel or Tokyo Culture Pass"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Provider / Place
              </label>
              <input
                value={bookingForm.provider}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, provider: event.target.value }))
                }
                placeholder="Hotel name or tour operator"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location
              </label>
              <input
                value={bookingForm.location}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, location: event.target.value }))
                }
                placeholder="City / area"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Check-in
              </label>
              <input
                type="date"
                value={bookingForm.checkIn}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, checkIn: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Check-out
              </label>
              <input
                type="date"
                value={bookingForm.checkOut}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, checkOut: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Guests
              </label>
              <input
                type="number"
                min="1"
                value={bookingForm.guests}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, guests: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Price
              </label>
              <input
                type="number"
                min="0"
                value={bookingForm.price}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, price: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notes
              </label>
              <textarea
                rows={3}
                value={bookingForm.notes}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, notes: event.target.value }))
                }
                placeholder="Any special request or booking note"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={bookingSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="w-4 h-4" />
                {bookingSaving ? "Saving..." : "Save Booking"}
              </button>
            </div>
          </form>

          {(trip.bookings || []).length > 0 ? (
            <div className="space-y-3">
              {(trip.bookings || []).map((booking, index) => (
                <div
                  key={booking._id || `${booking.title}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.title}</p>
                      <p className="text-sm text-slate-600">
                        {booking.provider || booking.location || "Booking"}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {booking.status || "pending"}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-700">Type</p>
                      <p className="capitalize">{booking.type || "hotel"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Location</p>
                      <p>{booking.location || "TBD"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Price</p>
                      <p>${booking.price || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No bookings yet. Add your first hotel or plan reservation above.</p>
          )}
        </section>

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
