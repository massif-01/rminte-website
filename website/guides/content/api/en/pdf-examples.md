# Included examples

The PDF includes read_status.py and subscribe.js as attachments. Save them using a PDF reader that supports attachments; the editable companion contains the same files. Placeholder addresses, tokens, and certificate paths are not actual device settings.

## Copy a code example

Code boxes contain selectable text without line numbers mixed into the code. To preserve indentation and line endings exactly, use the paperclip in the upper-right corner to save the named source file, or save it from your PDF reader's attachment panel.

If your reader does not support attachments, the download package contains all original examples in code-examples/en with matching filenames. Save API request JSON as request.json for the corresponding endpoint. Response examples and WebSocket messages serve the purposes described in their chapters. Fill in addresses, tokens, and other placeholders before use.

## Python read-only query

Python 3 and its standard library are sufficient. Use your device address and run:

```sh
python3 read_status.py --base 'http://10.10.99.97' \
  --user admin
```

Enter the password at the hidden prompt rather than in command history. The script logs in, reads status, and attempts logout. It does not control hardware, run remote tasks, or upgrade. It follows no redirects and performs no automatic retries. Check valid/duty_valid and other measurement flags in its output.

## Browser subscription

subscribe.js exports watchTianShan as an ES module without third-party libraries. Use a browser that can reach the device. Obtain a token through HTTP login first:

```javascript
import {watchTianShan} from './subscribe.js';
const close = watchTianShan({
  baseUrl: 'http://10.10.99.97',
  token: yourLoginToken,
  onData: message => renderYourDashboard(message.data),
  onState: state => showConnectionState(state)
});
```

Your page supplies renderYourDashboard/showConnectionState. Call close() when leaving. Mark readings stale after disconnect before restoring authentication/subscriptions. Keep tokens out of source, URLs, and ordinary logs. The example does not reconnect automatically or replay actions.
