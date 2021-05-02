import ReactionElements from './reaction-tags'
import WebRequestCache from './web-request-cache'

const cache = new WebRequestCache({
  Accept: 'application/vnd.github.squirrel-girl-preview+json',
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

export default function processIssueReactions() {
  if (!document.location.pathname.endsWith('issues')) return

  const issueElements = document.querySelectorAll('a[data-hovercard-type="issue"]')
  issueElements.forEach((issueElement) => {
    const issueUrl = `https://api.github.com/repos${issueElement.pathname}/reactions?per_page=100`
    cache.getOrRequest(issueUrl)
      .then((reactions) => {
        const agg = aggregateReactions(reactions)
        const reactionsHtml = `[${ReactionElements.thumbUp}: ${agg.thumbUp}, ${ReactionElements.thumbDown}: ${agg.thumbDown}]`
        if (issueElement.innerHTML.startsWith(reactionsHtml)) return
        issueElement.innerHTML = `${reactionsHtml} ${issueElement.innerHTML}`
      })
      .catch(() => console.log('Rate limits exceeded. More details here: https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting'))
  })
}

processIssueReactions()
