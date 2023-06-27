import { JSDOM } from 'jsdom'

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

function getURLsFromHTML(htmlBody: string, baseURL: string): string[] {
  const urls = new Set<string>([])

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
  return [...urls]
}

export { normalizeURL, getURLsFromHTML }
