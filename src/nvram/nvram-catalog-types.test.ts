import { expect, test, describe } from 'bun:test';
import { multilineScriptTransformer } from './nvram-catalog-types';

describe('multilineScriptTransformer', () => {
  test('decodes escape sequences to readable format', () => {
    const encoded = 'mkdir /etc/avahi\\x0a# Write avahi-daemon config\\x0acat > /etc/avahi/avahi-daemon.conf <<\\x27EOF\\x27';
    const decoded = multilineScriptTransformer.toUi(encoded);

    expect(decoded).toBe('mkdir /etc/avahi\n# Write avahi-daemon config\ncat > /etc/avahi/avahi-daemon.conf <<\'EOF\'');
  });

  test('encodes special characters to escape sequences', () => {
    const ui = 'mkdir /etc/avahi\n# Write avahi-daemon config\ncat > /etc/avahi/avahi-daemon.conf <<\'EOF\'';
    const encoded = multilineScriptTransformer.fromUi(ui);

    expect(encoded).toBe('mkdir /etc/avahi\\x0a# Write avahi-daemon config\\x0acat > /etc/avahi/avahi-daemon.conf <<\\x27EOF\\x27');
  });

  test('lossless conversion: encoded -> decoded -> encoded', () => {
    const original = 'mkdir /etc/avahi\\x0a# Write avahi-daemon config with reflector enabled for br0 & br1\\x0acat > /etc/avahi/avahi-daemon.conf <<\\x27EOF\\x27\\x0a[server]\\x0ahost-name=router\\x0adomain-name=local\\x0ause-ipv4=yes\\x0ause-ipv6=no\\x0a# Limit to our LAN bridges\\x0aallow-interfaces=br0,br1\\x0a\\x0a[reflector]\\x0aenable-reflector=yes\\x0a# optional: reflect only selected services; we default to all\\x0a\\x0a[publish]\\x0adisable-publishing=yes\\x0aEOF\\x0a\\x0a# Start Avahi (if binary exists in this build)\\x0aif command -v avahi-daemon >/dev/null 2>&1; then\\x0a  killall avahi-daemon 2>/dev/null\\x0a  avahi-daemon -D\\x0afi\\x0a';

    const decoded = multilineScriptTransformer.toUi(original);
    const reencoded = multilineScriptTransformer.fromUi(decoded);

    expect(reencoded).toBe(original);
  });

  test('lossless conversion: ui -> encoded -> ui', () => {
    const original = `mkdir /etc/avahi
# Write avahi-daemon config with reflector enabled for br0 & br1
cat > /etc/avahi/avahi-daemon.conf <<'EOF'
[server]
host-name=router
domain-name=local
use-ipv4=yes
use-ipv6=no
# Limit to our LAN bridges
allow-interfaces=br0,br1

[reflector]
enable-reflector=yes
# optional: reflect only selected services; we default to all

[publish]
disable-publishing=yes
EOF

# Start Avahi (if binary exists in this build)
if command -v avahi-daemon >/dev/null 2>&1; then
  killall avahi-daemon 2>/dev/null
  avahi-daemon -D
fi
`;

    const encoded = multilineScriptTransformer.fromUi(original);
    const decoded = multilineScriptTransformer.toUi(encoded);

    expect(decoded).toBe(original);
  });

  test('handles tabs correctly', () => {
    const ui = 'if true; then\n\techo "hello"\nfi';
    const encoded = multilineScriptTransformer.fromUi(ui);
    const decoded = multilineScriptTransformer.toUi(encoded);

    expect(encoded).toContain('\\x09');
    expect(decoded).toBe(ui);
  });

  test('handles double quotes correctly', () => {
    const ui = 'echo "Hello World"\n';
    const encoded = multilineScriptTransformer.fromUi(ui);
    const decoded = multilineScriptTransformer.toUi(encoded);

    expect(encoded).toContain('\\x22');
    expect(decoded).toBe(ui);
  });

  test('handles single quotes correctly', () => {
    const ui = "echo 'Hello World'\n";
    const encoded = multilineScriptTransformer.fromUi(ui);
    const decoded = multilineScriptTransformer.toUi(encoded);

    expect(encoded).toContain('\\x27');
    expect(decoded).toBe(ui);
  });

  test('handles backslashes correctly', () => {
    const ui = 'echo "Path: C:\\\\Users\\\\test"\n';
    const encoded = multilineScriptTransformer.fromUi(ui);
    const decoded = multilineScriptTransformer.toUi(encoded);

    expect(encoded).toContain('\\x5c');
    expect(decoded).toBe(ui);
  });

  test('handles empty string', () => {
    const empty = '';
    const encoded = multilineScriptTransformer.fromUi(empty);
    const decoded = multilineScriptTransformer.toUi(empty);

    expect(encoded).toBe('');
    expect(decoded).toBe('');
  });

  test('handles string with no special characters', () => {
    const plain = 'hello world';
    const encoded = multilineScriptTransformer.fromUi(plain);
    const decoded = multilineScriptTransformer.toUi(plain);

    expect(encoded).toBe(plain);
    expect(decoded).toBe(plain);
  });
});
