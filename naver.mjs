import { parseEmails, sanitizeHTML } from './util.mjs'

function run () {
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
      title: sanitizeHTML($title.textContent),
      url
    }
  })
}

export {
  run
}
