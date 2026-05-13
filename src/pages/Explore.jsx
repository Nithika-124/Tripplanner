import { motion } from "framer-motion";
import { Search, MapPin, TrendingUp, Star, ArrowRight, X, DollarSign, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";



export function Explore() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'beach', label: 'Beach' },
    { id: 'culture', label: 'Culture' },
  ];

  const destinations = [
    {
      id: '1',
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      rating: 4.8,
      reviews: 12453,
      price: 'From $1,200',
      description: 'The City of Light offers iconic landmarks, world-class museums, and exceptional cuisine. From the Eiffel Tower to the Louvre, Paris captivates visitors with its romantic atmosphere and rich cultural heritage.',
      bestTimeToVisit: 'April to June, September to October',
      activities: ['Sightseeing', 'Museums', 'Fine Dining', 'Shopping'],
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Champs-Élysées'],
      category: 'popular',
      photos: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
        'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
      ]
    },
    {
      id: '2',
      name: 'Maldives',
      country: 'Indian Ocean',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
      rating: 4.9,
      reviews: 8934,
      price: 'From $3,500',
      description: 'A tropical paradise featuring crystal-clear waters, pristine beaches, and luxurious overwater bungalows. Perfect for honeymoons and relaxation.',
      bestTimeToVisit: 'November to April',
      activities: ['Snorkeling', 'Diving', 'Spa', 'Water Sports'],
      highlights: ['Overwater Villas', 'Coral Reefs', 'Marine Life', 'Luxury Resorts'],
      category: 'luxury',
      photos: [
        'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800',
      ]
    },
    {
      id: '3',
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      rating: 4.7,
      reviews: 15678,
      price: 'From $1,800',
      description: 'A fascinating blend of ancient traditions and cutting-edge technology. Experience temples, gardens, anime culture, and incredible cuisine.',
      bestTimeToVisit: 'March to May, September to November',
      activities: ['Cultural Tours', 'Food Experiences', 'Shopping', 'Technology'],
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Tower', 'Harajuku'],
      category: 'culture',
      photos: [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
      ]
    },
    {
      id: '4',
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      rating: 4.8,
      reviews: 11234,
      price: 'From $900',
      description: 'Tropical island paradise with stunning beaches, rice terraces, temples, and vibrant culture. Known for surfing, yoga retreats, and spiritual experiences.',
      bestTimeToVisit: 'April to October',
      activities: ['Surfing', 'Yoga', 'Temple Tours', 'Beach Activities'],
      highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
      category: 'beach',
      photos: [
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
        'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800',
      ]
    },
    {
      id: '5',
      name: 'New Zealand',
      country: 'Oceania',
      image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800',
      rating: 4.9,
      reviews: 9876,
      price: 'From $2,200',
      description: 'Adventure capital with breathtaking landscapes, from snow-capped mountains to pristine beaches. Perfect for hiking, skiing, and extreme sports.',
      bestTimeToVisit: 'December to February',
      activities: ['Hiking', 'Skiing', 'Bungee Jumping', 'Wildlife'],
      highlights: ['Milford Sound', 'Queenstown', 'Hobbiton', 'Fox Glacier'],
      category: 'adventure',
      photos: [
        'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800',
        'https://images.unsplash.com/photo-1469521669194-babb3750acae?w=800',
        'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800',
      ]
    },
    {
      id: '6',
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
      rating: 4.9,
      reviews: 13456,
      price: 'From $1,500',
      description: 'Stunning Greek island with iconic white-washed buildings, blue domes, and spectacular sunsets. Famous for wine, beaches, and romantic ambiance.',
      bestTimeToVisit: 'April to November',
      activities: ['Wine Tasting', 'Beach', 'Photography', 'Sailing'],
      highlights: ['Oia Sunset', 'Red Beach', 'Ancient Thera', 'Caldera Views'],
      category: 'popular',
      photos: [
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
        'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
        'https://images.unsplash.com/photo-1613395877317-8e0f8c7f1a8e?w=800',
      ]
    },
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-73px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-center text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            <span className="font-['Playfair_Display'] inline-block scale-x-125">
              Where do you want to go?
            </span>
          </h1>
          <p className="text-center text-gray-600">Discover amazing destinations for your next adventure</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search destinations, cities, or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <span>{category.icon}</span>
              <span className="font-semibold">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onClick={() => setSelectedDestination(destination)}
            />
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Destination Detail Modal */}
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
          <h3 className="text-2xl font-bold text-white mb-1">{destination.name}</h3>
          <div className="flex items-center gap-1 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{destination.country}</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">{destination.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span className="font-semibold">{destination.price}</span>
          </div>
          <span className="text-xs text-gray-500">{destination.reviews} reviews</span>
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
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-2 h-80">
            <img
              src={destination.photos[0]}
              alt={destination.name}
              className="w-full h-full object-cover rounded-tl-3xl"
            />
            <div className="grid grid-rows-2 gap-2">
              <img
                src={destination.photos[1]}
                alt={destination.name}
                className="w-full h-full object-cover rounded-tr-3xl"
              />
              <img
                src={destination.photos[2]}
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

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{destination.name}, {destination.country}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{destination.rating}</span>
                  <span className="text-gray-500">({destination.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-purple-600 font-semibold">
                  <DollarSign className="w-5 h-5" />
                  <span>{destination.price}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed">{destination.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Highlights</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {destination.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Activities</h3>
              <div className="flex flex-wrap gap-2">
                {destination.activities.map((activity, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-gray-900">Best Time to Visit</h3>
              </div>
              <p className="text-gray-700">{destination.bestTimeToVisit}</p>
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