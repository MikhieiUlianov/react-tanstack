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

export type FetchError = Error & {
  code?: number;
  info?: { message?: string };
};
