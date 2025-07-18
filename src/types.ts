export type FormDataType = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
};

export type EventItemType = {
  id: string;
  image: string;
} & FormDataType;
