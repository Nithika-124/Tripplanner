import { useState } from 'react';
import { MapPin, Calendar, Users, DollarSign, MoreVertical, Share2, Plane, Hotel, Camera, Utensils, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router';




export function MyTrips() {
    const [filter, setFilter] = useState('all');

    const trips = [
        {
            id: '1',
            destination: 'Summer in Paris',
            location: 'Paris, France',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
            startDate: 'Jun 15',
            endDate: 'Jul 18',
            duration: '7 Days',
            travelers: 2,
            budget: '$2,400',
            progress: 75,
            status: 'planned',
            activities: ['Sightseeing', 'Food Tour', 'Museums'],
            daysUntil: 8,
            tasks: [
                { id: '1', title: 'Book flight tickets', completed: true, category: 'booking' },
                { id: '2', title: 'Reserve hotel accommodation', completed: true, category: 'booking' },
                { id: '3', title: 'Purchase travel insurance', completed: true, category: 'booking' },
                { id: '4', title: 'Plan daily itinerary', completed: false, category: 'planning' },
                { id: '5', title: 'Book Louvre Museum tickets', completed: false, category: 'booking' },
                { id: '6', title: 'Reserve dinner at Le Jules Verne', completed: false, category: 'booking' },
                { id: '7', title: 'Pack luggage', completed: false, category: 'packing' },
                { id: '8', title: 'Download offline maps', completed: false, category: 'planning' },
            ]
        },
        {
            id: '2',
            destination: 'London Adventure',
            location: 'London, England',
            image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
            startDate: 'Aug 5',
            endDate: 'Aug 12',
            duration: '8 Days',
            travelers: 4,
            budget: '$3,200',
            progress: 45,
            status: 'planned',
            activities: ['Theater', 'Sightseeing', 'Shopping'],
            daysUntil: 29,
            tasks: [
                { id: '1', title: 'Book flight tickets', completed: true, category: 'booking' },
                { id: '2', title: 'Reserve hotel accommodation', completed: false, category: 'booking' },
                { id: '3', title: 'Book theater tickets', completed: false, category: 'booking' },
            ]
        },
        {
            id: '3',
            destination: 'Tokyo Experience',
            location: 'Tokyo, Japan',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
            startDate: 'Sep 1',
            endDate: 'Sep 10',
            duration: '10 Days',
            travelers: 2,
            budget: '$4,500',
            progress: 20,
            status: 'planned',
            activities: ['Culture', 'Food', 'Technology'],
            daysUntil: 56,
            tasks: [
                { id: '1', title: 'Book flight tickets', completed: false, category: 'booking' },
                { id: '2', title: 'Apply for visa', completed: false, category: 'planning' },
            ]
        },
    ];

    const nearestTrip = trips.reduce((nearest, trip) =>
        trip.daysUntil < nearest.daysUntil ? trip : nearest
    );

    const [taskStates, setTaskStates] = useState(
        Object.fromEntries(nearestTrip.tasks.map(task => [task.id, task.completed]))
    );

    const toggleTask = (taskId) => {
        setTaskStates(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const completedTasks = nearestTrip.tasks.filter(task => taskStates[task.id]).length;
    const totalTasks = nearestTrip.tasks.length;

    const filteredTrips = filter === 'all' ? trips : trips.filter(trip => trip.status === filter);

    return (
        <div className="min-h-[calc(100vh-73px)] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Nearest Trip Detail */}
                <div className="bg-gradient-to-br from-cyan-500 to-blue-800 rounded-3xl overflow-hidden shadow-xl mb-8">
                    <div className="mb-8 pt-10">
                        <h1 className="text-center text-4xl font-bold text-white mb-2">Manage Your Trips</h1>
                        <p className="text-center text-white/90">Manage AI-generated plans, custom trips, checklists, budgets, reminders, and real-time travel progress from one professional workspace.</p>
                    </div>
                    <div className="grid lg:grid-cols-5 gap-6 p-8">
                        {/* Trip Image and Info */}
                        <div className="lg:col-span-2">
                            <div className="relative rounded-2xl overflow-hidden h-64 mb-4">
                                <img
                                    src={nearestTrip.image}
                                    alt={nearestTrip.destination}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-semibold border border-white/30">
                                        Next Trip in {nearestTrip.daysUntil} days
                                    </span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">{nearestTrip.destination}</h2>
                            <div className="flex items-center gap-2 text-purple-100 mb-4">
                                <MapPin className="w-4 h-4" />
                                <span>{nearestTrip.location}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 border border-white/20">
                                    <div className="flex items-center gap-2 text-white text-sm mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Dates</span>
                                    </div>
                                    <p className="text-white font-semibold">{nearestTrip.startDate} - {nearestTrip.endDate}</p>
                                </div>

                                <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 border border-white/20">
                                    <div className="flex items-center gap-2 text-white text-sm mb-1">
                                        <Users className="w-4 h-4" />
                                        <span>Travelers</span>
                                    </div>
                                    <p className="text-white font-semibold">{nearestTrip.travelers} People</p>
                                </div>

                                <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 border border-white/20">
                                    <div className="flex items-center gap-2 text-white text-sm mb-1">
                                        <DollarSign className="w-4 h-4" />
                                        <span>Budget</span>
                                    </div>
                                    <p className="text-white font-semibold">{nearestTrip.budget}</p>
                                </div>

                                <div className="bg-white/30 backdrop-blur-md rounded-xl p-3 border border-white/20">
                                    <div className="flex items-center gap-2 text-white text-sm mb-1">
                                        <Plane className="w-4 h-4" />
                                        <span>Duration</span>
                                    </div>
                                    <p className="text-white font-semibold">{nearestTrip.duration}</p>
                                </div>
                            </div>
                        </div>

                        {/* Task Bar */}
                        <div className="lg:col-span-3 bg-white/90 backdrop-blur-md rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">Trip Checklist</h3>
                                    <p className="text-sm text-gray-600">
                                        {completedTasks} of {totalTasks} tasks completed
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-purple-600">{Math.round((completedTasks / totalTasks) * 100)}%</div>
                                    <div className="text-xs text-gray-500">Complete</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-500"
                                    style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                                ></div>
                            </div>

                            {/* Task Categories */}
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                                {['booking', 'planning', 'packing', 'other'].map((category) => {
                                    const categoryTasks = nearestTrip.tasks.filter(task => task.category === category);
                                    if (categoryTasks.length === 0) return null;

                                    const categoryIcons = {
                                        booking: Hotel,
                                        planning: Calendar,
                                        packing: Camera,
                                        other: Utensils
                                    };

                                    const Icon = categoryIcons[category];

                                    return (
                                        <div key={category}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon className="w-4 h-4 text-purple-500" />
                                                <h4 className="font-semibold text-gray-900 capitalize">{category}</h4>
                                            </div>
                                            <div className="space-y-2 ml-6">
                                                {categoryTasks.map((task) => (
                                                    <label
                                                        key={task.id}
                                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                                                    >
                                                        <button
                                                            onClick={() => toggleTask(task.id)}
                                                            className="flex-shrink-0"
                                                        >
                                                            {taskStates[task.id] ? (
                                                                <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                                                            ) : (
                                                                <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                                                            )}
                                                        </button>
                                                        <span className={`flex-1 ${taskStates[task.id] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                            {task.title}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    {['all', 'planned', 'ongoing', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`pb-3 px-2 capitalize transition-all ${filter === status
                                ? 'text-cyan-500 border-b-2 border-cyan-500 font-semibold'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {status}
                            {status === 'all' && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {trips.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* All Trips Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TripCard({ trip }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="relative h-48">
                <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        {trip.daysUntil} days left
                    </span>
                </div>
                <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{trip.destination}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{trip.location}</span>
                    </div>
                </div>

                {/* Trip Details */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span>{trip.startDate} - {trip.endDate}</span>
                        </div>
                        <span className="text-gray-500">{trip.duration}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span>{trip.travelers} Travelers</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="w-4 h-4 text-purple-500" />
                            <span>{trip.budget}</span>
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Planning Progress</span>
                        <span className="font-semibold text-cyan-500">{trip.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all"
                            style={{ width: `${trip.progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Activities */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {trip.activities.slice(0, 3).map((activity, index) => (
                        <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                            {activity}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-semibold text-sm">
                        View Details
                    </button>
                    <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}
