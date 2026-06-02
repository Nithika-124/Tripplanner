import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  SlidersHorizontal,
  Bot,
  Map,
  MapPin,
  Plane,
  Hotel,
  Utensils,
  Bus,
  PiggyBank,
  Calendar,
  Users,
  Briefcase,
  ShieldCheck,
  Star,
  Download,
  Pencil,
  Bookmark,
  Wifi,
  Train,
  Sun,
} from "lucide-react";
import API from "../../api/api";

export function AITripPlanner() {
  const navigate = useNavigate();

  const [interests, setInterests] = useState(["Culture", "Food", "History"]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const [form, setForm] = useState({
    startLocation: "Colombo, Sri Lanka",
    destinationCountry: "Japan",
    budget: 1500,
    days: 5,
    travelers: 2,
    travelStyle: "mid-range",
    notes: "",
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

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

  const budget = plan?.budgetBreakdown || {};

  const budgetItems = plan
    ? [
        {
          label: "Total Budget",
          value: `$${plan.totalBudget || form.budget}`,
          sub: `${plan.days || form.days} days • ${
            plan.travelers || form.travelers
          } travelers`,
          icon: PiggyBank,
        },
        {
          label: "Flights",
          value: `$${budget.flight || 0}`,
          sub: "Estimated",
          icon: Plane,
        },
        {
          label: "Hotels",
          value: `$${budget.hotel || 0}`,
          sub: "Estimated",
          icon: Hotel,
        },
        {
          label: "Food",
          value: `$${budget.food || 0}`,
          sub: "Estimated",
          icon: Utensils,
        },
        {
          label: "Transport",
          value: `$${budget.transport || 0}`,
          sub: "Estimated",
          icon: Bus,
        },
        {
          label: "Activities",
          value: `$${budget.activities || 0}`,
          sub: "Estimated",
          icon: PiggyBank,
        },
      ]
    : [];

  const generateAITrip = async () => {
    try {
      setLoading(true);
      setPlan(null);

      const res = await API.post("/ai-trip/generate", {
        ...form,
        budget: Number(form.budget),
        days: Number(form.days),
        travelers: Number(form.travelers),
        interests,
      });

      setPlan(res.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to generate AI trip");
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async () => {
    if (!plan) return;

    try {
      const destinations =
        plan.dailyPlan?.flatMap((day) =>
          (day.activities || []).map((activity) => ({
            name: activity.place,
            city: day.city,
            country: plan.destinationCountry || form.destinationCountry,
            lat: activity.lat,
            lng: activity.lng,
          }))
        ) || [];

      await API.post("/trips", {
        title: plan.title,
        aiGenerated: true,
        destinations,
        budget: plan.totalBudget || Number(form.budget),
        startDate: new Date(),
        endDate: new Date(),
        transportationPreference: "AI Planned",
        hotelPreference: "AI Suggested",
        progress: 0,
        tasks: [
          { title: "Book flights", category: "booking", completed: false },
          { title: "Book hotel", category: "booking", completed: false },
          { title: "Confirm route", category: "planning", completed: false },
          { title: "Pack bags", category: "packing", completed: false },
          { title: "Download offline maps", category: "planning", completed: false },
        ],
      });

      alert("AI trip saved!");
      navigate("/my-trips");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to save trip");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
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

        <div className="grid lg:grid-cols-[0.9fr_1.6fr] gap-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <SlidersHorizontal className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Trip Preferences
                </h2>
                <p className="text-sm text-slate-500">
                  Fill in your details to get started
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Field label="Starting Location">
                <div className="input-box">
                  <MapPin className="icon" />
                  <input
                    value={form.startLocation}
                    onChange={(e) => updateForm("startLocation", e.target.value)}
                    className="w-full outline-none bg-transparent"
                    placeholder="Colombo, Sri Lanka"
                  />
                </div>
              </Field>

              <Field label="Destination Country">
                <div className="input-box">
                  <span>🌍</span>
                  <input
                    value={form.destinationCountry}
                    onChange={(e) =>
                      updateForm("destinationCountry", e.target.value)
                    }
                    className="w-full outline-none bg-transparent"
                    placeholder="Japan"
                  />
                </div>
              </Field>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Budget">
                  <div className="input-box">
                    <PiggyBank className="icon text-emerald-500" />
                    <input
                      type="number"
                      value={form.budget}
                      onChange={(e) => updateForm("budget", e.target.value)}
                      className="w-full outline-none bg-transparent"
                      placeholder="1500"
                    />
                  </div>
                </Field>

                <Field label="Number of Days">
                  <div className="input-box">
                    <Calendar className="icon" />
                    <input
                      type="number"
                      value={form.days}
                      onChange={(e) => updateForm("days", e.target.value)}
                      className="w-full outline-none bg-transparent"
                      placeholder="5"
                    />
                  </div>
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Number of Travelers">
                  <div className="input-box">
                    <Users className="icon" />
                    <input
                      type="number"
                      value={form.travelers}
                      onChange={(e) => updateForm("travelers", e.target.value)}
                      className="w-full outline-none bg-transparent"
                      placeholder="2"
                    />
                  </div>
                </Field>

                <Field label="Travel Style">
                  <div className="input-box">
                    <Briefcase className="icon text-purple-500" />
                    <select
                      value={form.travelStyle}
                      onChange={(e) => updateForm("travelStyle", e.target.value)}
                      className="w-full outline-none bg-transparent"
                    >
                      <option value="budget">Budget</option>
                      <option value="mid-range">Mid Range</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                </Field>
              </div>

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
                  Additional Notes{" "}
                  <span className="text-slate-400">(Optional)</span>
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
                onClick={generateAITrip}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-white font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition disabled:opacity-50"
              >
                {loading ? "Generating AI Trip..." : "✨ Generate AI Trip Plan"}
              </button>

              <div className="flex justify-center items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4" />
                Your data is secure and used only for trip planning
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {plan?.title || "AI Generated Trip Plan"}
                    </h2>

                    {plan && (
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-bold">
                        Best Match
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    {plan?.summary || "Generate your personalized itinerary"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/explore")}
                className="hidden md:flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-blue-600"
              >
                <Map className="w-4 h-4" />
                Explore
              </button>
            </div>

            {!plan && !loading && (
              <div className="text-center py-24 text-slate-400">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                <p className="font-semibold">
                  Fill the form and generate your AI trip plan.
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-24 text-slate-500">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="font-semibold">AI is planning your trip...</p>
              </div>
            )}

            {plan && (
              <>
                <h3 className="font-bold text-slate-900 mb-3">
                  Budget Overview
                </h3>

                <div className="grid md:grid-cols-6 gap-3 mb-3">
                  {budgetItems.map(({ label, value, sub, icon: Icon }) => (
                    <div
                      key={label}
                      className="border border-slate-200 rounded-xl p-4 bg-white"
                    >
                      <Icon className="w-6 h-6 text-blue-500 mb-3" />
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="text-lg font-bold text-slate-900">
                        {value}
                      </p>
                      <p className="text-xs text-slate-400">{sub}</p>
                    </div>
                  ))}
                </div>

                <div className="h-3 rounded-full overflow-hidden flex mb-6">
                  <div className="bg-purple-500 w-[34%]" />
                  <div className="bg-blue-500 w-[28%]" />
                  <div className="bg-emerald-400 w-[15%]" />
                  <div className="bg-orange-400 w-[9%]" />
                  <div className="bg-lime-400 w-[9%]" />
                  <div className="bg-yellow-400 w-[5%]" />
                </div>

                <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3">
                      Daily Itinerary
                    </h3>

                    <div className="space-y-3">
                      {plan.dailyPlan?.map((item) => (
                        <div
                          key={item.day}
                          className="border border-slate-200 rounded-xl p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-bold text-blue-600">
                                Day {item.day}
                              </p>
                              <h4 className="font-bold text-slate-900">
                                {item.title}
                              </h4>
                              <p className="text-sm text-slate-500">
                                {item.route}
                              </p>
                              {item.hotelSuggestion && (
                                <p className="text-xs text-slate-500 mt-2">
                                  Hotel area: {item.hotelSuggestion.area} • $
                                  {item.hotelSuggestion.estimatedNightlyCost}
                                  /night
                                </p>
                              )}
                            </div>

                            <p className="font-bold text-blue-600">
                              ${item.estimatedCost}
                            </p>
                          </div>

                          <div className="mt-3 space-y-2">
                            {item.activities?.map((activity, index) => (
                              <div
                                key={index}
                                className="bg-slate-50 rounded-lg p-3 text-sm"
                              >
                                <p className="font-semibold text-slate-800">
                                  {activity.time} • {activity.place}
                                </p>
                                <p className="text-slate-500">
                                  {activity.activity}
                                </p>
                                <p className="text-blue-600 font-semibold">
                                  ${activity.cost}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="mt-4 w-full border border-slate-200 rounded-xl py-3 text-blue-600 font-semibold flex items-center justify-center gap-2">
                      View Detailed Itinerary
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-2xl p-5">
                      <h3 className="font-bold text-slate-900 mb-4">
                        Trip Highlights
                      </h3>

                      {(plan.recommendations || []).length > 0 ? (
                        plan.recommendations.map((rec, index) => (
                          <div key={index} className="flex gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center">
                              <Star className="w-5 h-5 text-cyan-600" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                Recommendation {index + 1}
                              </p>
                              <p className="text-sm text-slate-500">{rec}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center">
                            <Sun className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              Smart Trip Plan
                            </p>
                            <p className="text-sm text-slate-500">
                              Your route and budget are optimized by AI.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-5">
                      <p className="text-slate-500">Estimated Total</p>
                      <p className="text-3xl font-bold text-cyan-600">
                        ${plan.totalBudget}
                      </p>
                      <p className="text-sm text-slate-500">
                        Price for {plan.travelers || form.travelers} travelers
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 flex items-center justify-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Customize
                      </button>

                      <button
                        type="button"
                        onClick={saveTrip}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2"
                      >
                        <Bookmark className="w-4 h-4" />
                        Save Trip
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        {plan && (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-4">
              💡 AI Recommendations
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {(plan.recommendations || []).slice(0, 3).map((text, index) => {
                const icons = [Plane, Train, Wifi];
                const Icon = icons[index] || Star;

                return (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        Tip {index + 1}
                      </p>
                      <p className="text-sm text-slate-500">{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

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
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}