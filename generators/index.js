import png from 'project-name-generator'

function generateName(opts = {}, type = 'raw') {
  if (!opts.words) {
    opts.words = 4 + Math.floor(Math.random() * 2)
  }

  return png(opts)[type]
}

function generateUrl() {
  const name = generateName({}, 'dashed')
  return `http://${name}.com`
}

export default {
  generateName,
  generateUrl
}
