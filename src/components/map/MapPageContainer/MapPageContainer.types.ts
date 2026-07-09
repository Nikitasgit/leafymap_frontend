export type SearchResult = {
  id: string;
  type: "creator" | "filters" | null;
  eventId?: string | null;
};
