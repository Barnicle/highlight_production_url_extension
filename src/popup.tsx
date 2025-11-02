import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Input, Button, Space } from 'antd'
import 'antd/dist/reset.css'

function sendHighlight(input: string) {
  // try to extract hostname from input; if it's a raw hostname, use it directly
  let host = input
  try {
    if (input.includes('://')) {
      host = new URL(input).hostname
    } else {
      // strip path if someone pasted like example.com/path
      host = input.split('/')[0]
    }
    // normalize: remove port if present
    host = host.split(':')[0]
  } catch (e) {
    // fallback to input
    host = input
  }

  chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    const tab = tabs[0]
    if (!tab || !tab.id) return
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (targetHost: string) => {
        try {
          const existing = document.getElementById('__highlight_frame__')
          if (existing) existing.remove()
          const hostname = window.location.hostname
          const matches = hostname === targetHost || hostname.endsWith('.' + targetHost)
          if (!matches) return

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
        } catch (e) {
          // ignore
        }
      },
      args: [host]
    })
  })
}

function normalizeHost(input: string) {
  let host = input.trim()
  try {
    if (host.includes('://')) host = new URL(host).hostname
    else host = host.split('/')[0]
    host = host.split(':')[0]
  } catch (e) {
    // fallback: use raw
  }
  return host
}

function App() {
  const [address, setAddress] = useState('')
  const [hosts, setHosts] = useState<string[]>([])

  useEffect(() => {
    chrome.storage.local.get(['hosts']).then(result => {
      const stored: string[] = result.hosts ?? []
      setHosts(stored)
    })
  }, [])

  async function addHost() {
    const host = normalizeHost(address)
    if (!host) return
    const next = Array.from(new Set([host, ...hosts]))
    await chrome.storage.local.set({ hosts: next })
    setHosts(next)
    setAddress('')
  }

  async function removeHost(h: string) {
    const next = hosts.filter(x => x !== h)
    await chrome.storage.local.set({ hosts: next })
    setHosts(next)
  }

  return (
    <div style={{ padding: 12, minWidth: 320 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter hostname (e.g., example.com)" />
        <Space>
          <Button type="primary" onClick={() => sendHighlight(address)}>
            Highlight
          </Button>
          <Button onClick={addHost}>Add</Button>
        </Space>

        <div>
          {hosts.length === 0 ? (
            <div style={{ color: '#666' }}>No saved hosts</div>
          ) : (
            hosts.map(h => (
              <div key={h} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <div style={{ flex: 1 }}>{h}</div>
                <Button size="small" onClick={() => sendHighlight(h)}>Highlight</Button>
                <Button size="small" onClick={() => removeHost(h)} danger>Remove</Button>
              </div>
            ))
          )}
        </div>
      </Space>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
