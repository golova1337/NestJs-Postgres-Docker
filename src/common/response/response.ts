export type Result<T> = {
  data?: T;
  meta?: object;
};

export interface CommonResponse<T> {
  status: true;
  error: false;
  message: 'Success';
  meta: object;
  data: T;
}

export class Response {
  static succsessfully<T>(result: Result<T>): CommonResponse<T> {
    return {
      status: true,
      error: false,
      message: 'Success',
      meta: result.meta || {},
      data: result.data,
    };
  }
}
