import ReactionElements from './reactions'
import MessageTypes from './message-types'
import WebRequestCache from './web-request-cache'

const cache = new WebRequestCache({
  Accept: 'application/vnd.github.squirrel-girl-preview+json',
  'User-Agent': 'request',
})

function aggregateReactions(reactions) {
  if (reactions == null || reactions.length === 0) {
    return {
      thumbUp: 0,
      thumbDown: 0,
    }
  }

  let thumbUp = 0
  let thumbDown = 0

  reactions.forEach((reaction) => {
    switch (reaction.content) {
      case '+1':
        thumbUp += 1
        break
      case '-1':
        thumbDown += 1
        break
      default:
        break
    }
  })

  return {
    thumbUp,
    thumbDown,
  }
}

function processIssues() {
  if (!document.location.pathname.endsWith('issues')) return

  const issueElements = document.querySelectorAll('a[data-hovercard-type="issue"]')
  issueElements.forEach((issueElement) => {
    const issueUrl = `https://api.github.com/repos${issueElement.pathname}/reactions`
    cache.getOrRequest(issueUrl)
      .then((reactions) => {
        const agg = aggregateReactions(reactions)
        issueElement.innerHTML = `[${ReactionElements.thumbUp}: ${agg.thumbUp}, ${ReactionElements.thumbDown}: ${agg.thumbDown}] ${issueElement.innerHTML}`
      })
      .catch((err) => console.log(`Error occurs in the GitHub Reactions Extension - ${err}`))
  })
}

window.addEventListener('load', () => {
  processIssues()
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.type !== MessageTypes.UrlChanged) return
  processIssues()
})
