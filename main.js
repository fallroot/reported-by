function init () {
  const content = getTextContent()

  if (!content) {
    return
  }

  const emails = parseEmails(content)

  if (!emails.length) {
    return
  }

  fetchArticles(emails[emails.length - 1])
}

function getTextContent () {
  const el = document.querySelector('#articleBodyContents')

  if (el) {
    return el.textContent
  }
}

function parseEmails (text) {
  const EMAIL_RE = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/gi
  const result = []
  let match

  while ((match = EMAIL_RE.exec(text))) {
    const email = match[0]
    const bunch = text.substring(Math.max(0, match.index - 20), Math.min(match.index + email.length + 20, text.length - 1))

    result.push({
      email,
      name: parseName(bunch)
    })
  }

  return result
}

function parseName (text) {
  const REPORTER_RE = /(?<=[^가-힣])([가-힣]+)\s*(기자|특파원)/g
  const matches = REPORTER_RE.exec(text)

  if (matches) {
    return `${matches[1]} ${matches[2]}`
  }
}

function fetchArticles (data) {
  const url = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(data.email)}&sort=1`

  window.fetch(url).then(response => {
    return response.text()
  }).then(body => {
    data.url = url
    generateList(body, data)
  })
}

function generateList (text, data) {
  const list = parseList(text)

  if (!list.length) {
    return
  }

  const fragment = document.createDocumentFragment()

  list.forEach(item => {
    const li = document.createElement('li')

    li.innerHTML = `<a href="${item.url}">${item.title}</a>`
    fragment.appendChild(li)
  })

  const title = data.name ? `${data.name} ${data.email}` : data.email
  const div = document.createElement('div')

  div.className = 'section'
  div.innerHTML = `<h4><a href="${data.url}">${title}</a></h4><div class="classfy" style="border-top:1px solid #e8e8e8;display:block;"><ul class="list_txt"></ul><a href="${data.url}" class="more_link">더보기</a></div>`
  div.querySelector('ul').appendChild(fragment)
  document.querySelector('table.container td.aside div.aside').insertBefore(div, document.querySelector('.section:first-child'))
}

function parseList (text) {
  const LIST_RE = /<ul class="type01">(.*?)<\/ul>/gi
  const matches = LIST_RE.exec(text)

  if (!matches) {
    return
  }

  const $ul = document.createElement('ul')

  $ul.innerHTML = matches[0]

  return Array.from($ul.querySelectorAll('li')).map(li => {
    const $title = li.querySelector('._sp_each_title')
    const url = $title.getAttribute('href')

    return {
      title: $title.textContent,
      url
    }
  })
}

init()
