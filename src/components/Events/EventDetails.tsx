import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.js";
import ErrorBlock from "../UI/ErrorBlock.js";
import { EventItemType, FetchError } from "../../types.js";
import { useState } from "react";
import Modal from "../UI/Modal.js";

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery<
    EventItemType,
    FetchError
  >({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id: id!, signal }),
  });

  const {
    mutate,
    isPending: isPendingMutation,
    isError: isErrorMutation,
    error: errorMutation,
  } = useMutation<string, FetchError, { id: string }>({
    mutationFn: () => deleteEvent({ id: id! }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        //to make events invalidated, but not to trigger rerender immediatelly, but when it is required
        refetchType: "none",
      });
      navigate("/events");
    },
  });

  function handleStartDeleting() {
    setIsDeleting(true);
  }
  function handleStopDeleting() {
    setIsDeleting(false);
  }

  function handleDelete(id: string) {
    mutate({ id });
  }
  let formattedDate = "";

  if (data?.date) {
    formattedDate = new Date(data.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDeleting}>
          <h2>Are you sure?</h2>
          <p>Do you realy want to delete?</p>

          {isPendingMutation && <LoadingIndicator />}
          {isErrorMutation && (
            <ErrorBlock
              title="removing event error occured"
              message={errorMutation.info?.message || "removing error"}
            />
          )}
          {!isPending && (
            <p className="form-actions">
              <button onClick={handleStopDeleting} className="button-text">
                Cancel
              </button>
              <button onClick={() => handleDelete(id!)} className="button">
                Delete
              </button>
            </p>
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          <h1>{data?.title}</h1>
          <nav>
            <button onClick={handleStartDeleting}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        {isPending && <LoadingIndicator />}
        {isError && (
          <ErrorBlock
            title="fetchind event data error"
            message={error.info?.message || "fetching data error"}
          />
        )}
        {!isPending && (
          <div id="event-details-content">
            <img
              src={`http://localhost:3000/${data?.image}`}
              alt={data?.title}
            />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data?.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {formattedDate} @ {data?.time}
                </time>
              </div>
              <p id="event-details-description">{data?.description}</p>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
