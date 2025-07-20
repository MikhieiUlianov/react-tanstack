import { EventItemType, FetchError, FormDataType } from "../types";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

type FetchEventsProps = {
  searchTerm?: string;
  signal?: AbortSignal;
};
export async function fetchEvents({
  signal,
  searchTerm,
}: FetchEventsProps): Promise<EventItemType[]> {
  console.log(searchTerm);
  let url = "http://localhost:3000/events";

  if (searchTerm) {
    url += "?search=" + searchTerm;
  }

  const response = await fetch(url, { signal: signal });

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

export async function createNewEvent(eventData: { event: FormDataType }) {
  const response = await fetch(`http://localhost:3000/events`, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while creating the event"
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function fetchSelectableImages({
  signal,
}: {
  signal: AbortSignal;
}) {
  const response = await fetch(`http://localhost:3000/events/images`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the images"
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}

export async function fetchEvent({
  id,
  signal,
}: {
  id: string;
  signal: AbortSignal;
}) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the event"
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function deleteEvent({ id }: { id: string }): Promise<string> {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while deleting the event"
    ) as FetchError;
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
