import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Input, Button, Space } from 'antd';
import 'antd/dist/reset.css';

function normalizeHost(input: string) {
  let host = input.trim();
  try {
    if (host.includes('://')) host = new URL(host).hostname;
    else host = host.split('/')[0];
    host = host.split(':')[0];
  } catch {
    // fallback: use raw
  }
  return host;
}

function App() {
  const [address, setAddress] = useState('');
  const [hosts, setHosts] = useState<string[]>([]);

  useEffect(() => {
    chrome.storage.local.get(['hosts']).then((result) => {
      const stored: string[] = result.hosts ?? [];
      setHosts(stored);
    });
  }, []);

  async function addHost() {
    const host = normalizeHost(address);

    if (!host) return;

    const next = Array.from(new Set([host, ...hosts]));
    await chrome.storage.local.set({ hosts: next });
    setHosts(next);
    setAddress('');
    try {
      chrome.runtime.sendMessage({ type: 'refresh-highlights' });
    } catch {
      // ignore
    }
  }

  async function removeHost(h: string) {
    const next = hosts.filter((x) => x !== h);
    await chrome.storage.local.set({ hosts: next });
    setHosts(next);
    try {
      chrome.runtime.sendMessage({ type: 'refresh-highlights' });
    } catch {
      // ignore
    }
  }

  return (
    <div style={{ padding: 12, minWidth: 320 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter hostname (e.g., example.com)"
          />
          <Button onClick={addHost}>Add</Button>
        </Space.Compact>
        <Space></Space>
        <div>
          {hosts.length === 0 ? (
            <div style={{ color: '#666' }}>No saved hosts</div>
          ) : (
            hosts.map((h) => (
              <div
                key={h}
                style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}
              >
                <div style={{ flex: 1 }}>{h}</div>
                <Button size="small" onClick={() => removeHost(h)} danger>
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </Space>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
