import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  X,
  DollarSign,
  Calendar,
  Compass,
  Globe,
  Filter,
  MapPinned,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../api/api";

export function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);

  const [countries, setCountries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "all", label: "All" },
    { id: "beach", label: "Beach" },
    { id: "culture", label: "Culture" },
    { id: "historic", label: "Historic" },
    { id: "nature", label: "Nature" },
    { id: "city", label: "City" },
    { id: "museum", label: "Museum" },
    { id: "religion", label: "Religious" },
  ];

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchDestinations();
    }
  }, [selectedCountry, selectedCategory]);

  useEffect(() => {
    if (!selectedCountry) return;

    const timer = setTimeout(() => {
      fetchDestinations();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCountries = async () => {
    try {
      const res = await API.get("/destinations/countries");

      setCountries(res.data);

      if (res.data.length > 0) {
        const sriLanka = res.data.find((c) => c.name === "Sri Lanka");
        setSelectedCountry(sriLanka ? "Sri Lanka" : res.data[0].name);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load countries");
    }
  };

  const fetchDestinations = async () => {
    if (!selectedCountry) return;

    try {
      setLoading(true);

      const res = await API.get("/destinations/live", {
        params: {
          country: selectedCountry,
          category: selectedCategory,
          search: searchQuery,
        },
      });

      setDestinations(res.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-10 mb-8 text-white shadow-lg">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Compass className="w-7 h-7" />
              </div>
              <span className="text-lg font-semibold">
                Explore Real Destinations
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Where do you want to go?
            </h1>

            <p className="text-white/90 text-lg max-w-2xl">
              Discover real-world travel places by country and category. Explore
              destinations, photos, highlights, travel tips and map locations.
            </p>
          </div>

          <div className="hidden md:block absolute right-14 top-10 text-8xl opacity-90">
            🌍✈️
          </div>
        </section>

        {/* SEARCH FILTER CARD */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Filter className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Find destinations
              </h2>
              <p className="text-sm text-gray-500">
                Search by country, category, or place name
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Destination
              </label>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select country</option>

                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchDestinations}
              disabled={loading || !selectedCountry}
              className="w-full lg:w-auto px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">{category.label}</span>
            </button>
          ))}
        </div>

        {/* RESULTS HEADER */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCountry || "Explore"} Destinations
            </h2>
            <p className="text-gray-500">
              {loading
                ? "Loading real destinations..."
                : `${destinations.length} places found`}
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-3xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* DESTINATIONS */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination._id || destination.xid}
                destination={destination}
                onClick={() => setSelectedDestination(destination)}
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && destinations.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No destinations found
            </h3>
            <p className="text-gray-600">
              Try another country, category, or search query.
            </p>
          </div>
        )}

        {selectedDestination && (
          <DestinationModal
            destination={selectedDestination}
            onClose={() => setSelectedDestination(null)}
          />
        )}
      </div>
    </div>
  );
}

function DestinationCard({ destination, onClick }) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-gray-100"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={destination.image || fallbackImage}
          alt={destination.name}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-1 line-clamp-1">
            {destination.name}
          </h3>

          <div className="flex items-center gap-1 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm line-clamp-1">
              {destination.city ? `${destination.city}, ` : ""}
              {destination.country}
            </span>
          </div>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">
            {destination.rating || 4.5}
          </span>
        </div>

        <div className="absolute top-4 left-4 bg-blue-500/90 text-white px-3 py-1.5 rounded-full text-xs font-bold capitalize">
          {destination.category || "Destination"}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            {destination.reviews || 500} reviews
          </span>

          <span className="text-sm font-semibold text-cyan-600">
            {destination.price || "Trip cost varies"}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {destination.description || "Explore this beautiful travel place."}
        </p>

        <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold">
          View Details
        </button>
      </div>
    </motion.div>
  );
}

function DestinationModal({ destination, onClose }) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200";

  const photo1 = destination.photos?.[0] || destination.image || fallbackImage;
  const photo2 = destination.photos?.[1] || destination.image || fallbackImage;
  const photo3 = destination.photos?.[2] || destination.image || fallbackImage;

  const mapUrl =
    destination.location?.lat && destination.location?.lng
      ? `https://www.google.com/maps?q=${destination.location.lat},${destination.location.lng}`
      : `https://www.google.com/maps/search/${encodeURIComponent(
          destination.name + " " + destination.country
        )}`;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="grid grid-cols-2 gap-2 h-190">
            <img
              src={photo1}
              alt={destination.name}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
              className="w-full h-full object-cover rounded-tl-3xl"
            />

            <div className="grid grid-rows-2 gap-2">
              <img
                src={photo2}
                alt={destination.name}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
                className="w-full h-full object-cover rounded-tr-3xl"
              />

              <img
                src={photo3}
                alt={destination.name}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {destination.name}
              </h2>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {destination.rating || 4.5}
                  </span>
                  <span className="text-gray-500">
                    ({destination.reviews || 500} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-cyan-600 font-semibold">
                  <DollarSign className="w-5 h-5" />
                  <span>{destination.price || "Depends on trip"}</span>
                </div>
              </div>
            </div>

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-cyan-50 text-cyan-700 rounded-xl hover:bg-cyan-100 transition font-semibold flex items-center gap-2"
            >
              <MapPinned className="w-5 h-5" />
              View Map
            </a>
          </div>

          <div className="space-y-6">
            {/* INFO CARDS */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-1">Category</h4>
                <p className="capitalize text-gray-600">
                  {destination.category || "Destination"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-1">Country</h4>
                <p className="text-gray-600">{destination.country}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-1">City</h4>
                <p className="text-gray-600">
                  {destination.city || "Unknown"}
                </p>
              </div>
            </div>

            {/* ABOUT */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {destination.description ||
                  "This is a real destination discovered from travel data."}
              </p>
            </div>

            {/* HIGHLIGHTS */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Top Highlights
              </h3>

              <div className="grid md:grid-cols-2 gap-3">
                {(destination.highlights || [destination.name]).map(
                  (highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      <span>{highlight}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* ACTIVITIES */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Activities
              </h3>

              <div className="flex flex-wrap gap-2">
                {(destination.activities || ["Sightseeing"]).map(
                  (activity, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold capitalize"
                    >
                      {activity}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* BEST TIME */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-gray-900">
                  Best Time to Visit
                </h3>
              </div>

              <p className="text-gray-700">
                {destination.bestTimeToVisit || "Depends on season"}
              </p>
            </div>

            {/* TRAVEL TIPS */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Travel Tips
              </h3>

              <div className="space-y-2">
                {(destination.travelTips || [
                  "Visit early morning to avoid crowds.",
                  "Carry comfortable shoes.",
                  "Check weather before visiting.",
                ]).map((tip, index) => (
                  <div
                    key={index}
                    className="bg-cyan-50 text-cyan-700 px-4 py-3 rounded-xl"
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col md:flex-row gap-3 pt-4">
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-semibold text-center"
              >
                View on Google Maps
              </a>

              <button className="px-6 border-2 border-cyan-500 text-cyan-600 rounded-xl hover:bg-cyan-50 transition-colors font-semibold">
                Save Destination
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}