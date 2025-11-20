export interface SuccessResponse<T> {
  code: number;
  data: T;
  meta?: {
    size: number;
    page: number;
    limit: number;
    totalData: number;
    totalPage: number;
  };
}

export interface ErrorResponse {
  code: number;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}
