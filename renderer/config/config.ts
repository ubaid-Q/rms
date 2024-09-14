export const config = {
  host: 'localhost',
  apiHost: 'http://localhost:5000',
  get baseUrl() {
    return `${this.apiHost}/api`;
  },
  setApiHost(ip) {
    this.apiHost = `http://${ip}:5000`;
    console.log(this.apiHost);
  },
};
