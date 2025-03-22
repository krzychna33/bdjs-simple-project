export class ApiResponse<T> {
  public data!: T;
  public status!: number;
  public message?: string;

}
