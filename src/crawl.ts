import { getURLsFromHTML, normalizeURL } from './helpers/urlHelpers'
import { MetaDescriptions, MetaKeywords, MetaTitles, Page } from './types'
export default async function crawlPage({
  baseURL,
  currentURL,
  pages,
}: {
  baseURL: string
  currentURL: string
  pages: Page[]
}) {
  const baseURLObj = new URL(baseURL)
  const currentURLObj = new URL(currentURL)

  let currentPages = structuredClone(pages)

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return currentPages
  }

  const normalizeCurrentURL = normalizeURL(currentURL)

  const currentPage = currentPages.find((page) => {
    return page.url === normalizeCurrentURL
  })

  if (currentPage) {
    currentPage.hits = currentPage.hits + 1
  } else {
    console.log(`Crawling: ${currentURL}`)
    try {
      const start = Date.now()
      const resp = await fetch(currentURL)
      const secSpent = (Date.now() - start) / 1000 // <---
      const contentType = resp.headers.get('content-type')

      if (resp.status > 399) {
        console.error(
          `Error in fetch on page ${currentURL} with status ${resp.status} `
        )
        currentPages.push({
          url: normalizeCurrentURL,
          hits: 1,
          titles: {} as MetaTitles,
          descriptions: {} as MetaDescriptions,
          keywords: {} as MetaKeywords,
          status: resp.status,
          contentType: contentType as string,
          time: secSpent,
        })
        return currentPages
      }

      if (!contentType?.includes('text/html')) {
        console.error(
          `Non html response on page ${currentURL}. Content type: ${contentType} `
        )
        // return currentPages
        currentPages.push({
          url: normalizeCurrentURL,
          hits: 1,
          titles: {} as MetaTitles,
          descriptions: {} as MetaDescriptions,
          keywords: {} as MetaKeywords,
          status: resp.status,
          contentType: contentType as string,
          time: secSpent,
        })
        return currentPages
      }

      const htmlBody = await resp.text()
      const parsedData = getURLsFromHTML(htmlBody, baseURL)

      currentPages.push({
        url: normalizeCurrentURL,
        hits: 1,
        titles: parsedData.metaTitles,
        descriptions: parsedData.metaDescriptions,
        keywords: parsedData.metaKeywords,
        status: resp.status,
        contentType: contentType as string,
        time: secSpent,
      })

      for (const nextUrl of parsedData.urls) {
        currentPages = await crawlPage({
          baseURL,
          currentURL: nextUrl,
          pages: currentPages,
        })
      }
    } catch (error) {
      console.error(
        `Error occured while crawling on page ${currentURL}: ${
          (error as Error).message
        }`
      )
    }
  }
  return currentPages
}
