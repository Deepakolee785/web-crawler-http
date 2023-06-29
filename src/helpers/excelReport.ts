import Excel from 'exceljs'
import path from 'path'
import { PagesType } from '../types'

export const exportReport = async (data: {
  pages: PagesType
  titles: string[]
  descriptions: string[]
  keywords: string[]
}) => {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Hits')

  worksheet.columns = [
    { key: 'url', header: 'URL' },
    { key: 'hits', header: 'Hits' },
  ]
  Object.entries(data.pages).forEach((item) => {
    worksheet.addRow({
      url: item[0],
      hits: item[1],
    })
  })

  worksheet.columns.forEach((sheetColumn) => {
    sheetColumn.font = {
      size: 12,
    }
    sheetColumn.width = 55
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
