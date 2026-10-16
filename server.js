import Meting from '@meting/core'
Bun.serve({
  async fetch() {
    const results = []
    const id = '2625361488'
    const variants = [
      ['default', undefined],
      ['numeric-array', c => { c.body.ids = [Number(id)] }],
      ['stringified', c => { c.body.ids = JSON.stringify([id]) }],
      ['https', c => { c.url = c.url.replace('http:', 'https:') }],
      ['guest', (c,m) => { m.cookie(process.env.METING_COOKIE_NETEASE) }],
      ['guest-v1', (c,m) => { m.cookie(process.env.METING_COOKIE_NETEASE); c.url = 'https://interface.music.163.com/api/song/enhance/player/url/v1'; c.body = { ids: JSON.stringify([id]), level: 'standard', encodeType: 'flac' } }],
      ['interface-v1', c => { c.url = 'https://interface.music.163.com/api/song/enhance/player/url/v1'; c.body = { ids: JSON.stringify([id]), level: 'standard', encodeType: 'flac' } }]
    ]
    for (const [name, change] of variants) {
      const meting = new Meting('netease')
      const original = meting.provider.url.bind(meting.provider)
      meting.provider.url = (...args) => { const c = original(...args); change?.(c,meting); return c }
      try {
        const raw = JSON.parse(await meting.url(id))
        results.push({ name, http: meting.info?.statusCode, code: raw.code, data: raw.data?.map(x => ({ id:x.id, code:x.code, fee:x.fee, url:Boolean(x.url), trial:Boolean(x.freeTrialInfo) })) })
      } catch (error) { results.push({ name, error: error.message }) }
    }
    return Response.json(results)
  }
})
