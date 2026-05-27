import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  X,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../api/api";

export function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("Sri Lanka");
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
    fetchDestinations();
  }, [selectedCountry, selectedCategory]);

  const fetchCountries = async () => {
    try {
      const res = await API.get("/destinations/countries");
      setCountries(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDestinations = async () => {
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

  const filteredDestinations = destinations;

  return (
    <div className="min-h-[calc(100vh-73px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-center text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            <span className="font-['Playfair_Display'] inline-block scale-x-125">
              Where do you want to go?
            </span>
          </h1>
          <p className="text-center text-gray-600">
            Discover real destinations by country and category
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />

            <button
              onClick={fetchDestinations}
              className="mt-3 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mb-6 max-w-2xl mx-auto">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

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
              <span className="font-semibold">{category.label}</span>
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-center text-gray-600 mb-6">
            Loading real destinations...
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination._id || destination.xid}
              destination={destination}
              onClick={() => setSelectedDestination(destination)}
            />
          ))}
        </div>

        {!loading && filteredDestinations.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No destinations found
            </h3>
            <p className="text-gray-600">
              Try another country, category, or search query
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
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-1">
            {destination.name}
          </h3>

          <div className="flex items-center gap-1 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {destination.city ? `${destination.city}, ` : ""}
              {destination.country}
            </span>
          </div>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">
            {destination.rating || 4.5}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span className="font-semibold capitalize">
              {destination.category || "Destination"}
            </span>
          </div>

          <span className="text-xs text-gray-500">
            {destination.reviews || 500} reviews
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {destination.description}
        </p>

        <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2.5 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-semibold">
          View Details
        </button>
      </div>
    </div>
  );
}

function DestinationModal({ destination, onClose }) {
  const photo1 = destination.photos?.[0] || destination.image;
  const photo2 = destination.photos?.[1] || destination.image;
  const photo3 = destination.photos?.[2] || destination.image;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="grid grid-cols-2 gap-2 h-80">
            <img
              src={photo1}
              alt={destination.name}
              className="w-full h-full object-cover rounded-tl-3xl"
            />

            <div className="grid grid-rows-2 gap-2">
              <img
                src={photo2}
                alt={destination.name}
                className="w-full h-full object-cover rounded-tr-3xl"
              />

              <img
                src={photo3}
                alt={destination.name}
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
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {destination.name}, {destination.country}
              </h2>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {destination.rating || 4.5}
                  </span>
                  <span className="text-gray-500">
                    ({destination.reviews || 500} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-purple-600 font-semibold">
                  <DollarSign className="w-5 h-5" />
                  <span>{destination.price || "Depends on trip"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {destination.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Top Highlights
              </h3>

              <div className="grid md:grid-cols-2 gap-3">
                {(destination.highlights || [destination.name]).map(
                  (highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>{highlight}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Activities
              </h3>

              <div className="flex flex-wrap gap-2">
                {(destination.activities || ["Sightseeing"]).map(
                  (activity, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold"
                    >
                      {activity}
                    </span>
                  )
                )}
              </div>
            </div>

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

            <div className="flex gap-3 pt-4">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all font-semibold">
                Book Now
              </button>

              <button className="px-6 border-2 border-purple-500 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-semibold">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}