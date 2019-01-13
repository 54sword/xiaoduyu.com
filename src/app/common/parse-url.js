
const parseUrl = (search) => {
  const paramPart = search.substr(1).split('&')
  return paramPart.reduce(function(res, item) {
    if (item) {
      let parts = item.split('=')
      res[parts[0]] = parts[1] || ''
    }
    return res
  }, {})
}

export default parseUrl
