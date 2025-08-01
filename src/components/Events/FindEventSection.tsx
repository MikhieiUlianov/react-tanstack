import { useQuery } from "@tanstack/react-query";
import { FormEvent, useRef, useState } from "react";
import { fetchEvents } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import { EventItemType, FetchError } from "../../types";
import EventItem from "./EventItem";

export default function FindEventSection() {
  const searchElement = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchTerm(searchElement.current?.value!);
  }
  //"isLoading" will not be true if disabled is true
  const { data, isLoading, isError, error } = useQuery<
    EventItemType[],
    FetchError
  >({
    queryKey: ["events", { search: searchTerm }],
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),
    enabled: searchTerm !== undefined,
  });

  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading) content = <LoadingIndicator />;

  if (isError)
    content = (
      <ErrorBlock
        title="an error occured"
        message={error.info?.message || "failed to fetche events"}
      />
    );

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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
