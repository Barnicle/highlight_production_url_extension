const btn = document.getElementById('check') as HTMLButtonElement
const result = document.getElementById('result') as HTMLElement

btn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  result.textContent = `Active tab URL: ${tab?.url ?? 'unknown'}`
})
