export interface ApiResponse {
  status: 'failed' | 'error' | 'success';
  message: string;
  data: any;
}
