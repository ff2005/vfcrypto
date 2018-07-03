let listings

const parseListings = (listings) =>
  listings &&
  listings.data &&
  listings.data.reduce((t, l) => {
    t[l.name.toUpperCase()] = l
    return t
  }, {})

export default (api) => {
  return {
    listings: async () => {
      try {
        if (!listings) {
          const l = await api.get('/listings/')
          if (l) {
            listings = parseListings(l)
          }
        }
        return listings
      } catch (ex) {}
      return {}
    }
  }
}
