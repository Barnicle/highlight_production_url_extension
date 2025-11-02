const color = document.getElementById('color') as HTMLInputElement

color.addEventListener('input', async () => {
  await chrome.storage.local.set({ highlightColor: color.value })
})

async function load() {
  const data = await chrome.storage.local.get(['highlightColor'])
  color.value = data.highlightColor ?? '#ff0'
}

load()
