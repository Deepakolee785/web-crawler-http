import { PagesType } from '../types'

function sortPages(pages: PagesType) {
  const pageArr = Object.entries(pages)
  pageArr.sort((a, b) => {
    const aHits = a[1]
    const bHits = b[1]
    return bHits - aHits
  })
  return pageArr
}

function printReport(pages: PagesType) {
  console.log('==========\nReport\n==========')
  const sortedPages = sortPages(pages)
  for (const page of sortedPages) {
    const url = page[0]
    const hits = page[1]
    console.log(`Found ${hits} links to page: ${url}`)
  }
  console.log('==========\nEnd Report\n==========')
}

export { sortPages, printReport }
