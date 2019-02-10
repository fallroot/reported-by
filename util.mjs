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

function sanitizeHTML (value) {
  const el = document.createElement('div')
  el.textContent = value
  return el.innerHTML
}

export {
  parseEmails,
  sanitizeHTML
}
