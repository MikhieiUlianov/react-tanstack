import { EventItemType, FetchError } from "../types";
type FetchEventsProps = {
  searchTerm?: string;
  signal?: AbortSignal;
};
export async function fetchEvents({
  signal,
  searchTerm,
}: FetchEventsProps): Promise<EventItemType[]> {
  let url = "http://localhost:3000/events";

  if (searchTerm) {
    url += "?search=" + searchTerm;
  }
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the events"
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}
