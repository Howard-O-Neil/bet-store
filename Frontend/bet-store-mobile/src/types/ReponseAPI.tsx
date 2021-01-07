export interface ReponseAPI<T> {
  status: number;
  message: string;
  data: T;
}

export interface Messenger {
  message: string;
}
