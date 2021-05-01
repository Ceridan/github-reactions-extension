import MessageTypes from './message-types'

let currentUrl

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    const { tabId, url } = details
    if (details.transitionQualifiers.length > 0 || url !== currentUrl) {
      currentUrl = details.url
      return
    }
    chrome.tabs.sendMessage(tabId, { type: MessageTypes.UrlChanged, url })
  },
  {
    urls: ['https://github.com/*/*/issues'],
  },
)
