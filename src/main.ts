import crawlPage from './crawl'
import { printReport } from './helpers/report'

async function main() {
  // Retrieve the website URL from the command line arguments
  const websiteUrl = process.argv[2]

  // If no website URL is provided, log an error message and exit the process
  if (!websiteUrl) {
    console.log('No website URL provided.')
    process.exit(1)
  }

  // If there are more than 3 command line arguments, log an error message and exit the process
  if (process.argv.length > 3) {
    console.log('Too many arguments. Pass only website URL.')
    process.exit(1)
  }

  console.log(`Starting crawl of ${websiteUrl}`)

  try {
    // Perform the page crawl using the provided website URL as the base URL
    const pages = await crawlPage({
      baseURL: websiteUrl,
      currentURL: websiteUrl,
      pages: [],
    })

    // Print a report of the crawled pages
    printReport(pages)
  } catch (error) {
    console.error('An error occurred during the crawl:', error)
  }
}
main()
