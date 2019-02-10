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
  const el = document.querySelector('#harmonyContainer')

  if (el) {
    return el.textContent
  }
}

function fetchArticles (data) {
  const url = `https://search.daum.net/search?w=news&q=${encodeURIComponent(data.email)}&sort=recency`

  window.fetch(url).then(response => {
    return response.text()
  }).then(body => {
    data.url = url
    generateList(body, data)
  })
}

function generateList (text, data) {
  const list = parseList(text)

  if (!list || !list.length) {
    return
  }

  const listItems = buildItems(list)
  const container = buildContainer(data, listItems)
  const aside = document.querySelector('#mAside')

  aside.insertBefore(container, aside.querySelector('.hc_news_pc_mAside_popular_news'))
}

function buildItems (list) {
  const fragment = document.createDocumentFragment()

  list.forEach((item, index) => {
    const li = document.createElement('li')

    li.innerHTML = `<em class="num_newsview num${index + 1}"></em><strong class="tit_g"><a href="${item.url}">${item.title}</a></strong>`
    fragment.appendChild(li)
  })

  return fragment
}

function buildContainer (data, fragment) {
  const title = data.name ? `${data.name} ${data.email}` : data.email
  const el = document.createElement('div')

  el.className = 'aside_g aside_popular'
  el.innerHTML = `
    <h3>${title}</h3>
    <ul class="tab_aside">
      <li class="on">
        <div class="cont_aside">
          <ul class="list_ranking"></ul>
          <div class="util_aside">
            <a href="${data.url}" class="link_all">
              <span class="txt_newsview"></span>
              <span class="ico_newsview"></span>
            </a>
          </div>
        </div>
      </li>
    </ul>
  `
  el.querySelector('.list_ranking').appendChild(fragment)

  return el
}

function parseList (text) {
  const parser = new window.DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  return Array.from(doc.querySelectorAll('#clusterResultUL li')).map(li => {
    const el = li.querySelector('.f_link_b')
    const url = el.getAttribute('href')

    return {
      title: sanitizeHTML(el.textContent),
      url
    }
  })
}

export {
  run
}
