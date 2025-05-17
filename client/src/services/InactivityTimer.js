// InactivityTimer.js - Service to handle user inactivity
export default class InactivityTimer {
  constructor(timeout, logoutCallback) {
    this.timeout = timeout;
    this.logoutCallback = logoutCallback;
    this.timer = null;
    this.events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Bind the resetTimer method to this instance
    this.resetTimer = this.resetTimer.bind(this);
  }

  // Start listening for user activity
  startTimer() {
    // Add event listeners
    this.events.forEach(event => {
      window.addEventListener(event, this.resetTimer);
    });
    
    // Initialize the timer
    this.resetTimer();
  }

  // Reset the inactivity timer
  resetTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    
    this.timer = setTimeout(() => {
      // Call the logout callback when time expires
      this.logoutCallback();
    }, this.timeout);
  }

  // Stop the timer and remove event listeners
  stopTimer() {
    // Clear the timeout
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    // Remove event listeners
    this.events.forEach(event => {
      window.removeEventListener(event, this.resetTimer);
    });
  }
}