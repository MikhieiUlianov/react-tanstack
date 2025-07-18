import { FormEvent, ReactNode, useState } from "react";

import ImagePicker from "../ImagePicker.js";
import { FormDataType } from "../../types.js";
type ImageType = { image?: string };
type EventData = (FormDataType & ImageType) | null;
/* type EventFormProps = {
  inputData: EventData;
  onSubmit: (data: EventData) => void;
  children: ReactNode;
}; */
type EventFormProps = {
  inputData?: EventData;
  onSubmit: (data: Exclude<EventData, null>) => void;
  children?: ReactNode;
};
export default function EventForm({
  inputData,
  onSubmit,
  children,
}: EventFormProps) {
  const [selectedImage, setSelectedImage] = useState(inputData?.image);

  function handleSelectImage(image: string) {
    setSelectedImage(image);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    onSubmit({
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      time: data.time as string, // should be string, not number from input
      location: data.location as string,
      image: selectedImage,
    });
  }

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      <p className="control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={inputData?.title ?? ""}
        />
      </p>

      <div className="control">
        <ImagePicker
          images={[]}
          onSelect={handleSelectImage}
          selectedImage={selectedImage}
        />
      </div>

      <p className="control">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={inputData?.description ?? ""}
        />
      </p>

      <div className="controls-row">
        <p className="control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={inputData?.date ?? ""}
          />
        </p>

        <p className="control">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            defaultValue={inputData?.time ?? ""}
          />
        </p>
      </div>

      <p className="control">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={inputData?.location ?? ""}
        />
      </p>

      <p className="form-actions">{children}</p>
    </form>
  );
}
