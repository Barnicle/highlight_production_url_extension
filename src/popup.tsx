import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Input, Button, Space } from 'antd';
import 'antd/dist/reset.css';
import { normalizeHost } from './common/helpers';

const App: FC = () => {
  const [address, setAddress] = useState('');
  const [hosts, setHosts] = useState<string[]>([]);

  const addHost = useCallback(async () => {
    const host = normalizeHost(address);

    if (!host) return;

    const next = Array.from(new Set([host, ...hosts]));
    try {
      await chrome.storage.local.set({ hosts: next });
      setHosts(next);
      setAddress('');
    } catch {
      console.error('Failed to add host');
    }
  }, [address, hosts]);

  const removeHost = useCallback(
    async (h: string) => {
      try {
        const next = hosts.filter((x) => x !== h);
        await chrome.storage.local.set({ hosts: next });
        setHosts(next);
      } catch {
        console.error('Failed to add host');
      }
    },
    [hosts],
  );

  const onRemoveHost = useCallback((h: string) => () => removeHost(h), []);
  const onChangeAddress = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  }, []);

  useEffect(() => {
    chrome.storage.local.get(['hosts']).then((result) => {
      const stored: string[] = result.hosts ?? [];
      setHosts(stored);
    });
  }, []);

  return (
    <div style={{ padding: 12, minWidth: 320 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={address}
            onChange={onChangeAddress}
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
                <Button size="small" onClick={onRemoveHost(h)} danger>
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </Space>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
