// Vercel's Bun preset discovers this entrypoint and serves the upstream app.
const upstreamFetch = globalThis.fetch
globalThis.fetch = async (...args) => {
  const response = await upstreamFetch(...args)
  if (String(args[0]).includes('/eapi/song/enhance/player/url')) {
    try {
      const body = await response.clone().json()
      console.log(JSON.stringify({ diagnostic: 'netease-url', httpStatus: response.status, code: body.code, data: body.data?.map(x => ({ code: x.code, urlPresent: Boolean(x.url), fee: x.fee, trial: Boolean(x.freeTrialInfo) })) }))
    } catch { console.log('netease-url diagnostic: non-JSON response') }
  }
  return response
}
await import('./src/index.js')
