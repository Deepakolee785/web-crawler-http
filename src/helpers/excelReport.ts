import Excel from 'exceljs'
import path from 'path'
import { Page } from '../types'

export const exportReport = async (data: {
  pages: Page[]
  titles: string[]
  descriptions: string[]
  keywords: string[]
}) => {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Hits')

  worksheet.columns = [
    { key: 'url', header: 'URL', width: 50 },
    { key: 'hits', header: 'Hits', width: 10 },
    { key: 'status', header: 'Status', width: 10 },
    { key: 'time', header: 'Time taken(s)', width: 10 },
    { key: 'contentType', header: 'Content Type', width: 15 },
    { key: 'title', header: 'Title', width: 50 },
    { key: 'description', header: 'Description', width: 50 },
    { key: 'keywords', header: 'Keywords', width: 50 },
  ]
  data.pages.forEach((page) => {
    worksheet.addRow({
      url: page.url,
      hits: page.hits,
      title: page.titles,
      description: page.descriptions,
      keywords: page.keywords,
      status: page.status,
      time: page.time,
      contentType: page.contentType,
    })
  })

  worksheet.columns.forEach((sheetColumn) => {
    sheetColumn.font = {
      size: 12,
    }
    // sheetColumn.width = 40
  })

  worksheet.getRow(1).font = {
    bold: true,
    size: 13,
  }

  const title_worksheet = workbook.addWorksheet('Titles')
  title_worksheet.columns = [{ key: 'title', header: 'Titles' }]
  data.titles.forEach((title) => {
    title_worksheet.addRow({ title })
  })

  title_worksheet.columns.forEach((sheetColumn) => {
    sheetColumn.font = {
      size: 12,
    }
    sheetColumn.width = 150
  })

  title_worksheet.getRow(1).font = {
    bold: true,
    size: 13,
  }

  const description_worksheet = workbook.addWorksheet('Descriptions')
  description_worksheet.columns = [
    { key: 'description', header: 'Descriptions' },
  ]
  data.descriptions.forEach((description) => {
    description_worksheet.addRow({ description })
  })
  description_worksheet.columns.forEach((sheetColumn) => {
    sheetColumn.font = {
      size: 12,
    }
    sheetColumn.width = 150
  })

  description_worksheet.getRow(1).font = {
    bold: true,
    size: 13,
  }

  const keywords_worksheet = workbook.addWorksheet('Keywords')
  keywords_worksheet.columns = [{ key: 'keywords', header: 'Keywords' }]
  data.keywords.forEach((keywords) => {
    keywords_worksheet.addRow({ keywords })
  })

  keywords_worksheet.columns.forEach((sheetColumn) => {
    sheetColumn.font = {
      size: 12,
    }
    sheetColumn.width = 150
  })

  keywords_worksheet.getRow(1).font = {
    bold: true,
    size: 13,
  }

  const exportPath = path.resolve(__dirname, 'report.xlsx')

  await workbook.xlsx.writeFile(exportPath)
}
