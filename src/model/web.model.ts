export class WebResponse<T> {
  data?: T;
  errors?: string;
}

export class PaginationRequest {
  keyword: string;
  page: number;
  limit: number;
  slug?: string;
}
