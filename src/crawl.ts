import { getURLsFromHTML, normalizeURL } from './helpers/urlHelpers'
import { PagesType } from './types'

type CrawlPageArgs = {
  baseURL: string
  currentURL: string
  pages: PagesType
}

async function crawlPage({ baseURL, currentURL, pages }: CrawlPageArgs) {
  const baseURLObj = new URL(baseURL)
  const currentURLObj = new URL(currentURL)

  let newPages = structuredClone(pages)

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return newPages
  }

  const normalizeCurrentURL = normalizeURL(currentURL)

  if (newPages[normalizeCurrentURL] > 0) {
    newPages[normalizeCurrentURL]++
    return newPages
  }

  newPages[normalizeCurrentURL] = 1

  console.log(`Crawling: ${currentURL}`)
  try {
    const resp = await fetch(currentURL)

    if (resp.status > 399) {
      console.error(
        `Error in fetch on page ${currentURL} with status ${resp.status} `
      )
      return newPages
    }

    const contentType = resp.headers.get('content-type')
    if (!contentType?.includes('text/html')) {
      console.error(
        `Non html response on page ${currentURL}. Content type: ${contentType} `
      )
      return newPages
    }
    const htmlBody = await resp.text()
    const nextUrls = getURLsFromHTML(htmlBody, baseURL)
    for (const nextUrl of nextUrls) {
      newPages = await crawlPage({
        baseURL,
        currentURL: nextUrl,
        pages: newPages,
      })
    }
  } catch (error) {
    console.error(
      `Error occured while crawling on page ${currentURL}: ${
        (error as Error).message
      }`
    )
  }
  return newPages
}
export default crawlPage
