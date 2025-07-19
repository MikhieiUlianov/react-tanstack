import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal.js";
import EventForm from "./EventForm.js";
import { EventItemType, FetchError, FormDataType } from "../../types.js";
import { useMutation } from "@tanstack/react-query";
import { createNewEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.js";
import LoadingIndicator from "../UI/LoadingIndicator.js";

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isError, isPending, error } = useMutation<
    EventItemType,
    FetchError,
    { event: FormDataType }
  >({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });

  function handleSubmit(formData: FormDataType) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && <LoadingIndicator />}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            "Failed tocreate event, Please check your input and try again later"
          }
        />
      )}
    </Modal>
  );
}
