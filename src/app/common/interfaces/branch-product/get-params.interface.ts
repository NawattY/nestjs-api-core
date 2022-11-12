export interface GetParamsInterface {
  page?: number;
  perPage?: number;
  filters?: {
    categoryId: number;
    search: string;
  };
}
