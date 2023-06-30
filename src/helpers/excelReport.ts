import Excel from 'exceljs'
import path from 'path'
import { Page } from '../types'

const EXPORT_PATH = path.resolve(__dirname, '../..', 'report/report.xlsx')

export const exportReport = async (data: {
  pages: Page[]
  titles: string[]
  descriptions: string[]
  keywords: string[]
}) => {
  const workbook = new Excel.Workbook()
  const sheetOptions = {
    font: { size: 12 },
    width: 150,
  }

  const createWorksheet = (name: string, header: string) => {
    const worksheet = workbook.addWorksheet(name)
    worksheet.columns = [{ key: header, header }]
    worksheet.columns.forEach((sheetColumn) => {
      sheetColumn.font = sheetOptions.font
      sheetColumn.width = sheetOptions.width
    })
    worksheet.getRow(1).font = { bold: true, size: 13 }
    return worksheet
  }

  const addRowsToWorksheet = (worksheet: Excel.Worksheet, values: string[]) => {
    values.forEach((value) => {
      worksheet.addRow({ [worksheet.columns[0].key as string]: value })
    })
  }

  const hitsWorksheet = createWorksheet('Hits', 'URL')
  data.pages.forEach((page) => {
    hitsWorksheet.addRow({
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

  const titleWorksheet = createWorksheet('Titles', 'Titles')
  addRowsToWorksheet(titleWorksheet, data.titles)

  const descriptionWorksheet = createWorksheet('Descriptions', 'Descriptions')
  addRowsToWorksheet(descriptionWorksheet, data.descriptions)

  const keywordsWorksheet = createWorksheet('Keywords', 'Keywords')
  addRowsToWorksheet(keywordsWorksheet, data.keywords)
  try {
    await workbook.xlsx.writeFile(EXPORT_PATH)
  } catch (error) {
    console.error('An error occurred during the export:', error)
  }
}
