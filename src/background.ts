async function applyHighlightsToAllTabs(hosts: string[] = []) {
  try {
    const tabs = await chrome.tabs.query({})
    for (const tab of tabs) {
      if (!tab.id) continue
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (hostsArg: string[]) => {
            try {
              const existing = document.getElementById('__highlight_frame__')
              if (existing) existing.remove()
              if (!hostsArg || hostsArg.length === 0) return
              const hostname = window.location.hostname
              for (const targetHost of hostsArg) {
                if (!targetHost) continue
                const matches = hostname === targetHost || hostname.endsWith('.' + targetHost)
                if (matches) {
                  const frame = document.createElement('div')
                  frame.id = '__highlight_frame__'
                  frame.style.position = 'fixed'
                  frame.style.top = '0'
                  frame.style.left = '0'
                  frame.style.width = '100%'
                  frame.style.height = '100%'
                  frame.style.pointerEvents = 'none'
                  frame.style.boxSizing = 'border-box'
                  frame.style.border = '6px solid red'
                  frame.style.zIndex = '2147483647'
                  document.body.appendChild(frame)
                  break
                }
              }
            } catch {
              // ignore page errors
            }
          },
          args: [hosts]
        })
      } catch {
        // ignore individual tab injection errors
      }
    }
  } catch {
    console.error('applyHighlightsToAllTabs error')
  }
}

async function applyHighlightsToTab(hosts: string[] = [], tabId?: number) {
  if (!tabId) return
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (hostsArg: string[]) => {
        try {
          const existing = document.getElementById('__highlight_frame__')
          if (existing) existing.remove()
          if (!hostsArg || hostsArg.length === 0) return
          const hostname = window.location.hostname
          for (const targetHost of hostsArg) {
            if (!targetHost) continue
            const matches = hostname === targetHost || hostname.endsWith('.' + targetHost)
            if (matches) {
              const frame = document.createElement('div')
              frame.id = '__highlight_frame__'
              frame.style.position = 'fixed'
              frame.style.top = '0'
              frame.style.left = '0'
              frame.style.width = '100%'
              frame.style.height = '100%'
              frame.style.pointerEvents = 'none'
              frame.style.boxSizing = 'border-box'
              frame.style.border = '6px solid red'
              frame.style.zIndex = '2147483647'
              document.body.appendChild(frame)
              break
            }
          }
        } catch {
          // ignore
        }
      },
      args: [hosts]
    })
  } catch {
    // ignore
  }
}

chrome.runtime.onInstalled.addListener(() => {
  // apply highlights on install (if any hosts stored)
  chrome.storage.local.get(['hosts']).then(res => {
    const hosts: string[] = res.hosts ?? []
    applyHighlightsToAllTabs(hosts)
  })
})

// react to storage changes (hosts added/removed)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return
  if (changes.hosts) {
    const newHosts: string[] = changes.hosts.newValue ?? []
    applyHighlightsToAllTabs(newHosts)
  }
})

// also allow manual trigger via message
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'refresh-highlights') {
    chrome.storage.local.get(['hosts']).then(res => {
      const hosts: string[] = res.hosts ?? []
      applyHighlightsToAllTabs(hosts)
    })
  }
})

// When a tab finishes loading, apply highlights for that tab only
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.local.get(['hosts']).then(res => {
      const hosts: string[] = res.hosts ?? []
      applyHighlightsToTab(hosts, tabId)
    })
  }
})
