import { AxiosInstance } from 'axios';
import { api } from 'boot/axios';

export class HttpBasedService {
  protected httpClient: AxiosInstance;

  constructor() {
    this.httpClient = api;
  }
}
