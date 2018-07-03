export const toCurrency = (value, currency) => {
  if (value && currency) {
    const formated = Number(value).toLocaleString(undefined, { style: 'currency', currency })
    const zero = Number(0).toLocaleString(undefined, { style: 'currency', currency })
    if (zero && zero.indexOf('0') > 0) {
      const symbol = zero.substring(0, zero.indexOf('0'))
      if (symbol && symbol !== '') {
        return {
          symbol,
          value: formated.replace(symbol, '')
        }
      }
    }
    return { value: formated }
  }
  return { value }
}
