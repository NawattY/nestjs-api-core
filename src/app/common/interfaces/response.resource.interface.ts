export interface IResponseResource<T> {
  data?: T | T[];
  meta?: any;
  status?: any;
}
