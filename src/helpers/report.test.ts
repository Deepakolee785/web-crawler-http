import { Page } from '../types'
import { sortPages, printReport } from './report'

jest.mock('./excelReport', () => ({
  exportReport: jest.fn(),
}))

import { exportReport } from './excelReport'

describe('sortPages', () => {
  it('should sort pages in descending order based on hits', () => {
    const pages: Page[] = [
      {
        url: 'page1',
        hits: 5,
        titles: {
          title: '',
          twitter_title: '',
          og_title: '',
          item_title: '',
        },
        descriptions: {
          description: '',
          og_description: '',
          twitter_description: '',
          item_description: '',
        },
        keywords: '',
        time: 0,
        status: 200,
        contentType: 'text/html',
      },
      {
        url: 'page2',
        hits: 3,
        titles: {
          title: '',
          twitter_title: '',
          og_title: '',
          item_title: '',
        },
        descriptions: {
          description: '',
          og_description: '',
          twitter_description: '',
          item_description: '',
        },
        keywords: '',
        time: 0,
        status: 200,
        contentType: 'text/html',
      },
      {
        url: 'page3',
        hits: 8,
        titles: {
          title: '',
          twitter_title: '',
          og_title: '',
          item_title: '',
        },
        descriptions: {
          description: '',
          og_description: '',
          twitter_description: '',
          item_description: '',
        },
        keywords: '',
        time: 0,
        status: 200,
        contentType: 'text/html',
      },
    ]

    const sortedPages = sortPages(pages)

    expect(sortedPages).toEqual([
      {
        url: 'page3',
        hits: 8,
        titles: {
          title: '',
          twitter_title: '',
          og_title: '',
          item_title: '',
        },
        descriptions: {
          description: '',
          og_description: '',
          twitter_description: '',
          item_description: '',
        },
        keywords: '',
        time: 0,
        status: 200,
        contentType: 'text/html',
      },
      {
        url: 'page1',
        hits: 5,
        titles: {
          title: '',
          twitter_title: '',
          og_title: '',
          item_title: '',
        },
        descriptions: {
          description: '',
          og_description: '',
          twitter_description: '',
          item_description: '',
        },
        keywords: '',
        time: 0,
        status: 200,
        contentType: 'text/html',
      },
      {
        url: 'page2',
        hits: 3,
        titles: {
          title: '',
          twitter_title: '',
          og_title: '',
          item_title: '',
        },
        descriptions: {
          description: '',
          og_description: '',
          twitter_description: '',
          item_description: '',
        },
        keywords: '',
        time: 0,
        status: 200,
        contentType: 'text/html',
      },
    ])
  })

  it('should return an empty array if pages is empty', () => {
    const pages: Page[] = []
    const sortedPages = sortPages(pages)

    expect(sortedPages).toEqual([])
  })
})

// Mock the console.log function
const consoleLogMock = jest.spyOn(console, 'log').mockImplementation()

// Mock the exportReport function
jest.mock('./excelReport', () => ({
  exportReport: jest.fn(),
}))

describe('printReport', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle empty pages array', () => {
    const pages: Page[] = []

    printReport(pages)

    expect(consoleLogMock).toHaveBeenCalledWith(
      '==========\nReport\n=========='
    )
    expect(consoleLogMock).toHaveBeenCalledWith(
      '==========\nSummary\n=========='
    )
    expect(consoleLogMock).toHaveBeenCalledWith('Titles:', [])
    expect(consoleLogMock).toHaveBeenCalledWith('Descriptions:', [])
    expect(consoleLogMock).toHaveBeenCalledWith('Keywords:', [])
    expect(consoleLogMock).toHaveBeenCalledWith(
      '==========\nEnd Report\n=========='
    )

    const { exportReport } = require('./excelReport') // Import the mock
    expect(exportReport).toHaveBeenCalledWith({
      pages: [],
      titles: [],
      descriptions: [],
      keywords: [],
    })
  })
})

// Restore the original console.log function
afterAll(() => {
  consoleLogMock.mockRestore()
})
