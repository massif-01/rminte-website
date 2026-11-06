# 接口索引

索引覆盖277个注册名称。点击名称跳转；各接口注明允许的方法、最低权限、参数与结果判断。

各接口请求示例统一按POST JSON发送。将示例保存为request.json，替换占位内容后调用对应路径。无需登录的接口可省略Authorization。

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

写操作会产生真实作用。先取得所需版本、对象ID、证书或发布材料。GET仅用于明确允许GET的接口，复杂参数使用POST JSON。

## 按名称查找

标注为最低入口权限；资源、会话和功能依赖仍适用。保留但不支持的入口在正文单独标明。
