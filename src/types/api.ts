export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
