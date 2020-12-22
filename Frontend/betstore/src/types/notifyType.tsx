export interface NotifyTypes {
  notifies: NotifyType[];
}

export interface NotifyType {
  path: string;
  title: string;
  destination: string;
}
