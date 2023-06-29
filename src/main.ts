import crawlPage from './crawl'
import { printReport } from './helpers/report'

async function main() {
  if (process.argv.length < 3) {
    console.log('No website url provided.')
    process.exit(1)
  }
  if (process.argv.length > 3) {
    console.log('Too many argument. Pass only website url.')
    process.exit(1)
  }

  const baseURL = process.argv[2]

  console.log(`Starting crawl of ${baseURL}`)
  const pages = await crawlPage({
    baseURL,
    currentURL: baseURL,
    pages: {},
    data: {
      metaTitles: [],
      metaDescriptions: [],
      metaKeywords: [],
    },
  })
  // console.log(pages.data.metaTitles[0])

  printReport(
    pages.pages,
    pages.data.metaTitles,
    pages.data.metaDescriptions,
    pages.data.metaKeywords
  )
  // pnpm dev https://wagslane.dev
}
main()
