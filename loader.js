(async () => {
  const hostname = window.location.hostname
  let service

  if (hostname.includes('v.daum.net')) {
    service = 'daum'
  } else if (hostname.includes('news.naver.com')) {
    service = 'naver'
  } else {
    return
  }

  const src = window.chrome.extension.getURL(`${service}.mjs`)
  const naver = await import(src)
  naver.run()
})()
