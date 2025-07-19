import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.js";
import { fetchEvents } from "../../util/http.js";
import { EventItemType, FetchError } from "../../types.js";
export default function NewEventsSection() {
  //-behind the seens send an http request
  // get us this event data that we need,
  // and also give info about state (loadetnd etc.)

  //-if we use error, we must make sure that our http function throws an error
  const { data, isPending, isError, error } = useQuery<
    EventItemType[],
    FetchError
  >({
    //-every get http request should have a key
    // which then internally be used by tanstack to cache
    // so that response could be re used in the future if you are trying to send the same request again

    //-takes an array of values which are then internally stored,
    // such that whenever you are using a similar array of similar values
    // react query sees, and is able to reuse this data
    queryKey: ["events"],
    //needs a function which returns a promise
    queryFn: fetchEvents,
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
