import { getURLsFromHTML, normalizeURL } from './helpers/urlHelpers'
import { PagesType, MetaDescriptions, MetaKeywords, MetaTitles } from './types'

type CrawlPageArgs = {
  baseURL: string
  currentURL: string
  pages: PagesType
  data: {
    metaTitles: MetaTitles[]
    metaDescriptions: MetaDescriptions[]
    metaKeywords: MetaKeywords[]
  }
}

async function crawlPage({ baseURL, currentURL, pages, data }: CrawlPageArgs) {
  const baseURLObj = new URL(baseURL)
  const currentURLObj = new URL(currentURL)

  let newPages = structuredClone(pages)
  let newData = structuredClone(data)

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return { pages: newPages, data: newData }
  }

  const normalizeCurrentURL = normalizeURL(currentURL)

  if (newPages[normalizeCurrentURL] > 0) {
    newPages[normalizeCurrentURL]++
    return { pages: newPages, data: newData }
  }

  newPages[normalizeCurrentURL] = 1

  console.log(`Crawling: ${currentURL}`)
  try {
    const resp = await fetch(currentURL)

    if (resp.status > 399) {
      console.error(
        `Error in fetch on page ${currentURL} with status ${resp.status} `
      )
      return { pages: newPages, data: newData }
    }

    const contentType = resp.headers.get('content-type')
    if (!contentType?.includes('text/html')) {
      console.error(
        `Non html response on page ${currentURL}. Content type: ${contentType} `
      )
      return { pages: newPages, data: newData }
    }
    const htmlBody = await resp.text()
    const data = getURLsFromHTML(htmlBody, baseURL)
    newData.metaTitles.push(...data.metaTitles)
    newData.metaDescriptions.push(...data.metaDescriptions)
    newData.metaKeywords.push(...data.metaKeywords)
    const nextUrls = data.urls
    for (const nextUrl of nextUrls) {
      const { pages, data } = await crawlPage({
        baseURL,
        currentURL: nextUrl,
        pages: newPages,
        data: newData,
      })
      newPages = pages
      newData = data
    }
  } catch (error) {
    console.error(
      `Error occured while crawling on page ${currentURL}: ${
        (error as Error).message
      }`
    )
  }
  return { pages: newPages, data: newData }
}
export default crawlPage
