import { Page } from '../types'
import { exportReport } from './excelReport'

function sortPages(pages: Page[]): Page[] {
  return [...pages].sort((a, b) => b.hits - a.hits)
}

function printReport(pages: Page[]) {
  console.log('==========\nReport\n==========')
  const sortedPages = sortPages(pages)
  const titles = new Set<string>()
  const descriptions = new Set<string>()
  const keywords = new Set<string>()

  for (const page of sortedPages) {
    const { og_title, title, twitter_title, item_title } = page.titles
    const pageTitle = og_title || title || twitter_title || item_title
    if (pageTitle) titles.add(pageTitle)

    const {
      og_description,
      description,
      twitter_description,
      item_description,
    } = page.descriptions
    const pageDescription =
      og_description || description || twitter_description || item_description
    if (pageDescription) descriptions.add(pageDescription)

    if (typeof page.keywords === 'string') {
      const pageKeywords = page.keywords.split(',').filter(Boolean)
      pageKeywords.forEach((keyword) => keywords.add(keyword))
    }
  }

  console.log('==========\nSummary\n==========')
  console.log('Titles:', Array.from(titles))
  console.log('Descriptions:', Array.from(descriptions))
  console.log('Keywords:', Array.from(keywords))

  exportReport({
    pages: sortedPages,
    titles: Array.from(titles),
    descriptions: Array.from(descriptions),
    keywords: Array.from(keywords),
  })

  console.log('==========\nEnd Report\n==========')
}

export { sortPages, printReport }
