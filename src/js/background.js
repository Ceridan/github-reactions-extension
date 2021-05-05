import ActionStates from './action-states'

let actionEnabled = false
let currentUrl

function setActonBadge(enabled) {
  const { text, color } = (enabled ? ActionStates.enabled : ActionStates.disabled)

  chrome.action.setBadgeText({ text })
  chrome.action.setBadgeBackgroundColor({ color })
}

function injectIssuesTab(tabId) {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ['js/reactions.js'],
    },
  )
}

chrome.runtime.onInstalled.addListener(() => {
  setActonBadge(actionEnabled)
})

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    if (!actionEnabled) return
    injectIssuesTab(details.tabId)
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
    injectIssuesTab(tabId)
  },
  {
    urls: ['https://github.com/*/*/issues'],
  },
)

chrome.action.onClicked.addListener(
  (tab) => {
    actionEnabled = !actionEnabled
    setActonBadge(actionEnabled)

    const url = new URL(tab.url)

    if (!actionEnabled || url.hostname !== 'github.com') return
    injectIssuesTab(tab.id)
  },
)
