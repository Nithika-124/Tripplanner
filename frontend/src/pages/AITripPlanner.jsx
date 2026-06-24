import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Briefcase,
  Calendar,
  Map,
  MapPin,
  PiggyBank,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import API from "../../api/api";
import { AITripCard } from "../components/AITripCard";
import { AITripDetailsModal } from "../components/AITripDetailsModal";
import { AuthModal } from "../components/AuthModal";
import { getTravelImage, isBadImageUrl } from "../utils/travelImages";

const interestOptions = [
  "Culture",
  "Food",
  "Nature",
  "Adventure",
  "Shopping",
  "History",
  "Nightlife",
  "Relaxation",
];

export function AITripPlanner() {
  const navigate = useNavigate();

  const [interests, setInterests] = useState(["Culture", "Food", "History"]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [pendingTripToSave, setPendingTripToSave] = useState(null);
  const [isSaveAuthOpen, setIsSaveAuthOpen] = useState(false);

  const [form, setForm] = useState({
    startLocation: "Colombo, Sri Lanka",
    destinationCountry: "Japan",
    startDate: "",
    budget: 1500,
    days: 5,
    travelers: 2,
    travelStyle: "mid-range",
    notes: "",
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const generateAITrips = async () => {
    if (!form.destinationCountry.trim()) return alert("Please enter destination country");
    if (!form.startDate) return alert("Please select a travel start date");
    if (Number(form.days) < 1) return alert("Days must be at least 1");
    if (Number(form.budget) <= 0) return alert("Budget must be greater than 0");
    if (Number(form.travelers) < 1) return alert("Travelers must be at least 1");

    try {
      setLoading(true);
      setPlans([]);
      setSelectedPlan(null);

      const res = await API.post("/ai-trip/generate", {
        ...form,
        budget: Number(form.budget),
        days: Number(form.days),
        travelers: Number(form.travelers),
        interests,
      });

      const generatedPlans = Array.isArray(res.data)
        ? res.data
        : res.data.itineraries || [];

      setPlans(generatedPlans);

      if (generatedPlans.length > 0) {
        setShowFilters(false);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to generate AI trip options");
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async (plan, options = {}) => {
    if (!plan) return;

    if (!options.skipAuth && !localStorage.getItem("token")) {
      setPendingTripToSave(plan);
      setIsSaveAuthOpen(true);
      return;
    }

    try {
      setSaving(true);

      const destinations = getDestinations(plan, form.destinationCountry);
      const startDate = new Date(form.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Number(form.days) - 1);

      await API.post("/trips", {
        title: plan.title,
        summary: plan.summary,
        aiGenerated: true,
        budget: plan.totalBudget,
        budgetBreakdown: plan.budgetBreakdown,
        recommendations: plan.recommendations,
        dailyPlan: plan.dailyPlan,
        hotels: plan.hotels,
        restaurants: plan.restaurants,
        packing: plan.packing,
        weather: plan.weather,
        emergencyNumbers: plan.emergencyNumbers,
        image: getPlanImage(plan),
        interests,
        notes: form.notes,
        travelStyle: form.travelStyle,
        startLocation: form.startLocation,
        destinations,
        travelers: Number(form.travelers),
        progress: 0,
        status: "planned",
        startDate,
        endDate,
        transportationPreference: plan.transportation || "AI",
        hotelPreference: "AI",
        tasks: [
          { title: "Book flights", category: "booking", completed: false },
          { title: "Book hotel", category: "booking", completed: false },
          { title: "Confirm route", category: "planning", completed: false },
          { title: "Pack bags", category: "packing", completed: false },
          { title: "Download offline maps", category: "planning", completed: false },
        ],
      });

      navigate("/my-trips", {
        state: { message: "Trip saved successfully" },
      });
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        setPendingTripToSave(plan);
        setIsSaveAuthOpen(true);
        return;
      }

      alert(error.response?.data?.message || "Failed to save trip");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAuthSuccess = () => {
    const tripToSave = pendingTripToSave;

    setPendingTripToSave(null);
    setIsSaveAuthOpen(false);

    if (tripToSave) {
      saveTrip(tripToSave, { skipAuth: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-10 text-white shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="w-10 h-10" />
              <h1 className="text-4xl font-bold">AI Trip Planner</h1>
            </div>

            <h2 className="text-xl font-semibold mb-3">
              Plan your perfect trip with AI-powered recommendations
            </h2>

            <p className="text-white/90 max-w-xl">
              Tell us your preferences and let AI create a complete itinerary
              with the best routes, stays, activities and budget plan.
            </p>
          </div>

          <div className="hidden md:block absolute right-16 top-10 text-white/80">
            <div className="text-8xl">🤖 ✈️</div>
          </div>
        </section>

        <div className="space-y-6">

          {plans.length > 0 && (
            <div
              onClick={() => setShowFilters(!showFilters)}
              className="
                cursor-pointer
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:shadow-md
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {form.destinationCountry}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {form.days} Days • ${form.budget} • {form.travelers} Travelers
                  </p>
                </div>

                <button
                  type="button"
                  className="
                    rounded-xl
                    bg-blue-50
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-blue-600
                  "
                >
                  {showFilters ? "Hide Search" : "Edit Search"}
                </button>
              </div>
            </div>
          )}

          {/* FORM */}

          {showFilters && (
            <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <SlidersHorizontal className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Trip Preferences</h2>
                  <p className="text-sm text-slate-500">Fill in your details to compare routes</p>
                </div>
              </div>

              <div className="space-y-5">
                <Field label="Starting Location">
                  <InputShell icon={<MapPin className="icon" />}>
                    <input
                      value={form.startLocation}
                      onChange={(e) => updateForm("startLocation", e.target.value)}
                      className="w-full bg-transparent outline-none"
                      placeholder="Colombo, Sri Lanka"
                    />
                  </InputShell>
                </Field>

                <Field label="Destination Country">
                  <InputShell icon={<Map className="icon" />}>
                    <input
                      value={form.destinationCountry}
                      onChange={(e) => updateForm("destinationCountry", e.target.value)}
                      className="w-full bg-transparent outline-none"
                      placeholder="Japan"
                    />
                  </InputShell>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Budget">
                    <InputShell icon={<PiggyBank className="icon text-emerald-500" />}>
                      <input
                        type="number"
                        value={form.budget}
                        onChange={(e) => updateForm("budget", e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </InputShell>
                  </Field>

                  <Field label="Travel Start Date">
                    <InputShell icon={<Calendar className="icon" />}>
                      <input
                        type="date"
                        value={form.startDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => updateForm("startDate", e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </InputShell>
                  </Field>

                  <Field label="Number of Days">
                    <InputShell icon={<Calendar className="icon" />}>
                      <input
                        type="number"
                        value={form.days}
                        onChange={(e) => updateForm("days", e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </InputShell>
                  </Field>

                  <Field label="Number of Travelers">
                    <InputShell icon={<Users className="icon" />}>
                      <input
                        type="number"
                        value={form.travelers}
                        onChange={(e) => updateForm("travelers", e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </InputShell>
                  </Field>
                </div>

                <Field label="Travel Style">
                  <InputShell icon={<Briefcase className="icon text-purple-500" />}>
                    <select
                      value={form.travelStyle}
                      onChange={(e) => updateForm("travelStyle", e.target.value)}
                      className="w-full bg-transparent outline-none"
                    >
                      <option value="budget">Budget</option>
                      <option value="mid-range">Mid Range</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </InputShell>
                </Field>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Your Interests{" "}
                    <span className="text-slate-400">(Select all that apply)</span>
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {interestOptions.map((interest) => {
                      const selected = interests.includes(interest);

                      return (
                        <button
                          type="button"
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                            selected
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : "bg-white border-slate-200 text-slate-600 hover:border-blue-200"
                          }`}
                        >
                          {selected ? "✓ " : "○ "}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Additional Notes <span className="text-slate-400">(Optional)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(e) => updateForm("notes", e.target.value)}
                    placeholder="Any special requests or preferences..."
                    className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={generateAITrips}
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? "Generating 3 Plans..." : "Generate Best Plans"}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4" />
                  Your data is secure and used only for trip planning
                </div>
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    AI Generated Itineraries
                  </h2>
                  <p className="text-sm text-slate-500">
                    Compare three routes, inspect details, then save only one selected plan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/explore")}
                className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-600 md:flex"
              >
                <Map className="h-4 w-4" />
                Explore
              </button>
            </div>

            {!loading && plans.length === 0 && (
              <div className="py-24 text-center text-slate-400">
                <Sparkles className="mx-auto mb-4 h-12 w-12 text-blue-300" />
                <p className="font-semibold">
                  Fill the form and generate your itinerary options.
                </p>
              </div>
            )}

            {loading && (
              <div className="py-24 text-center text-slate-500">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                <p className="font-semibold">AI is preparing 3 route options...</p>
              </div>
            )}

            {plans.length > 0 && (
              <div>
                <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-emerald-700">
                  <p className="font-black">AI generated 3 itineraries</p>
                  <p className="text-sm">
                    Open any route to review hotels, transport, daily plan, recommendations, packing, and weather.
                  </p>
                </div>
                <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                  {plans.map((plan, index) => (
                    <AITripCard
                      key={`${plan.title}-${index}`}
                      trip={plan}
                      onViewDetails={setSelectedPlan}
                      onSave={saveTrip}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <AITripDetailsModal
        trip={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onSave={saveTrip}
        saving={saving}
      />

      <AuthModal
        isOpen={isSaveAuthOpen}
        onClose={() => {
          setIsSaveAuthOpen(false);
          setPendingTripToSave(null);
        }}
        initialTab="login"
        onLoginSuccess={handleSaveAuthSuccess}
      />

      <style>{`
        .input-box {
          min-height: 44px;
          border: 1px solid rgb(226 232 240);
          border-radius: 12px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgb(15 23 42);
          font-size: 14px;
          background: white;
        }

        .icon {
          width: 18px;
          height: 18px;
          color: rgb(37 99 235);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function InputShell({ icon, children }) {
  return (
    <div className="input-box">
      {icon}
      {children}
    </div>
  );
}

function getDestinations(plan, fallbackCountry) {
  const activityDestinations =
    plan.dailyPlan?.flatMap((day) =>
      (day.activities || []).map((activity) => ({
        name: activity.place,
        city: day.city,
        country: plan.destinationCountry || fallbackCountry,
        lat: activity.lat || null,
        lng: activity.lng || null,
      }))
    ) || [];

  if (activityDestinations.length > 0) return activityDestinations;

  return (plan.cities || []).map((city) => ({
    name: city,
    city,
    country: plan.destinationCountry || fallbackCountry,
  }));
}

function getPlanImage(plan) {
  if (!isBadImageUrl(plan.image)) return plan.image;
  if (!isBadImageUrl(plan.coverImage)) return plan.coverImage;

  return getTravelImage(
    [plan.coverImageQuery, plan.title, plan.destinationCountry, plan.cities?.join(" ")]
      .filter(Boolean)
      .join(" "),
    900,
    600
  );
}
