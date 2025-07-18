import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal.js";
import EventForm from "./EventForm.js";
import { FormDataType } from "../../types.js";

export default function NewEvent() {
  const navigate = useNavigate();

  function handleSubmit(formData: FormDataType) {}

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>
      </EventForm>
    </Modal>
  );
}
