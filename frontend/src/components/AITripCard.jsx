import {
  CalendarDays,
  Eye,
  Heart,
  MapPin,
  Sparkles,
  Wallet,
  Route,
} from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&h=600&fit=crop&auto=format";

export function AITripCard({
  trip,
  onViewDetails,
  onSave,
  saved = false,
}) {
  const image =
    trip.image ||
    trip.coverImage ||
    getUnsplashImage(trip.coverImageQuery);

  const cities = trip.cities?.length
    ? trip.cities
    : (trip.dailyPlan || [])
        .map((day) => day.city)
        .filter(Boolean);

  const tags = trip.tags?.length
    ? trip.tags
    : ["Culture", "Food"];

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >
      {/* HERO IMAGE */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={image || fallbackImage}
          alt={trip.title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Route Badge */}
        <div className="absolute left-4 top-4">
          <span
            className="
              rounded-full
              bg-white/90
              px-4
              py-2
              text-xs
              font-black
              text-slate-900
              backdrop-blur
            "
          >
            {trip.optionType || "AI Route"}
          </span>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(trip);
          }}
          className="
            absolute
            right-4
            top-4
            rounded-full
            bg-white/90
            p-3
            backdrop-blur
            shadow-lg
            transition
            hover:scale-110
          "
        >
          <Heart
            className={`h-5 w-5 ${
              saved
                ? "fill-red-500 text-red-500"
                : "text-red-500"
            }`}
          />
        </button>

        {/* Title */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <h3 className="text-3xl font-black leading-tight">
            {trip.title}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {cities.slice(0, 3).map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1"
              >
                <MapPin className="h-4 w-4" />
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-5 p-5">
        {/* STATS */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-center">
            <CalendarDays className="mx-auto mb-2 h-5 w-5 text-blue-600" />
            <p className="text-xs text-slate-500">
              Duration
            </p>
            <p className="text-lg font-black">
              {trip.days || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-center">
            <Wallet className="mx-auto mb-2 h-5 w-5 text-emerald-600" />
            <p className="text-xs text-slate-500">
              Budget
            </p>
            <p className="text-lg font-black text-blue-600">
              ${trip.totalBudget || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-center">
            <MapPin className="mx-auto mb-2 h-5 w-5 text-purple-600" />
            <p className="text-xs text-slate-500">
              Cities
            </p>
            <p className="text-lg font-black">
              {cities.length}
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div>
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
            {trip.summary ||
              "Explore amazing destinations carefully selected by AI based on your interests, budget and travel style."}
          </p>
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="
                rounded-full
                bg-blue-50
                px-3
                py-2
                text-xs
                font-bold
                text-blue-700
              "
            >
              {tag}
            </span>
          ))}

          <span
            className="
              inline-flex
              items-center
              gap-1
              rounded-full
              bg-amber-50
              px-3
              py-2
              text-xs
              font-bold
              text-amber-600
            "
          >
            <Sparkles className="h-3.5 w-3.5" />
            {trip.rating || 5}.0
          </span>
        </div>

        {/* ROUTE */}
        {cities.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <div className="mb-2 flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-500">
                ROUTE
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
              {cities.slice(0, 4).map((city, index) => (
                <div
                  key={city}
                  className="flex items-center gap-2"
                >
                  <span>{city}</span>

                  {index <
                    Math.min(cities.length, 4) - 1 && (
                    <span className="text-blue-500">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => onViewDetails(trip)}
            className="
              flex-1
              rounded-xl
              bg-slate-900
              py-3
              font-bold
              text-white
              transition
              hover:bg-blue-600
            "
          >
            <span className="flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" />
              View Details
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSave?.(trip)}
            className="
              rounded-xl
              border
              border-slate-200
              px-5
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-50
            "
          >
            Save
          </button>
        </div>
      </div>
    </article>
  );
}

function getUnsplashImage(query) {
  if (!query) return fallbackImage;

  return `https://images.unsplash.com/featured/900x600/?${encodeURIComponent(
    query
  )}`;
}