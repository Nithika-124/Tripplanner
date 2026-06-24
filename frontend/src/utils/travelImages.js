const TRAVEL_IMAGES = [
  {
    keywords: ["japan", "tokyo", "kyoto", "osaka", "nara", "fuji"],
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
  },
  {
    keywords: ["sri lanka", "colombo", "kandy", "galle", "sigiriya", "ella"],
    url: "https://images.unsplash.com/photo-1586185119123-55f9e64235c1",
  },
  {
    keywords: ["bali", "indonesia"],
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
  },
  {
    keywords: ["maldives", "beach", "island", "coast"],
    url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
  },
  {
    keywords: ["thailand", "bangkok", "phuket", "chiang mai"],
    url: "https://images.unsplash.com/photo-1528181304800-259b08848526",
  },
  {
    keywords: ["india", "delhi", "agra", "jaipur", "taj mahal"],
    url: "https://images.unsplash.com/photo-1548013146-72479768bada",
  },
  {
    keywords: ["singapore"],
    url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
  },
  {
    keywords: ["city", "urban", "downtown"],
    url: "https://images.unsplash.com/photo-1444723121867-7a241cacace9",
  },
  {
    keywords: ["mountain", "nature", "hiking", "scenic"],
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    keywords: ["food", "restaurant", "cuisine"],
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  },
  {
    keywords: ["hotel", "room", "resort", "stay"],
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },
];

export const fallbackTravelImage =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop&auto=format";

export function getTravelImage(query, width = 1200, height = 800) {
  const normalizedQuery = String(query || "").toLowerCase();
  const match = TRAVEL_IMAGES.find((image) =>
    image.keywords.some((keyword) => normalizedQuery.includes(keyword))
  );

  const baseUrl = match?.url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e";
  return `${baseUrl}?w=${width}&h=${height}&fit=crop&auto=format`;
}

export function isBadImageUrl(url) {
  return (
    !url ||
    typeof url !== "string" ||
    url.includes("source.unsplash.com") ||
    url.includes("images.unsplash.com/featured") ||
    url.includes("image.pollinations.ai")
  );
}
