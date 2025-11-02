async function highlightProductionLinks() {
  const data = await chrome.storage.local.get(['highlightColor'])
  const color = data.highlightColor ?? '#ff0'
  const links = document.querySelectorAll('a')
  links.forEach(a => {
    try {
      const url = new URL((a as HTMLAnchorElement).href)
      if (url.hostname.includes('production')) {
        ;(a as HTMLElement).style.background = color
      }
    } catch (e) {
      // ignore non-URLs
    }
  })
}

highlightProductionLinks()
