import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.js";
import { fetchEvents } from "../../util/http.js";
import { EventItemType, FetchError } from "../../types.js";
export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery<
    EventItemType[],
    FetchError
  >({
    queryKey: ["events"],
    //RQ by default passes some data when function must has some arg, and we assign like this: queryFn: fetchEvents,
    queryFn: fetchEvents,
    //-this controls after which time react will send such a behind the seens request,'
    //  to get updated data, if it find in your cache
    //-it is like a timeout, after whihc request will be send by react
    staleTime: 1000,
    //-how long data it the cache will be kept around
    // gcTime:30000
  });
  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
