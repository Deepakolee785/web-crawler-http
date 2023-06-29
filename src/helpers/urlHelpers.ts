import { JSDOM } from 'jsdom'
import { MetaDescriptions, MetaKeywords, MetaTitles } from '../types'

function normalizeURL(urlString: string) {
  const urlObj = new URL(urlString)
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`

  // Remove trailing slash if it exists
  if (hostPath.length && hostPath.at(-1) === '/') {
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

const getContentFromProperty = (
  document: Document,
  property: `${string}="${string}"`
) => {
  return document.querySelector(`meta[${property}]`)?.getAttribute('content')
}

export const getTitleFromDocument = (document: Document): MetaTitles => {
  const title = document.querySelector('title')?.text
  const og_title = document
    .querySelector('meta[property="og:title"]')
    ?.getAttribute('content')
  const twitter_title = document
    .querySelector('meta[name="twitter:title"]')
    ?.getAttribute('content')
  const item_title = document
    .querySelector('meta[itemprop="name"]')
    ?.getAttribute('content')

  return { title, twitter_title, og_title, item_title }
}

const getDescriptionFromDocument = (document: Document): MetaDescriptions => {
  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute('content')
  const og_description = document
    .querySelector('meta[property="og:description"]')
    ?.getAttribute('content')
  const twitter_description = document
    .querySelector('meta[name="twitter:description"]')
    ?.getAttribute('content')
  const item_description = document
    .querySelector('meta[itemprop="description"]')
    ?.getAttribute('content')
  return {
    description,
    og_description,
    twitter_description,
    item_description,
  }
}
function getMetaKeywords(document: Document): MetaKeywords {
  const keywords = document
    .querySelector('meta[name="keywords"]')
    ?.getAttribute('content')
  return keywords
}

function getURLsFromHTML(
  htmlBody: string,
  baseURL: string
): {
  urls: string[]
  metaTitles: MetaTitles[]
  metaDescriptions: MetaDescriptions[]
  metaKeywords: MetaKeywords[]
} {
  const urls = new Set<string>([])
  const metaTitles: MetaTitles[] = []
  const metaDescriptions: MetaDescriptions[] = []
  const metaKeywords: MetaKeywords[] = []

  const dom = new JSDOM(htmlBody)
  const anchorTags: NodeListOf<HTMLAnchorElement> =
    dom.window.document.querySelectorAll('a')

  for (const anchorTag of anchorTags) {
    const url = anchorTag.href
    let urlObj

    // For relative urls
    if (url.startsWith('/')) urlObj = parseURL(`${baseURL}${url}`)
    else urlObj = parseURL(url)

    urlObj && urls.add(urlObj.href)
  }

  const titles = getTitleFromDocument(dom.window.document)
  const descriptions = getDescriptionFromDocument(dom.window.document)
  const keywords = getMetaKeywords(dom.window.document)

  metaTitles.push(titles)
  metaDescriptions.push(descriptions)
  metaKeywords.push(keywords)

  return { urls: [...urls], metaTitles, metaDescriptions, metaKeywords }
}

export { normalizeURL, getURLsFromHTML }
