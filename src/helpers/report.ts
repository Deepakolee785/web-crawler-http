import { Page } from '../types'
import { exportReport } from './excelReport'

function sortPages(pages: Page[]) {
  const tempPages = structuredClone(pages)
  tempPages.sort((a, b) => {
    return b.hits - a.hits
  })
  return tempPages
}

function printReport(pages: Page[]) {
  console.log('==========\nReport\n==========')
  const sortedPages = sortPages(pages)
  const titles = new Set<string>()
  const descriptions = new Set<string>()
  const keywordList = new Set<string>()
  for (const page of sortedPages) {
    console.log(`Found ${page.hits} links to page: ${page.url}`)
    const title =
      page.titles.og_title ||
      page.titles.title ||
      page.titles.twitter_title ||
      page.titles.item_title
    title && titles.add(title)

    const description =
      page.descriptions.og_description ||
      page.descriptions.description ||
      page.descriptions.twitter_description ||
      page.descriptions.item_description
    description && descriptions.add(description)
    console.log(page.keywords)

    const keywords = (typeof page.keywords === 'object' ? '' : page.keywords)
      ?.split(',')
      ?.filter(Boolean)
    keywords?.length && keywords.forEach((keyword) => keywordList.add(keyword))
  }
  console.log('==========\nSummary\n==========')

  console.log('Titles: ', [...titles])
  console.log('Descriptions: ', [...descriptions])
  console.log('Keywords: ', [...keywordList])

  exportReport({
    pages: sortedPages,
    titles: [...titles],
    descriptions: [...descriptions],
    keywords: [...descriptions],
  })

  console.log('==========\nEnd Report\n==========')
}

export { sortPages, printReport }
