#!/usr/bin/env python3
"""Log in, read status, and log out. Uses HTTP and Python's standard library only."""
import argparse
import getpass
import http.client
import json
import os
from urllib.parse import urlsplit


class ApiError(RuntimeError):
    pass


class Client:
    def __init__(self, base, timeout=15):
        url = urlsplit(base)
        if (url.scheme != 'http' or not url.hostname or url.username or url.password
                or url.path not in ('', '/') or url.query or url.fragment):
            raise ValueError('base必须是HTTP服务根地址，如http://10.10.99.97')
        self.host, self.port = url.hostname, url.port or 80
        self.timeout = timeout
        self.token = None

    def call(self, name, params=None, method='GET'):
        headers = {'Accept': 'application/json'}
        body = None
        if params is not None:
            body = json.dumps(params, ensure_ascii=False, allow_nan=False).encode('utf-8')
            headers['Content-Type'] = 'application/json'
        if self.token:
            headers['Authorization'] = 'Bearer ' + self.token
        conn = http.client.HTTPConnection(self.host, self.port,
                                           timeout=self.timeout)
        try:
            conn.request(method, '/api/v1/' + name.replace('.', '/'), body=body, headers=headers)
            response = conn.getresponse()
            raw = response.read()
            if not 200 <= response.status < 300:
                raise ApiError(f'{name}: HTTP {response.status}；先处理认证/权限/连接问题')
            result = json.loads(raw)
            if not isinstance(result, dict):
                raise ApiError(f'{name}: 非预期JSON响应')
            # Dedicated logout returns success without a code/data envelope.
            if name == 'auth.logout':
                if result.get('success') is not True:
                    raise ApiError('退出未得到成功确认')
            elif result.get('code') != 0:
                reason = result.get('error') or result.get('message') or '未提供原因'
                raise ApiError(f'{name}: code={result.get("code")}, {reason}')
            return result
        finally:
            conn.close()


def read_status(client, username, password):
    login = client.call('auth.login', {'username': username, 'password': password}, 'POST')
    client.token = login['data']['token']
    try:
        return {name: client.call(name).get('data') for name in
                ['system.info', 'temp.read', 'fan.status', 'power.status', 'device.status']}
    finally:
        try:
            client.call('auth.logout', method='POST')
        finally:
            client.token = None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', default=os.environ.get('TS_BASE'))
    parser.add_argument('--user', default='admin', choices=['admin', 'root'])
    args = parser.parse_args()
    if not args.base:
        parser.error('请指定--base或设置TS_BASE')
    password = getpass.getpass('设备账户密码（不回显）：')
    data = read_status(Client(args.base), args.user, password)
    print(json.dumps(data, ensure_ascii=False, indent=2))
    print('只在valid/duty_valid等标记成立时使用读数；device.status查询默认目标agx。')


if __name__ == '__main__':
    main()
