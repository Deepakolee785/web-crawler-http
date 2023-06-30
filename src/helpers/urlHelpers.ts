import { JSDOM } from 'jsdom'
import { MetaDescriptions, MetaKeywords, MetaTitles } from '../types'

function normalizeURL(urlString: string) {
  const urlObj = new URL(urlString)
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`

  // Remove trailing slash if it exists
  if (hostPath.endsWith('/')) {
    return hostPath.slice(0, -1)
  }
  return hostPath
}

function parseURL(urlString: string) {
  try {
    return new URL(urlString)
  } catch (error) {
    console.log(`Error with url - '${urlString}' =>`, (error as Error).message)
  }
}

export const getMetaTagContent = (
  document: Document,
  selector: string
): string | undefined | null => {
  const element = document.querySelector(selector)
  return element?.getAttribute('content')
}

export const getTitleFromDocument = (document: Document): MetaTitles => {
  const title = document.querySelector('title')?.text

  return {
    title,
    og_title: getMetaTagContent(document, 'meta[property="og:title"]'),
    twitter_title: getMetaTagContent(document, 'meta[name="twitter:title"]'),
    item_title: getMetaTagContent(document, 'meta[itemprop="name"]'),
  }
}

export const getDescriptionFromDocument = (
  document: Document
): MetaDescriptions => {
  return {
    description: getMetaTagContent(document, 'meta[name="description"]'),
    og_description: getMetaTagContent(
      document,
      'meta[property="og:description"]'
    ),
    twitter_description: getMetaTagContent(
      document,
      'meta[name="twitter:description"]'
    ),
    item_description: getMetaTagContent(
      document,
      'meta[itemprop="description"]'
    ),
  }
}
export const getMetaKeywords = (document: Document): MetaKeywords => {
  return getMetaTagContent(document, 'meta[name="keywords"]')
}

function getURLsFromHTML(
  htmlBody: string,
  baseURL: string
): {
  urls: string[]
  metaTitles: MetaTitles
  metaDescriptions: MetaDescriptions
  metaKeywords: MetaKeywords
} {
  const urls = new Set<string>([])
  const dom = new JSDOM(htmlBody)
  const anchorTags: NodeListOf<HTMLAnchorElement> =
    dom.window.document.querySelectorAll('a')

  for (const anchorTag of anchorTags) {
    const url = anchorTag.href
    // check relative urls
    let urlObj = parseURL(url.startsWith('/') ? `${baseURL}${url}` : url)

    if (urlObj) {
      urls.add(urlObj.href)
    }
  }

  const titles = getTitleFromDocument(dom.window.document)
  const descriptions = getDescriptionFromDocument(dom.window.document)
  const keywords = getMetaKeywords(dom.window.document)

  return {
    urls: Array.from(urls),
    metaTitles: titles,
    metaDescriptions: descriptions,
    metaKeywords: keywords,
  }
}

export { normalizeURL, getURLsFromHTML }
