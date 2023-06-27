import { sortPages } from './report'

describe('Report helper test', () => {
  it('sortPages', () => {
    const input = { 'https://someurl.com/path': 1, 'https://someurl.com': 3 }
    const actual = sortPages(input)
    const expected = [
      ['https://someurl.com', 3],
      ['https://someurl.com/path', 1],
    ]
    expect(actual).toEqual(expect.arrayContaining(expected))
  })
  it('sortPages many pages', () => {
    const input = {
      'https://someurl.com/path': 3,
      'https://someurl.com': 8,
      'https://someurl.com/home': 30,
      'https://someurl.com/contact': 2,
      'https://someurl.com/about': 1,
      'https://someurl.com/goal': 12,
    }
    const actual = sortPages(input)
    const expected = [
      ['https://someurl.com/home', 30],
      ['https://someurl.com/goal', 12],
      ['https://someurl.com', 8],
      ['https://someurl.com/path', 3],
      ['https://someurl.com/contact', 2],
      ['https://someurl.com/about', 1],
    ]
    expect(actual).toEqual(expect.arrayContaining(expected))
  })
})
