import MessageTypes from './message-types'
import ActionStates from './action-states'

let actionEnabled = false
let currentUrl

function setActonBadge(enabled) {
  const { text, color } = (enabled ? ActionStates.enabled : ActionStates.disabled)

  chrome.action.setBadgeText({ text })
  chrome.action.setBadgeBackgroundColor({ color })
}

chrome.runtime.onInstalled.addListener(() => {
  setActonBadge(actionEnabled)
})

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    if (!actionEnabled) return
    chrome.tabs.sendMessage(details.tabId, { type: MessageTypes.ProcessIssues })
  },
  {
    urls: ['https://github.com/*/*/issues'],
  },
)

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    const { tabId, url } = details

    if (details.transitionQualifiers.length > 0 || url !== currentUrl) {
      currentUrl = details.url
      return
    }

    if (!actionEnabled) return
    chrome.tabs.sendMessage(tabId, { type: MessageTypes.ProcessIssues })
  },
  {
    urls: ['https://github.com/*/*/issues'],
  },
)

chrome.action.onClicked.addListener(
  (tab) => {
    actionEnabled = !actionEnabled
    setActonBadge(actionEnabled)

    if (!actionEnabled) return
    chrome.tabs.sendMessage(tab.id, { type: MessageTypes.ProcessIssues, enabled: actionEnabled })
  },
)
