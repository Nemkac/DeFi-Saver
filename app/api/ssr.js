import server from '../dist/server/server.js'

export default async function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const url = new URL(req.url, `${protocol}://${host}`)

  const headers = {}
  for (const [key, value] of Object.entries(req.headers)) {
    headers[key] = Array.isArray(value) ? value.join(', ') : value
  }

  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body: !['GET', 'HEAD'].includes(req.method || 'GET') ? req : undefined,
  })

  const response = await server.fetch(request)

  res.writeHead(response.status, Object.fromEntries(response.headers.entries()))

  if (response.body) {
    const reader = response.body.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    } finally {
      res.end()
    }
  } else {
    res.end()
  }
}