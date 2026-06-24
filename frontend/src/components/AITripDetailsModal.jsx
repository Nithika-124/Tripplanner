import {
  BedDouble,
  Bookmark,
  BriefcaseBusiness,
  Bus,
  CalendarDays,
  Camera,
  Hotel,
  Luggage,
  MapPin,
  Plug,
  Shield,
  Star,
  Sun,
  Wallet,
  X,
} from "lucide-react";
import { fallbackTravelImage, getTravelImage, isBadImageUrl } from "../utils/travelImages";

// Default fallback image when no valid image exists
const fallbackImage = fallbackTravelImage;

const tagStyles = [
  "bg-violet-500 text-white",
  "bg-emerald-500 text-white",
  "bg-amber-500 text-white",
  "bg-pink-500 text-white",
  "bg-sky-500 text-white",
];

const budgetColors = ["#2563eb", "#e95092", "#f59e0b", "#14b8a6", "#7c6ee6"];

export function AITripDetailsModal({ trip, onClose, onSave, saving }) {
  if (!trip) return null;

  // Determine the best available cover image
  const image =
    !isBadImageUrl(trip.image)
      ? trip.image
      : !isBadImageUrl(trip.coverImage)
        ? trip.coverImage
        : getTravelImage(
            [trip.coverImageQuery, trip.title, trip.destinationCountry, trip.cities?.join(" ")]
              .filter(Boolean)
              .join(" "),
            1400,
            720
          );
  // Extract trip data
  const cities = getCities(trip);
  const tags = getTags(trip);
  const hotels = trip.hotels || [];
  const totalBudget = Number(trip.totalBudget || 0);
  // Generate budget breakdown for chart display
  const budgetItems = getBudgetItems(trip.budgetBreakdown, totalBudget);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-2 sm:p-4"
      onClick={onClose}
    >
      <section
        className="flex h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/40 bg-slate-50 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto p-2 sm:p-3">
          <Hero
            trip={trip}
            image={image || fallbackImage}
            cities={cities}
            tags={tags}
            hotelCount={hotels.length}
            onClose={onClose}
          />

          <div className="grid gap-4 py-4 md:grid-cols-4">
            <Metric
              icon={CalendarDays}
              label="Duration"
              value={`${trip.days || trip.dailyPlan?.length || 0} Days`}
              subvalue={`${Math.max(Number(trip.days || 1) - 1, 0)} Nights`}
              color="text-violet-600"
              bg="bg-violet-50"
            />
            <Metric
              icon={Wallet}
              label="Total Budget"
              value={`$${formatNumber(totalBudget)}`}
              subvalue="Per Person"
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <Metric
              icon={BedDouble}
              label="Hotels"
              value={hotels.length || "AI Picks"}
              subvalue={hotels.length ? "Selected" : "Suggested"}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <Metric
              icon={Bus}
              label="Transport"
              value={trip.transportation || "Mixed"}
              subvalue="Train, Bus, Walk"
              color="text-orange-500"
              bg="bg-orange-50"
            />
          </div>

          {trip.budgetMessage && (
            <div
              className={`mb-4 rounded-lg border p-4 text-sm ${
                trip.budgetFeasible
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              <span className="font-black">
                {trip.budgetFeasible ? "Budget Assessment:" : "Budget Notice:"}
              </span>{" "}
              {trip.budgetMessage}
            </div>
          )}

          <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
            <DailyItinerary dailyPlan={trip.dailyPlan || []} />

            <div className="space-y-4">
              <BudgetBreakdown budgetItems={budgetItems} totalBudget={totalBudget} />
              <HotelHighlights hotels={hotels} />
            </div>
          </div>

          <div className="grid gap-4 py-4 md:grid-cols-2 xl:grid-cols-4">
            <RestaurantPanel restaurants={trip.restaurants || []} />
            <SimplePanel
              title="Packing Checklist"
              items={normalizeList(trip.packing)}
              fallback="No packing checklist returned."
              iconMap={[Luggage, BriefcaseBusiness, Plug, Shield, Camera]}
            />
            <WeatherPanel weather={trip.weather} cities={cities} />
            <EmergencyPanel contacts={trip.emergencyNumbers || []} />
          </div>
        </div>

        <TripSummary
          trip={trip}
          totalBudget={totalBudget}
          hotelCount={hotels.length}
          onSave={onSave}
          saving={saving}
        />
      </section>
    </div>
  );
}
/** Displays trip banner image and main trip information. */
function Hero({ trip, image, cities, tags, hotelCount, onClose }) {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
      <img
        src={image}
        alt={trip.title}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-slate-950/10" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/70 to-transparent" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-lg transition hover:scale-105"
        aria-label="Close details"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="relative flex min-h-[360px] flex-col justify-end p-6 text-white sm:p-10">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-white/95 px-4 py-1.5 text-xs font-black uppercase text-blue-700 shadow-sm">
            {trip.optionType || "AI Itinerary"}
          </span>
          <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            {trip.title}
          </h2>
          {cities.length > 0 && (
            <p className="mt-1 text-lg font-bold text-white/90">
              {cities.slice(0, 5).join(" - ")}
            </p>
          )}
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
            {trip.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {tags.slice(0, 5).map((tag, index) => (
              <span
                key={tag}
                className={`rounded-full px-4 py-1.5 text-xs font-bold shadow-sm ${
                  tagStyles[index % tagStyles.length]
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 w-full rounded-lg bg-slate-950/70 p-4 text-sm text-white shadow-xl backdrop-blur sm:absolute sm:bottom-8 sm:right-8 sm:mt-0 sm:w-64">
          <HeroFact icon={Star} text={`${trip.rating || 5}.0 (120 reviews)`} />
          <HeroFact
            icon={CalendarDays}
            text={`${trip.days || trip.dailyPlan?.length || 0} Days / ${Math.max(
              Number(trip.days || 1) - 1,
              0
            )} Nights`}
          />
          <HeroFact icon={Bus} text={trip.transportation || "Mixed Transport"} />
          <HeroFact icon={Hotel} text={`${hotelCount || "AI"} Hotels Selected`} />
        </div>
      </div>
    </div>
  );
}

function HeroFact({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon className="h-4 w-4 text-amber-300" />
      <span className="font-semibold">{text}</span>
    </div>
  );
}
/**
 * Statistics card.
 * Shows key trip metrics such as budget, duration, hotels, and transport.
 */
function Metric({ icon: Icon, label, value, subvalue, color, bg }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-5">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
          <Icon className={`h-7 w-7 ${color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
          <p className="truncate text-xl font-black text-slate-950">{value}</p>
          <p className="text-sm text-slate-500">{subvalue}</p>
        </div>
      </div>
    </div>
  );
}
/**
 * Shows activities day by day.
 */
function DailyItinerary({ dailyPlan }) {
  return (
    <Panel title="Daily Itinerary">
      <div className="relative">
        <div className="absolute bottom-8 left-8 top-6 w-0.5 bg-blue-200" />
        <div className="space-y-3">
          {dailyPlan.map((day) => (
            <div key={day.day} className="relative grid gap-4 pl-20">
              <div className="absolute left-0 top-2 z-10 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                <span className="text-[11px] font-bold leading-none">Day</span>
                <span className="text-2xl font-black leading-none">{day.day}</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-black text-slate-950">{day.title}</h4>
                        <p className="text-sm font-medium text-slate-600">
                          {day.route || day.city}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-black text-blue-600">
                        ${day.estimatedCost || 0}
                      </p>
                    </div>

                    <ul className="mt-3 space-y-1.5 text-sm text-slate-800">
                      {(day.activities || []).slice(0, 4).map((activity, index) => (
                        <li key={`${day.day}-${activity.place}-${index}`} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                          <span>
                            <span className="font-semibold">{activity.place}</span>
                            {activity.activity ? ` - ${activity.activity}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {day.hotelSuggestion?.name && (
                      <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <Hotel className="h-3.5 w-3.5 text-blue-600" />
                        Hotel: {day.hotelSuggestion.name}
                      </p>
                    )}
                  </div>

                  <img
                    src={getTravelImage(`${day.city || day.route || day.title} travel`, 420, 280)}
                    alt={day.title}
                    className="h-28 w-full rounded-lg object-cover sm:h-full"
                  />
                </div>
              </div>
            </div>
          ))}
          {dailyPlan.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
              No daily plan returned.
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}
/**
 * Displays donut chart and spending categories.
 */
function BudgetBreakdown({ budgetItems, totalBudget }) {
  return (
    <Panel title="Budget Breakdown">
      <div className="grid items-center gap-6 sm:grid-cols-[220px_1fr]">
        <div className="relative mx-auto h-52 w-52 rounded-full" style={donutStyle(budgetItems)}>
          <div className="absolute inset-14 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
            <p className="text-2xl font-black text-slate-950">${formatNumber(totalBudget)}</p>
            <p className="text-xs text-slate-500">Total Budget</p>
          </div>
        </div>
        <div className="space-y-4">
          {budgetItems.map((item, index) => (
            <div key={item.name} className="grid grid-cols-[14px_1fr_auto] items-center gap-3 text-sm">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: budgetColors[index % budgetColors.length] }}
              />
              <span className="font-semibold text-slate-800">{item.label}</span>
              <span className="text-slate-500">
                ${formatNumber(item.value)} ({item.percent}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
/**
 * Hotel recommendations section.
 */
function HotelHighlights({ hotels }) {
  return (
    <Panel
      title="Hotel Highlights"
      action={`${hotels.length || 0} Hotels Selected`}
      compact
    >
      <div className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
        {hotels.slice(0, 4).map((hotel, index) => (
          <div key={`${hotel.name}-${index}`} className="grid grid-cols-[88px_1fr_auto] gap-4 bg-white p-3">
            <img
              src={getTravelImage(`${hotel.name || hotel.area} hotel room`, 240, 180)}
              alt={hotel.name}
              className="h-16 w-20 rounded-md object-cover"
            />
            <div className="min-w-0">
              <h4 className="truncate text-sm font-black text-slate-950">{hotel.name}</h4>
              <div className="flex items-center gap-1 text-xs text-blue-500">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    className="h-3 w-3 fill-amber-400 text-amber-400"
                  />
                ))}
                <span>Excellent</span>
              </div>
              <p className="truncate text-sm text-slate-500">{hotel.area}</p>
            </div>
            <p className="self-center text-right text-sm font-black text-blue-600">
              ${hotel.estimatedNightlyCost || 0}
              <span className="block text-xs font-medium text-slate-500">/night</span>
            </p>
          </div>
        ))}
        {hotels.length === 0 && (
          <p className="bg-slate-50 p-4 text-sm text-slate-500">No hotels returned.</p>
        )}
      </div>
    </Panel>
  );
}
/**
 * Restaurant recommendations section.
 */
function RestaurantPanel({ restaurants }) {
  const normalized = normalizeList(restaurants);

  return (
    <Panel title="Restaurant Recommendations" compact>
      <div className="space-y-3">
        {normalized.slice(0, 4).map((restaurant, index) => {
          const text = renderListText(restaurant);
          return (
            <div key={`${text}-${index}`} className="grid grid-cols-[54px_1fr_auto] gap-3">
              <img
                src={getTravelImage(`${text} food`, 160, 160)}
                alt=""
                className="h-12 w-12 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-950">{getName(restaurant)}</p>
                <p className="truncate text-xs text-slate-500">{getDetail(restaurant)}</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {getRating(restaurant, index)}
              </div>
            </div>
          );
        })}
        {normalized.length === 0 && (
          <p className="text-sm text-slate-500">No restaurants returned.</p>
        )}
      </div>
    </Panel>
  );
}

function SimplePanel({ title, items, fallback, iconMap }) {
  return (
    <Panel title={title} compact>
      <div className="space-y-2">
        {items.slice(0, 7).map((item, index) => {
          const Icon = iconMap[index % iconMap.length];
          return (
            <div key={`${renderListText(item)}-${index}`} className="flex items-center gap-3 text-sm text-slate-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50">
                <Icon className="h-3.5 w-3.5 text-blue-600" />
              </span>
              <span className="truncate">{renderListText(item)}</span>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-sm text-slate-500">{fallback}</p>}
      </div>
    </Panel>
  );
}

function WeatherPanel({ weather, cities }) {
  const rows = getWeatherRows(weather, cities);

  return (
    <Panel title="Weather Overview" compact>
      <div className="divide-y divide-slate-100">
        {rows.slice(0, 5).map((row, index) => (
          <div key={`${row.city}-${index}`} className="grid grid-cols-[1fr_auto_28px] items-center gap-3 py-2 text-sm">
            <span className="font-medium text-slate-800">{row.city}</span>
            <span className="text-slate-500">{row.detail}</span>
            <Sun className="h-5 w-5 text-amber-400" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function EmergencyPanel({ contacts }) {
  const items = normalizeList(contacts);

  return (
    <Panel title="Emergency Numbers" compact tone="danger">
      <div className="space-y-4">
        {(items.length ? items : ["Police: 110", "Ambulance: 119", "Tourist Helpline: Local tourism office"]).map(
          (item, index) => {
            const [label, value] = splitContact(item);
            return (
              <div key={`${label}-${index}`} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-700">{label}</span>
                <span className="text-right font-bold text-red-600">{value}</span>
              </div>
            );
          }
        )}
      </div>
    </Panel>
  );
}

function TripSummary({ trip, totalBudget, hotelCount, onSave, saving }) {
  return (
    <div className="grid gap-4 border-t border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px_320px] md:items-center">
      <div>
        <h3 className="text-sm font-black uppercase text-slate-950">Trip Summary</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{trip.summary}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> {trip.days || 0} Days
          </span>
          <span className="flex items-center gap-1.5">
            <Hotel className="h-4 w-4" /> {hotelCount || 0} Hotels
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {(trip.dailyPlan || []).length} Days Planned
          </span>
        </div>
      </div>

      <div className="border-slate-200 md:border-l md:pl-8">
        <p className="text-xs font-bold uppercase text-slate-500">Total Budget</p>
        <p className="text-3xl font-black text-emerald-600">${formatNumber(totalBudget)}</p>
        <p className="text-sm text-slate-500">Per Person</p>
      </div>

      <button
        type="button"
        onClick={() => onSave(trip)}
        disabled={saving}
        className="flex h-16 items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-blue-600 to-fuchsia-500 px-6 text-base font-black text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] disabled:opacity-60"
      >
        <Bookmark className="h-5 w-5" />
        <span>
          {saving ? "Saving This Trip..." : "Save This Trip"}
          <span className="block text-xs font-medium text-white/90">Add to My Trips</span>
        </span>
      </button>
    </div>
  );
}

function Panel({ title, action, compact = false, tone, children }) {
  const toneClass =
    tone === "danger"
      ? "border-red-100 bg-red-50/45"
      : "border-slate-200 bg-white";

  return (
    <section className={`rounded-lg border ${toneClass} ${compact ? "p-5" : "p-6"} shadow-sm`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-950">{title}</h3>
        {action && <span className="text-sm font-semibold text-slate-500">{action}</span>}
      </div>
      {children}
    </section>
  );
}
// Extract unique cities from trip data
function getCities(trip) {
  const cities = trip.cities?.length
    ? trip.cities
    : (trip.dailyPlan || []).map((day) => day.city || day.route).filter(Boolean);

  return [...new Set(cities)].filter(Boolean);
}
// Generate trip tags if none are provided
function getTags(trip) {
  return trip.tags?.length ? trip.tags : ["Cultural", "Adventure", "Scenic", "Food"];
}
// Prepare budget data for chart rendering
function getBudgetItems(budgetBreakdown = {}, totalBudget) {
  const entries = Object.entries(budgetBreakdown || {}).filter(([, value]) => Number(value) > 0);
  const usableEntries = entries.length
    ? entries
    : [
        ["flight", Math.round(totalBudget * 0.32)],
        ["hotel", Math.round(totalBudget * 0.34)],
        ["food", Math.round(totalBudget * 0.16)],
        ["transport", Math.round(totalBudget * 0.1)],
        ["activities", Math.round(totalBudget * 0.08)],
      ];

  const total = usableEntries.reduce((sum, [, value]) => sum + Number(value || 0), 0) || totalBudget || 1;

  return usableEntries.map(([name, value]) => ({
    name,
    label: titleCase(name),
    value: Number(value || 0),
    percent: Math.round((Number(value || 0) / total) * 100),
  }));
}
// Generate CSS conic-gradient for donut chart
function donutStyle(items) {
  let cursor = 0;
  const stops = items.map((item, index) => {
    const start = cursor;
    cursor += item.percent;
    const color = budgetColors[index % budgetColors.length];
    return `${color} ${start}% ${cursor}%`;
  });

  return { background: `conic-gradient(${stops.join(", ")})` };
}
// Normalize object/string/array data into array format
function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return Object.entries(value).map(([key, itemValue]) => `${titleCase(key)}: ${itemValue}`);
}

function renderListText(item) {
  if (typeof item === "string") return item;
  if (Array.isArray(item)) return `${item[0]}: ${item[1]}`;
  return Object.entries(item)
    .map(([key, value]) => `${titleCase(key)}: ${value}`)
    .join(", ");
}

function getName(item) {
  if (typeof item === "string") return item.split(",")[0].split(":")[0];
  return item.name || item.restaurant || item.place || renderListText(item);
}

function getDetail(item) {
  if (typeof item === "string") return item.split(",").slice(1).join(",").trim() || "Local favorite";
  return [item.city, item.type || item.cuisine || item.area].filter(Boolean).join(" - ") || "Recommended stop";
}

function getRating(item, index) {
  if (typeof item === "object" && item?.rating) return item.rating;
  return (4.8 - index * 0.1).toFixed(1);
}

function getWeatherRows(weather, cities) {
  if (Array.isArray(weather)) {
    return weather.map((item, index) => ({
      city: item.city || cities[index] || `Day ${index + 1}`,
      detail: item.temperature || item.forecast || item.condition || renderListText(item),
    }));
  }

  if (weather && typeof weather === "object") {
    return Object.entries(weather).map(([city, detail]) => ({
      city: titleCase(city),
      detail: typeof detail === "string" ? detail : renderListText(detail),
    }));
  }

  return (cities.length ? cities : ["Destination"]).map((city, index) => ({
    city,
    detail: `${20 + index}C - ${28 + index}C`,
  }));
}

function splitContact(item) {
  const text = renderListText(item);
  const parts = text.split(":");
  if (parts.length < 2) return ["Contact", text];
  return [parts[0], parts.slice(1).join(":").trim()];
}
// Convert camelCase or snake_case text to Title Case
function titleCase(value) {
  return String(value)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}
// Format numbers with commas
function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US");
}

