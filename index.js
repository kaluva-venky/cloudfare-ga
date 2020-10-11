addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const defaultLinks = [
  { name: 'Git Personal', url: 'https://github.com/kaluva-venky' },
  { name: 'Git Work', url: 'https://github.com/vkaluva' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/vkaluva' },
]
const staticHtmlLink = 'https://static-links-page.signalnerve.workers.dev'

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.method !== 'GET') {
    return new Response(request.method + ' not allowed', {
      headers: { 'content-type': 'text/plain' },
      status: 405,
    })
  }
  const url = new URL(request.url)
  if (url.pathname == '/links') {
    const json = await getLinks()

    return new Response(json, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        status: 200,
      },
    })
  } else {
    return await getResponse()
  }
}

/**
 * getLinks returns a response body as a string.
 * Use await getLinks() in an async function to get the response body
 */
async function getLinks() {
  return JSON.stringify(defaultLinks, null, 2)
}

/**
 * getResponse returns a response body as a html string.
 * Use await getResponse() in an async function to fetch response from API
 *  and modify the static HTML retrieved
 */
async function getResponse() {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  }
  const response = await fetch(staticHtmlLink, init)

  const { headers } = response
  const contentType = headers.get('content-type') || ''

  if (contentType.includes('text/html')) {
    return rewriter.transform(response)
  } else {
    return new Response('Server returned non HTML Content', {
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
        status: 500,
      },
    })
  }
}

async function getStyles(attribute) {
  var ret = {}
  for (var i = 0; i < style.length; ++i) {
    var item = style.item(i)
    ret[item] = style[item]
  }
  return ret
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    this.links.forEach(linkObject => {
      element.append(
        `<a href="${linkObject['url']}" rel="noopener noreferrer" target="_blank">${linkObject['name']}</a>`,
        { html: true },
      )
    })
  }
}

const name = 'Venkateswar reddy Kaluva'
const rewriter = new HTMLRewriter()
  .on('div#links', new LinksTransformer(defaultLinks))
  .on('div#profile', {
    element(element) {
      element.removeAttribute('style')
    },
  })
  .on('img#avatar', {
    element(element) {
      element.setAttribute(
        'src',
        'https://github.com/kaluva-venky.png?size=200',
      )
    },
  })
  .on('h1#name', {
    element(element) {
      element.setInnerContent(name)
    },
  })
  .on('div#social', {
    element(element) {
      element.removeAttribute('style')
      element.append(
        `<a href="https://www.linkedin.com/in/vkaluva" rel="noopener noreferrer" target="_blank">
          <img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg" />
        </a>`,
        { html: true },
      )
      element.append(
        `<a href="https://github.com/kaluva-venky" rel="noopener noreferrer" target="_blank">
          <img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/github.svg" />
        </a>`,
        { html: true },
      )
    },
  })
  .on('title', {
    element(element) {
      element.setInnerContent(name)
    },
  })
  .on('body', {
    element(element) {
      element.setAttribute('class', 'bg-indigo-900')
    },
  })
