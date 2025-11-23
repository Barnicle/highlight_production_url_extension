import { ChangeEvent, FC, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Input from 'antd/es/input';
import { normalizeHost } from './common/helpers';
import { Flex, Typography } from 'antd';

const App: FC = () => {
  const [address, setAddress] = useState('');
  const [hosts, setHosts] = useState<string[]>([]);

  const addHost = useCallback(() => {
    const host = normalizeHost(address);

    if (!host) return;

    const next = Array.from(new Set([host, ...hosts]));
    try {
      setHosts(next);
      setAddress('');
      chrome.storage.local.set({ hosts: next });
      console.log(next);
    } catch {
      console.error('Failed to add host');
    }
  }, [address, hosts]);

  const removeHost = useCallback(
    (h: string) => {
      try {
        console.log(hosts, h);

        const next = hosts.filter((x) => x !== h);
        setHosts(next);
        chrome.storage.local.set({ hosts: next });
      } catch {
        console.error('Failed to add host');
      }
    },
    [hosts],
  );

  const onKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') addHost();
    },
    [addHost],
  );

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
    <div style={{ padding: 6, maxHeight: 800, width: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={address}
            placeholder="Enter hostname (e.g., example.com)"
            onChange={onChangeAddress}
            onPressEnter={addHost}
            onKeyDown={onKeydown}
          />
          <Button onClick={addHost} color="primary" variant="solid">
            Add
          </Button>
        </Space.Compact>

        <Flex vertical gap={4}>
          {hosts.length === 0 ? (
            <div style={{ color: '#666' }}>No saved hosts</div>
          ) : (
            hosts.map((h) => (
              <Flex justify="space-between" align="center" key={h}>
                <Typography.Text>{h}</Typography.Text>
                <Button size="small" onClick={() => removeHost(h)} danger>
                  Remove
                </Button>
              </Flex>
            ))
          )}
        </Flex>
      </Space>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
