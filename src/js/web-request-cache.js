const cacheExpirationTimeoutInSeconds = 60

export default class WebRequestCache {
  constructor(requestHeaders) {
    this.cache = {}
    this.headers = requestHeaders
  }

  getOrRequest(url) {
    if (!Object.prototype.hasOwnProperty.call(this.cache, url)
      || (Date.now() - this.cache[url].timestamp > cacheExpirationTimeoutInSeconds * 1000)) {
      return fetch(url, { headers: this.headers })
        .then((response) => response.json())
        .then((data) => {
          this.cache[url] = {
            reactions: data,
            timestamp: Date.now(),
          }
          return data
        })
    }

    return Promise.resolve(this.cache[url].reactions)
  }
}
