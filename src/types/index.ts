export type PagesType = Record<string, number>

export type MetaTitles = {
  title: string | undefined
  twitter_title: string | null | undefined
  og_title: string | null | undefined
  item_title: string | null | undefined
}

export type MetaDescriptions = {
  description: string | null | undefined
  og_description: string | null | undefined
  twitter_description: string | null | undefined
  item_description: string | null | undefined
}

export type MetaKeywords = string | null | undefined
