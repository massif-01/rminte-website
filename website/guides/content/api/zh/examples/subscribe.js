/** Browser ES module. Only authenticates and subscribes to status; no controls. */
export function watchTianShan({baseUrl, token, onData, onState = () => {}}) {
  const url = new URL(baseUrl);
  if (url.protocol !== 'http:' || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash) {
    throw new Error('使用HTTP服务根地址，例如http://10.10.99.97');
  }
  url.protocol = 'ws:';
  url.pathname = '/ws';
  const ws = new WebSocket(url);
  let heartbeat;
  const send = message => ws.send(JSON.stringify(message));
  ws.onopen = () => {
    onState('connected');
    send({type: 'auth', token});
  };
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.type === 'auth_ok') {
      onState('authenticated');
      send({type: 'subscribe', topic: 'system.dashboard', params: {interval: 1000}});
      heartbeat = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) send({type: 'ping'});
      }, 15000);
    } else if (message.type === 'auth_error') {
      onState('authentication_failed');
      ws.close();
    } else if (message.type === 'subscribed') {
      onState(message.success ? 'subscribed' : 'subscription_failed');
    } else if (message.type === 'data') {
      onData(message);
    }
  };
  ws.onerror = () => onState('connection_error');
  ws.onclose = () => {
    clearInterval(heartbeat);
    onState('closed');
  };
  return () => {
    clearInterval(heartbeat);
    ws.close();
  };
}
