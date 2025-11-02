const btn = document.getElementById('check') as HTMLButtonElement
const result = document.getElementById('result') as HTMLElement

const onActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  result.textContent = `Active tab URL: ${tab?.url ?? 'unknown'}`
}

btn.addEventListener('click', onActiveTab)
