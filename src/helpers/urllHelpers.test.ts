import { normalizeURL, getURLsFromHTML } from './urlHelpers'

describe('Normalize URL util Test', () => {
  it('normalizeURL - strip protocal', () => {
    const input = 'https://someurl.com/path'
    const actual = normalizeURL(input)
    const expected = 'someurl.com/path'
    expect(actual).toEqual(expected)
  })

  it('normalizeURL - strip trailing slash', () => {
    const input = 'https://someurl.com/path/'
    const actual = normalizeURL(input)
    const expected = 'someurl.com/path'
    expect(actual).toEqual(expected)
  })

  it('normalizeURL - remove capitals', () => {
    const input = 'https://SOMEURL.com/path/'
    const actual = normalizeURL(input)
    const expected = 'someurl.com/path'
    expect(actual).toEqual(expected)
  })

  it('normalizeURL - strip http', () => {
    const input = 'http://someurl.com/'
    const actual = normalizeURL(input)
    const expected = 'someurl.com'
    expect(actual).toEqual(expected)
  })
})

describe('Get URLs from HTML Test', () => {
  it('getURLsFromHTML - absolute urls', () => {
    const inputBaseURL = 'https://someurl.com'
    const inputHTMLBody = `
    <html>
      <body>
        <a href="https://someurl.com/blog">Click me to go blog</a>
      </body>
    </html>
    `
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://someurl.com/blog']
    expect(actual).toEqual(expected)
  })

  it('getURLsFromHTML - relative urls', () => {
    const inputBaseURL = 'https://someurl.com'
    const inputHTMLBody = `
    <html>
      <body>
        <a href="/blog/">Click me to go blog</a>
      </body>
    </html>
    `
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://someurl.com/blog/']
    expect(actual).toEqual(expected)
  })

  it('getURLsFromHTML - invalid urls', () => {
    const inputBaseURL = 'https://someurl.com'
    const inputHTMLBody = `
    <html>
      <body>
        <a href="blog">Click me to go blog</a>
      </body>
    </html>
    `
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected: string[] = []
    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  it('getURLsFromHTML - both absolute, relative urls & duplicate urls', () => {
    const inputBaseURL = 'https://someurl.com'
    const inputHTMLBody = `
    <html>
      <body>
      <header>
        <a href="https://someurl.com/blog">Click me to go blog</a>
        <a href="/home/">Click me to go blog</a>
      </header>
        <footer>
          <a href="/home/">Click me to go blog</a>
          <a href="/home/">Click me to go blog</a>
        </footer>
      </body>
    </html>
    `
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://someurl.com/home/', 'https://someurl.com/blog']
    expect(actual).toEqual(expect.arrayContaining(expected))
  })
})
