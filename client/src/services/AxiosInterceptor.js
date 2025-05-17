// AxiosInterceptor.js - Handle token expiration and API errors
import axios from 'axios';

export default class AxiosInterceptorService {
  constructor(logoutCallback) {
    this.logoutCallback = logoutCallback;
    this.interceptorId = null;
  }

  setupInterceptors() {
    // Add a response interceptor
    this.interceptorId = axios.interceptors.response.use(
      response => response,
      error => {
        // Check if the error is due to an expired token or authorization issues
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Call the logout callback
          this.logoutCallback();
        }
        return Promise.reject(error);
      }
    );
  }

  removeInterceptors() {
    // Clean up the interceptor
    if (this.interceptorId !== null) {
      axios.interceptors.response.eject(this.interceptorId);
    }
  }
}