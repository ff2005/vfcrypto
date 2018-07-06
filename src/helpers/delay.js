export const delay = (value = 1000) => new Promise((resolve) => {
  if (value > 0) {
    const now = (new Date()).getTime()
    const timeout = now + value
    const timer = window.setInterval(() => {
      const now = (new Date()).getTime()
      if (now >= timeout) {
        window.clearInterval(timer)
        resolve(true)
      }
    }, 100)
  } else {
    resolve(true)
  }
})
