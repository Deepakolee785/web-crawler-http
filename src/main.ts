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
  const pages = await crawlPage({ baseURL, currentURL: baseURL, pages: {} })
  printReport(pages)
  // pnpm dev https://wagslane.dev
}
main()
