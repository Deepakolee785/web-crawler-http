import { MetaDescriptions, MetaKeywords, MetaTitles, PagesType } from '../types'
import { exportReport } from './excelReport'

function sortPages(pages: PagesType) {
  const pageArr = Object.entries(pages)
  pageArr.sort((a, b) => {
    const aHits = a[1]
    const bHits = b[1]
    return bHits - aHits
  })
  return pageArr
}

function printReport(
  pages: PagesType,
  titles: MetaTitles[],
  descriptions: MetaDescriptions[],
  keywords: MetaKeywords[]
) {
  console.log('==========\nReport\n==========')
  const sortedPages = sortPages(pages)
  for (const page of sortedPages) {
    const url = page[0]
    const hits = page[1]
    console.log(`Found ${hits} links to page: ${url}`)
  }
  console.log('==========\nSummary\n==========')
  const uniqueTitles = new Set(
    titles
      ?.map((t) => t.og_title || t.title || t.twitter_title || t.item_title)
      .filter(Boolean)
  )
  const uniqueDescriptions = new Set(
    descriptions
      ?.map((d) => d.og_description || d.description || d.twitter_description)
      .filter(Boolean)
  )
  const uniqueKeywords = new Set(
    keywords?.filter(Boolean)?.flatMap((k) => k?.split(','))
  )
  console.log('Titles: ', [...uniqueTitles])
  console.log('Descriptions: ', [...uniqueDescriptions])
  console.log('Keywords: ', [...uniqueKeywords])

  exportReport({
    pages,
    titles: [...uniqueTitles] as string[],
    descriptions: [...uniqueDescriptions] as string[],
    keywords: [...uniqueKeywords] as string[],
  })

  console.log('==========\nEnd Report\n==========')
}

export { sortPages, printReport }
