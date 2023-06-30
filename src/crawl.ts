import { getURLsFromHTML, normalizeURL } from './helpers/urlHelpers'
import { Page } from './types'

export default async function crawlPage({
  baseURL,
  currentURL,
  pages,
}: {
  baseURL: string
  currentURL: string
  pages: Page[]
}): Promise<Page[]> {
  const baseURLObj = new URL(baseURL)
  const currentURLObj = new URL(currentURL)

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages
  }

  const normalizeCurrentURL = normalizeURL(currentURL)

  let currentPage = pages.find((page) => page.url === normalizeCurrentURL)

  if (currentPage) {
    currentPage.hits++
  } else {
    console.log(`Crawling: ${currentURL}`)
    try {
      const start = Date.now()
      const resp = await fetch(currentURL)
      const secSpent = (Date.now() - start) / 1000
      const contentType = resp.headers.get('content-type')

      if (resp.status > 399) {
        console.error(
          `Error in fetch on page ${currentURL} with status ${resp.status}`
        )
      }

      if (!contentType?.includes('text/html')) {
        console.error(
          `Non html response on page ${currentURL}. Content type: ${contentType}`
        )
      }

      const htmlBody = await resp.text()
      const parsedData = getURLsFromHTML(htmlBody, baseURL)

      currentPage = {
        url: normalizeCurrentURL,
        hits: 1,
        titles: parsedData.metaTitles,
        descriptions: parsedData.metaDescriptions,
        keywords: parsedData.metaKeywords,
        status: resp.status,
        contentType: contentType || '',
        time: secSpent,
      }

      pages.push(currentPage)

      for (const nextUrl of parsedData.urls) {
        pages = await crawlPage({
          baseURL,
          currentURL: nextUrl,
          pages,
        })
      }
    } catch (error) {
      console.error(
        `Error occurred while crawling on page ${currentURL}: ${
          (error as Error).message
        }`
      )
    }
  }

  return pages
}
