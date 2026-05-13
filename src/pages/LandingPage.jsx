import { motion } from "framer-motion";
import { 
  Globe, Users, MapPin, Star, Award, Search, Calendar, Plane, 
  Wallet, Shield, Compass, ChevronDown, Quote, ArrowRight, Sparkles,
  Mail, Phone, Send , Clock
} from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";

// --- Internal Section Components ---



const floatingCards = [
  { label: "Paris, France", rating: "4.9", flag: "🗼", left: "8%", top: "30%" },
  { label: "Bali, Indonesia", rating: "4.8", flag: "🌴", right: "6%", top: "35%" },
  { label: "Santorini, Greece", rating: "5.0", flag: "⛵", left: "10%", bottom: "25%" },
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    lines: ["support@tripplanner.com", "info@tripplanner.com"],
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
  },
  {
    icon: MapPin,
    label: "Office",
    lines: ["123 Travel Street", "San Francisco, CA 94102"],
  },
  {
    icon: Clock,
    label: "Hours",
    lines: ["Mon–Fri: 9am – 6pm PST", "Sat: 10am – 4pm PST"],
  },
];

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #060E1E 0%, #0A1628 40%, #0D1F3C 70%, #0A1628 100%)" }}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060E1E]/60 via-transparent to-[#060E1E]" />
      </div>

      {/* Animated dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/8 blur-[100px] pointer-events-none" />

      {/* Floating destination cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 1.2 + i * 0.2, duration: 0.6 },
            y: { delay: 1.2 + i * 0.2, duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute hidden lg:flex items-center gap-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-xl"
          style={{ left: card.left, right: card.right, top: card.top, bottom: card.bottom }}
        >
          <span className="text-2xl">{card.flag}</span>
          <div>
            <p className="text-white text-sm font-semibold leading-none mb-1">{card.label}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-amber-400 text-xs font-bold">{card.rating}</span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
        >
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-white/80 font-medium">200+ destinations worldwide</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-6 leading-[0.95] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          <span className="block text-[clamp(3rem,8vw,7rem)] font-black text-white">
            Plan Your Next
          </span>
          <span
            className="block text-[clamp(3rem,8vw,7rem)] font-black italic"
            style={{
              background: "linear-gradient(90deg, #056cfcff 0%, #0db8d1ff 40%, #c7f6ffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Adventure
          </span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Discover amazing destinations, craft perfect itineraries, and create memories that last a lifetime — all in one place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="/app"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-[#060E1E] rounded-2xl font-bold text-base shadow-2xl shadow-blue-400/25 hover:shadow-blue-400/40 transition-all"
          >
            Start Planning Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.a>
          <motion.a
            href="#destinations"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold text-base hover:bg-white/15 transition-all"
          >
            Explore Destinations
          </motion.a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-6 text-sm text-white/50"
        >
          <div className="flex -space-x-2">
            {[
              "photo-1494790108377-be9c29b29330",
              "photo-1507003211169-0a1dd7228f2d",
              "photo-1438761681033-6461ffad8d80",
              "photo-1534528741775-53994a69daeb",
            ].map((id, i) => (
              <img
                key={i}
                src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&auto=format`}
                alt="Traveler"
                className="w-9 h-9 rounded-full border-2 border-[#060E1E] object-cover"
              />
            ))}
          </div>
          <span>
            <strong className="text-white">50,000+</strong> travelers already planning
          </span>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060E1E] to-transparent pointer-events-none" />
    </section>
  );
}

function Stats() {
  const stats = [
    { icon: Users, value: "50K+", label: "Happy Travelers" },
    { icon: MapPin, value: "200+", label: "Destinations" },
    { icon: Star, value: "4.9/5", label: "Average Rating" },
    { icon: Award, value: "15+", label: "Awards Won" },
  ];

  return (
    <section className="py-16 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-blue-200 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationShowcase() {
  const destinations = [
    {
      name: "Swiss Alps",
      country: "Switzerland",
      tag: "Mountains",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=1000&fit=crop&auto=format",
      span: "row-span-2",
    },
    {
      name: "Santorini",
      country: "Greece",
      tag: "Islands",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=500&fit=crop&auto=format",
      span: "",
    },
    {
      name: "Kyoto",
      country: "Japan",
      tag: "Cultural",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=500&fit=crop&auto=format",
      span: "",
    },
    {
      name: "Amalfi Coast",
      country: "Italy",
      tag: "Historical",
      image: "https://images.unsplash.com/photo-1762255180281-254cfc2fc75e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      span: "",
    },
    {
      name: "Hanifaru Bay",
      country: "Maldives",
      tag: "Ocean",
      image: "https://images.unsplash.com/photo-1761145587538-622257cb2ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      span: "",
    },
  ];

    return (
    <section id="destinations" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-4xl md:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Popular<br />Destinations
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">From majestic mountains to pristine beaches, discover your next adventure</p>
          </motion.div>
          <motion.a
            href="/explore"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ x: 4 }}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold transition-colors group"
          >
            View all destinations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:grid-rows-2">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group cursor-pointer overflow-hidden rounded-3xl bg-slate-900 ${
                index === 0 ? "lg:row-span-2 min-h-[480px]" : "min-h-[220px]"
              }`}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Tag */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-semibold">
                  {dest.tag}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3
                  className="text-2xl font-bold text-white mb-0.5"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {dest.name}
                </h3>
                <p className="text-white/60 text-sm font-medium">{dest.country}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: MapPin, title: "Destination Discovery", description: "Explore thousands of destinations with detailed guides, photos, and insider tips from travelers worldwide." },
    { icon: Calendar, title: "Smart Itinerary Builder", description: "Create day-by-day plans with AI-powered suggestions based on your interests, budget, and travel style." },
    { icon: Users, title: "Collaborative Planning", description: "Plan together with friends and family. Share ideas, vote on activities, and coordinate schedules seamlessly." },
    { icon: Compass, title: "Personalized Recommendations", description: "Get tailored suggestions for attractions, restaurants, and experiences that match your preferences." },
    { icon: Wallet, title: "Budget Management", description: "Track expenses, split costs with travel companions, and stay within your budget with real-time insights." },
    { icon: Shield, title: "Travel Insurance & Safety", description: "Access travel alerts, safety tips, and insurance options to ensure a worry-free journey." },
  ];

  return (
    <section id="features" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex justify-center mb-16">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="relative">
            <Globe className="w-24 h-24 text-cyan-400" strokeWidth={1.5} />
            <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 rounded-full bg-cyan-400/30 blur-2xl" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Everything You Need to Travel Smart</h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">Powerful features to make trip planning effortless and enjoyable</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
            >
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-blue-200 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: "Choose Your Destination", description: "Browse our extensive database of destinations or let AI suggest the perfect place.", step: "01" },
    { icon: Calendar, title: "Build Your Itinerary", description: "Create a day-by-day plan with our smart itinerary builder.", step: "02" },
    { icon: Users, title: "Invite Travel Companions", description: "Collaborate with friends and family. Share plans and make decisions together.", step: "03" },
    { icon: Plane, title: "Start Your Journey", description: "Access your complete travel guide on any device with real-time updates.", step: "04" },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">Plan your perfect trip in just four simple steps</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          
          {steps.map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="relative">
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors h-full">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center font-bold text-white text-lg">{step.step}</div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-blue-200 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    { name: "Sarah Johnson",
      role: "Travel Blogger",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      text: "TripPlanner transformed the way I organize my travels. The itinerary builder is intuitive and the collaborative features made planning our group trip to Europe effortless!"
    },
    { name: "Michael Chen",
      role: "Adventure Enthusiast",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      text: "I've used many trip planning apps, but this one stands out. The personalized recommendations are spot-on, and the budget tracking feature saved me from overspending."
    },
    { name: "Emily Rodriguez",
      role: "Family Traveler",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      text: "Planning family vacations has never been easier! Everyone can add their input, and we all stay on the same page. The kids love seeing the itinerary come together!"
    },
    {
      name: "David Thompson",
      role: "Business Traveler",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      rating: 5,
      text: "As someone who travels frequently for work, this app helps me make the most of my limited free time. The destination guides are comprehensive and always up-to-date.",
    },
    {
      name: "Lisa Park",
      role: "Solo Traveler",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      rating: 5,
      text: "Traveling solo can be daunting, but TripPlanner gives me confidence. The safety features and local insights make me feel secure wherever I go.",
    },
    {
      name: "James Wilson",
      role: "Honeymoon Planner",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      rating: 5,
      text: "We planned our entire honeymoon using this platform. From flights to romantic dinner spots, everything was perfectly organized. Best travel planning experience ever!",
    },
  ];

  return (
    <section id="testimonials" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">What Our Travelers Say</h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">Join thousands of satisfied travelers who have discovered the joy of stress-free trip planning</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -5 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative hover:bg-white/10 transition-colors">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-cyan-400/30" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-blue-100 leading-relaxed mb-6">"{testimonial.text}"</p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-blue-300">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { question: "How does TripPlanner work?",
      answer: "TripPlanner is a comprehensive travel planning platform that helps you organize every aspect of your trip. Simply choose your destination, use our AI-powered itinerary builder to create a personalized schedule, invite travel companions to collaborate, and access your complete travel guide on any device." 
    },
    { question: "Is TripPlanner free to use?",
      answer: "We offer a free plan with essential features including basic itinerary building and destination guides. Premium plans unlock advanced features like AI recommendations, unlimited collaborators, offline access, and priority support."
    },
    { question: "Can I plan trips with friends and family?",
      answer: "Absolutely! Collaboration is one of our core features. You can invite unlimited travel companions on premium plans, share itineraries, vote on activities, and make group decisions seamlessly."
    },
    { question: "Does TripPlanner work offline?",
      answer: "Yes! Premium users can download their complete itineraries, maps, and destination guides for offline access. This ensures you have all your travel information available even without internet connectivity."
    },
    {
      question: "What destinations are available?",
      answer: "We cover over 200 destinations worldwide, from popular tourist hotspots to hidden gems. Our database includes detailed guides, local insights, and curated recommendations for each location. New destinations are added regularly based on user requests.",
    },
    {
      question: "How secure is my travel information?",
      answer: "Security is our top priority. We use bank-level encryption to protect your data, and we never share your personal information with third parties. You have full control over what you share with travel companions and can delete your data at any time.",
    },
    {
      question: "Can I modify my itinerary after creating it?",
      answer: "Of course! Your itinerary is fully flexible. You can add, remove, or rearrange activities at any time. Changes sync instantly across all devices and are visible to your travel companions in real-time.",
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we provide comprehensive customer support. Free users have access to our help center and community forums. Premium users receive priority email support with 24-hour response times and access to live chat during business hours.",
    },
    ];

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-blue-200">Everything you need to know about TripPlanner</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full px-6 py-5 flex items-center justify-between text-left">
                <span className="text-lg font-semibold text-white pr-4">{faq.question}</span>
                <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                </motion.div>
              </button>
              <motion.div initial={false} animate={{ height: openIndex === index ? "auto" : 0, opacity: openIndex === index ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="px-6 pb-5 text-blue-200 leading-relaxed">{faq.answer}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 " />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl" />
      </div>
      <div className="max-w-5xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 md:p-16 text-center">
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Start Your
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Next Adventure?</span>
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">Join thousands of travelers who are already planning smarter, traveling better, and creating unforgettable memories.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button 
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-cyan-500/50 transition-shadow flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-colors">
              View Demo
            </motion.button>
          </div>
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-sm text-blue-300 mb-4">Trusted by travelers worldwide</p>
            <div className="flex flex-wrap justify-center gap-6 text-blue-200 text-sm">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full" /><span>No credit card required</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full" /><span>Free forever plan</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full" /><span>Cancel anytime</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactUs() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.2em] mb-4">
            Contact
          </p>
          <h2
            className="text-4xl md:text-5xl font-black text-white leading-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Get in Touch
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            <p className="text-white/50 text-base leading-relaxed mb-8">
              Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
            </p>

            {contactInfo.map(({ icon: Icon, label, lines }) => (
              <div
                key={label}
                className="flex items-start gap-4 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
                  {lines.map((line) => (
                    <p key={line} className="text-white/75 text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8">
              <h3
                className="text-2xl font-bold text-white mb-7"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Send a Message
              </h3>

              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Alex Rivera"
                      className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.08] transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="alex@example.com"
                      className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.08] transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.08] transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.08] transition-all text-sm resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-[#060E1E] rounded-xl font-bold shadow-xl shadow-blue-400/20 hover:shadow-blue-400/35 transition-shadow"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Main Landing Page Component ---

export function LandingPage() {
  return (
    <div className="min-h-screen text-white" style={{ background: "#060E1E" }}>
      <Header />
      <main id="home">
        <Hero />
        <Stats />
        <DestinationShowcase />
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}