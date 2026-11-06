# Complete API index

277 registered names in 28 groups: 276 entries with business handlers including aliases, and one retained unsupported entry. Registration alone does not establish ready dependencies. Dedicated binary routes and WebSocket are separate chapters.

## Send an example

Save the target API JSON as request.json and replace placeholders. POST it to the listed path. For public entries the Authorization header can be omitted.

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

Empty {} queries/uses no business arguments. Writes have real effects. First obtain any required version,object ID,certificate,or release material. GET is allowed only where listed; use POST JSON for complex parameters.

## Groups

| Group | Count |
| --- | --- |
| [Accounts and sessions](auth.md) | 7 |
| [Controller status](system.md) | 8 |
| [Fans](fan.md) | 8 |
| [Temperature](temp.md) | 6 |
| [Power and protection](power.md) | 13 |
| [Computers and USB](device.md) | 9 |
| [General and module configuration](config.md) | 10 |
| [Network](network.md) | 9 |
| [WiFi management](wifi.md) | 4 |
| [Network forwarding](nat.md) | 4 |
| [Address allocation](dhcp.md) | 4 |
| [Time](time.md) | 5 |
| [Device files](storage.md) | 9 |
| [Controller services](service.md) | 5 |
| [Compute monitoring](monitor.md) | 6 |
| [Monitoring layout](ui.md) | 2 |
| [Logs](log.md) | 5 |
| [SSH fingerprints](hosts.md) | 5 |
| [SSH keys](key.md) | 6 |
| [Device certificates](cert.md) | 7 |
| [Lights and matrix](led.md) | 24 |
| [Pin maintenance](gpio.md) | 4 |
| [Application-computer network setup](lpmu_access.md) | 3 |
| [SSH connections and commands](ssh.md) | 23 |
| [Remote files](sftp.md) | 6 |
| [Automation and managed services](automation.md) | 56 |
| [Configuration packages](config_pack.md) | 8 |
| [Updates and recovery](ota.md) | 21 |

## All names

| Name | Purpose | Minimum access | Methods | Availability |
| --- | --- | --- | --- | --- |
| [auth.admin.reset_password](auth.md#authadminreset_password) | Restore the admin default password | ROOT | POST | Conditional; see details |
| [auth.admin.set_password](auth.md#authadminset_password) | Root sets admin password | ROOT | POST | Conditional; see details |
| [auth.change_password](auth.md#authchange_password) | Change password | Body token (authentication-specific) | POST | Conditional; see details |
| [auth.login](auth.md#authlogin) | User login | Public | POST | Conditional; see details |
| [auth.logout](auth.md#authlogout) | User logout | Body token (authentication-specific) | POST | Conditional; see details |
| [auth.root.set_password](auth.md#authrootset_password) | Root sets root password | ROOT | POST | Conditional; see details |
| [auth.status](auth.md#authstatus) | Check auth status | Body token (authentication-specific) | POST | Conditional; see details |
| [automation.action.stats](automation.md#automationactionstats) | Get action execution statistics | READ | GET/POST | Conditional; see details |
| [automation.action.stats.reset](automation.md#automationactionstatsreset) | Reset action statistics | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.actions.add](automation.md#automationactionsadd) | Create a new action template | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.actions.delete](automation.md#automationactionsdelete) | Delete an action template | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.actions.execute](automation.md#automationactionsexecute) | Execute an action template | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.actions.export](automation.md#automationactionsexport) | Export action template as config pack (.tscfg) | ROOT | POST | Conditional; see details |
| [automation.actions.get](automation.md#automationactionsget) | Get action template by ID | READ | GET/POST | Conditional; see details |
| [automation.actions.import](automation.md#automationactionsimport) | Import action template from config pack | ROOT | POST | Conditional; see details |
| [automation.actions.list](automation.md#automationactionslist) | List all action templates | READ | GET/POST | Conditional; see details |
| [automation.actions.update](automation.md#automationactionsupdate) | Update an existing action template | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.config.apply](automation.md#automationconfigapply) | Apply the confirmed restore or source choice | ROOT | POST | Conditional; see details |
| [automation.config.backup](automation.md#automationconfigbackup) | Save the complete emergency configuration | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.config.enable](automation.md#automationconfigenable) | Explicitly enable or pause the current configuration | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.config.preview](automation.md#automationconfigpreview) | Preview a configuration restore or source choice | ROOT | POST | Conditional; see details |
| [automation.config.refresh](automation.md#automationconfigrefresh) | Check SD card once without changing the user choice | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.config.status](automation.md#automationconfigstatus) | Current automation storage and backup status | READ | GET/POST | Conditional; see details |
| [automation.pause](automation.md#automationpause) | Pause automation engine | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.proxy.fetch](automation.md#automationproxyfetch) | Proxy fetch from external REST API | READ | POST | Conditional; see details |
| [automation.proxy.socketio_test](automation.md#automationproxysocketio_test) | Test Socket.IO connection (v4 protocol) | ROOT | POST | Conditional; see details |
| [automation.proxy.websocket_test](automation.md#automationproxywebsocket_test) | Test WebSocket connection | ROOT | POST | Conditional; see details |
| [automation.reload](automation.md#automationreload) | Reload configuration | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.resume](automation.md#automationresume) | Resume automation engine | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.rules.add](automation.md#automationrulesadd) | Add a new rule | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.rules.delete](automation.md#automationrulesdelete) | Delete a rule | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.rules.disable](automation.md#automationrulesdisable) | Disable a rule | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.rules.enable](automation.md#automationrulesenable) | Enable a rule | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.rules.export](automation.md#automationrulesexport) | Export rule as config pack (.tscfg) | ROOT | POST | Conditional; see details |
| [automation.rules.get](automation.md#automationrulesget) | Get rule details by ID | READ | GET/POST | Conditional; see details |
| [automation.rules.import](automation.md#automationrulesimport) | Import rule from config pack | ROOT | POST | Conditional; see details |
| [automation.rules.list](automation.md#automationruleslist) | List all rules | READ | GET/POST | Conditional; see details |
| [automation.rules.trigger](automation.md#automationrulestrigger) | Manually trigger a rule | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.rules.update](automation.md#automationrulesupdate) | Update rule with expected revision | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.services.list](automation.md#automationserviceslist) | List independent remote service controls | READ | GET/POST | Conditional; see details |
| [automation.services.status](automation.md#automationservicesstatus) | Confirm managed remote process state | READ | GET/POST | Conditional; see details |
| [automation.services.stop](automation.md#automationservicesstop) | Stop verified managed remote process | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.sources.add](automation.md#automationsourcesadd) | Add a new data source | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.sources.add_mapping](automation.md#automationsourcesadd_mapping) | Add a field mapping to an existing data source | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.sources.delete](automation.md#automationsourcesdelete) | Delete a data source | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.sources.disable](automation.md#automationsourcesdisable) | Disable a data source | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.sources.enable](automation.md#automationsourcesenable) | Enable a data source | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.sources.export](automation.md#automationsourcesexport) | Export data source as config pack (.tscfg) | ROOT | POST | Conditional; see details |
| [automation.sources.import](automation.md#automationsourcesimport) | Import data source from config pack | ROOT | POST | Conditional; see details |
| [automation.sources.list](automation.md#automationsourceslist) | List all data sources | READ | GET/POST | Conditional; see details |
| [automation.sources.remove_mapping](automation.md#automationsourcesremove_mapping) | Remove a field mapping from a data source | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.sources.update](automation.md#automationsourcesupdate) | Update an existing data source | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.start](automation.md#automationstart) | Start automation engine | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.status](automation.md#automationstatus) | Get automation engine status | READ | GET/POST | Conditional; see details |
| [automation.stop](automation.md#automationstop) | Stop automation engine | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.test.device](automation.md#automationtestdevice) | Test device control action | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.test.gpio](automation.md#automationtestgpio) | Test GPIO action | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.test.led](automation.md#automationtestled) | Test LED action | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [automation.test.ssh](automation.md#automationtestssh) | Test SSH command execution | ROOT | POST | Conditional; see details |
| [automation.variables.delete](automation.md#automationvariablesdelete) | Delete a saved user variable | ROOT | POST/PUT/DELETE | Conditional; see details |
| [automation.variables.get](automation.md#automationvariablesget) | Get variable value | READ | GET/POST | Conditional; see details |
| [automation.variables.list](automation.md#automationvariableslist) | List all variables | READ | GET/POST | Conditional; see details |
| [automation.variables.set](automation.md#automationvariablesset) | Set variable value | ROOT | POST/PUT/DELETE | Conditional; see details |
| [cert.delete](cert.md#certdelete) | Delete all PKI credentials | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [cert.generate_csr](cert.md#certgenerate_csr) | Generate Certificate Signing Request | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [cert.generate_keypair](cert.md#certgenerate_keypair) | Generate ECDSA P-256 key pair | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [cert.get_certificate](cert.md#certget_certificate) | Get device certificate PEM | Public | GET/POST | Conditional; see details |
| [cert.install](cert.md#certinstall) | Install signed certificate | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [cert.install_ca](cert.md#certinstall_ca) | Install CA certificate chain | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [cert.status](cert.md#certstatus) | Read certificate and diagnostic-service status | Public | GET/POST | Conditional; see details |
| [config.delete](config.md#configdelete) | Delete configuration value | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [config.get](config.md#configget) | Get configuration value | Public | GET/POST | Conditional; see details |
| [config.list](config.md#configlist) | List configuration keys | ADMIN | GET/POST | Conditional; see details |
| [config.module.list](config.md#configmodulelist) | List all config modules | READ | GET/POST | Conditional; see details |
| [config.module.reset](config.md#configmodulereset) | Reset module configuration | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [config.module.save](config.md#configmodulesave) | Save module configuration to NVS | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [config.module.set](config.md#configmoduleset) | Set module configuration | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [config.module.show](config.md#configmoduleshow) | Show module configuration | READ | GET/POST | Conditional; see details |
| [config.pack.apply](config_pack.md#configpackapply) | Unsupported generic configuration application | ADMIN | POST/PUT/DELETE | Unsupported |
| [config.pack.content](config_pack.md#configpackcontent) | Decrypt and get content of imported config pack | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [config.pack.export](config_pack.md#configpackexport) | Export configuration as encrypted .tscfg | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [config.pack.export_cert](config_pack.md#configpackexport_cert) | Export device certificate for encryption | READ | GET/POST | Conditional; see details |
| [config.pack.import](config_pack.md#configpackimport) | Validate an uploaded .tscfg file in place | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [config.pack.info](config_pack.md#configpackinfo) | Get config pack system information | READ | GET/POST | Conditional; see details |
| [config.pack.list](config_pack.md#configpacklist) | List .tscfg files in directory | READ | GET/POST | Conditional; see details |
| [config.pack.verify](config_pack.md#configpackverify) | Verify a .tscfg package signature | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [config.save](config.md#configsave) | Save configuration to storage | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [config.set](config.md#configset) | Set configuration value | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [device.fan.set](device.md#devicefanset) | Set fan mode and duty | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [device.fan.status](device.md#devicefanstatus) | Get fan status | Public | GET/POST | Conditional; see details |
| [device.ping](device.md#deviceping) | Test network connectivity (TCP port check) | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [device.power](device.md#devicepower) | Control device power (on/off/force_off) | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [device.power.status](device.md#devicepowerstatus) | Get power measurements | Public | GET/POST | Conditional; see details |
| [device.reset](device.md#devicereset) | Reset device | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [device.status](device.md#devicestatus) | Get device power status | Public | GET/POST | Conditional; see details |
| [device.usb.set](device.md#deviceusbset) | Set USB MUX target | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [device.usb.status](device.md#deviceusbstatus) | Get USB MUX status | Public | GET/POST | Conditional; see details |
| [dhcp.clients](dhcp.md#dhcpclients) | List DHCP clients | READ | GET/POST | Conditional; see details |
| [dhcp.start](dhcp.md#dhcpstart) | Start DHCP server | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [dhcp.status](dhcp.md#dhcpstatus) | Get DHCP server status | READ | GET/POST | Conditional; see details |
| [dhcp.stop](dhcp.md#dhcpstop) | Stop DHCP server | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [fan.config](fan.md#fanconfig) | Get fan configuration including curve | READ | GET/POST | Conditional; see details |
| [fan.curve](fan.md#fancurve) | Set temperature curve for fan | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [fan.enable](fan.md#fanenable) | Enable or disable a fan | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [fan.limits](fan.md#fanlimits) | Set duty cycle limits (min/max) | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [fan.mode](fan.md#fanmode) | Set fan operating mode | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [fan.save](fan.md#fansave) | Save fan configuration to NVS | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [fan.set](fan.md#fanset) | Set fan speed (manual mode) | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [fan.status](fan.md#fanstatus) | Get fan status | Public | GET/POST | Conditional; see details |
| [gpio.info](gpio.md#gpioinfo) | Get GPIO pin info | READ | GET/POST | Conditional; see details |
| [gpio.list](gpio.md#gpiolist) | List all controllable GPIO pins | READ | GET/POST | Conditional; see details |
| [gpio.set](gpio.md#gpioset) | Set GPIO level | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [gpio.toggle](gpio.md#gpiotoggle) | Toggle GPIO level | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [hosts.clear](hosts.md#hostsclear) | Clear all known hosts | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [hosts.info](hosts.md#hostsinfo) | Get known host info | READ | GET/POST | Conditional; see details |
| [hosts.list](hosts.md#hostslist) | List all known SSH hosts | READ | GET/POST | Conditional; see details |
| [hosts.remove](hosts.md#hostsremove) | Remove a known host | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [hosts.update](hosts.md#hostsupdate) | Force update a host fingerprint | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [key.delete](key.md#keydelete) | Delete a key | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [key.export](key.md#keyexport) | Export public key | READ | GET/POST | Conditional; see details |
| [key.exportPrivate](key.md#keyexportprivate) | Export private key (only for exportable keys) | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [key.generate](key.md#keygenerate) | Generate a new key | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [key.info](key.md#keyinfo) | Get key info | READ | GET/POST | Conditional; see details |
| [key.list](key.md#keylist) | List all stored keys | READ | GET/POST | Conditional; see details |
| [led.boot.config](led.md#ledbootconfig) | Get LED boot configuration | READ | GET/POST | Conditional; see details |
| [led.brightness](led.md#ledbrightness) | Get/set device brightness | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.clear](led.md#ledclear) | Clear all LEDs on device | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.color.hsv](led.md#ledcolorhsv) | Convert HSV to RGB | READ | GET/POST | Conditional; see details |
| [led.color.parse](led.md#ledcolorparse) | Parse color string to RGB | READ | GET/POST | Conditional; see details |
| [led.color_correction.export](led.md#ledcolor_correctionexport) | Export color correction config to SD card | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.color_correction.get](led.md#ledcolor_correctionget) | Get color correction configuration | READ | GET/POST | Conditional; see details |
| [led.color_correction.import](led.md#ledcolor_correctionimport) | Import color correction config from SD card | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.color_correction.reset](led.md#ledcolor_correctionreset) | Reset color correction to defaults | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.color_correction.set](led.md#ledcolor_correctionset) | Set color correction configuration | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.effect.list](led.md#ledeffectlist) | List available effects | READ | GET/POST | Conditional; see details |
| [led.effect.start](led.md#ledeffectstart) | Start effect on device | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.effect.stop](led.md#ledeffectstop) | Stop effect on device | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.fill](led.md#ledfill) | Fill all LEDs with color | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.filter.list](led.md#ledfilterlist) | List available post-processing filters | READ | GET/POST | Conditional; see details |
| [led.filter.start](led.md#ledfilterstart) | Apply post-processing filter | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.filter.stop](led.md#ledfilterstop) | Stop post-processing filter | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.image](led.md#ledimage) | Display image on matrix | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.list](led.md#ledlist) | List LED devices | Public | GET/POST | Conditional; see details |
| [led.qrcode](led.md#ledqrcode) | Generate and display QR code | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.save](led.md#ledsave) | Save current state as boot configuration | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.set](led.md#ledset) | Set an LED pixel range | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.text](led.md#ledtext) | Display text on matrix | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [led.text.stop](led.md#ledtextstop) | Stop text overlay | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [log.capture](log.md#logcapture) | Enable/disable ESP_LOG capture | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [log.clear](log.md#logclear) | Clear log buffer | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [log.list](log.md#loglist) | Get log entries with filtering | ADMIN | GET/POST | Conditional; see details |
| [log.setLevel](log.md#logsetlevel) | Set log level | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [log.stats](log.md#logstats) | Get log system statistics | ADMIN | GET/POST | Conditional; see details |
| [monitor.config](monitor.md#monitorconfig) | Get Compute monitor configuration | READ | GET/POST | Conditional; see details |
| [monitor.data](monitor.md#monitordata) | Get latest Compute telemetry data | READ | GET/POST | Conditional; see details |
| [monitor.set_server](monitor.md#monitorset_server) | Set compute monitoring server IP and port | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [monitor.start](monitor.md#monitorstart) | Start Compute monitoring | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [monitor.status](monitor.md#monitorstatus) | Get Compute monitor status | READ | GET/POST | Conditional; see details |
| [monitor.stop](monitor.md#monitorstop) | Stop Compute monitoring | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [nat.disable](nat.md#natdisable) | Disable NAT gateway | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [nat.enable](nat.md#natenable) | Enable NAT gateway | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [nat.save](nat.md#natsave) | Save NAT configuration | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [nat.status](nat.md#natstatus) | Get NAT gateway status | READ | GET/POST | Conditional; see details |
| [network.eth.status](network.md#networkethstatus) | Get Ethernet status | Public | GET/POST | Conditional; see details |
| [network.hostname](network.md#networkhostname) | Get/set hostname | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [network.lpmu_access.log](lpmu_access.md#networklpmu_accesslog) | Get the execution log for an application computer network access run | ADMIN | GET/POST | Conditional; see details |
| [network.lpmu_access.start](lpmu_access.md#networklpmu_accessstart) | Start application computer upstream-network access setup | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [network.lpmu_access.status](lpmu_access.md#networklpmu_accessstatus) | Get application computer upstream-network access setup status | ADMIN | GET/POST | Conditional; see details |
| [network.status](network.md#networkstatus) | Get overall network status | Public | GET/POST | Conditional; see details |
| [network.wifi.ap.config](network.md#networkwifiapconfig) | Configure WiFi AP | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [network.wifi.ap.stations](network.md#networkwifiapstations) | Get connected AP stations | READ | GET/POST | Conditional; see details |
| [network.wifi.connect](network.md#networkwificonnect) | Connect to WiFi network | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [network.wifi.disconnect](network.md#networkwifidisconnect) | Disconnect from WiFi | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [network.wifi.mode](network.md#networkwifimode) | Get/set WiFi mode | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [network.wifi.scan](network.md#networkwifiscan) | Scan for WiFi networks | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.abort](ota.md#otaabort) | Request firmware update cancellation | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.partitions](ota.md#otapartitions) | Inspect update partitions | READ | GET/POST | Conditional; see details |
| [ota.progress](ota.md#otaprogress) | Read firmware update progress | READ | GET/POST | Conditional; see details |
| [ota.rollback](ota.md#otarollback) | Roll back firmware | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.server.get](ota.md#otaserverget) | Read update-server configuration | READ | GET/POST | Conditional; see details |
| [ota.server.set](ota.md#otaserverset) | Set update-server configuration | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.start_file](ota.md#otastart_file) | Start firmware update from SD | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.start_url](ota.md#otastart_url) | Start firmware update from a URL | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.status](ota.md#otastatus) | Read firmware update status | READ | GET/POST | Conditional; see details |
| [ota.test_connection](ota.md#otatest_connection) | Probe an update URL | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.upgrade_file](ota.md#otaupgrade_file) | Compatibility alias for ota.start_file | ADMIN | POST/PUT/DELETE | Alias |
| [ota.upgrade_url](ota.md#otaupgrade_url) | Compatibility alias for ota.start_url | ADMIN | POST/PUT/DELETE | Alias |
| [ota.upload_abort](ota.md#otaupload_abort) | Abort firmware upload control | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.upload_begin](ota.md#otaupload_begin) | Begin firmware upload control | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.upload_end](ota.md#otaupload_end) | Finish firmware upload control | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.validate](ota.md#otavalidate) | Confirm healthy running firmware | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.version](ota.md#otaversion) | Read firmware version | Public | GET/POST | Conditional; see details |
| [ota.www.abort](ota.md#otawwwabort) | Request WWW update cancellation | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.www.progress](ota.md#otawwwprogress) | Read WWW update progress | READ | GET/POST | Conditional; see details |
| [ota.www.start](ota.md#otawwwstart) | Start WWW update from a URL | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ota.www.start_sdcard](ota.md#otawwwstart_sdcard) | Start WWW update from SD | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [power.chip](power.md#powerchip) | Get power chip data | Public | GET/POST | Conditional; see details |
| [power.debug](power.md#powerdebug) | Set debug mode | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [power.interval.set](power.md#powerintervalset) | Set sampling interval | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [power.monitor.start](power.md#powermonitorstart) | Start power monitoring | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [power.monitor.stop](power.md#powermonitorstop) | Stop power monitoring | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [power.protection.config](power.md#powerprotectionconfig) | Get voltage protection configuration | READ | GET/POST | Conditional; see details |
| [power.protection.set](power.md#powerprotectionset) | Configure voltage protection | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [power.protection.status](power.md#powerprotectionstatus) | Get voltage protection status | Public | GET/POST | Conditional; see details |
| [power.stats](power.md#powerstats) | Get monitoring statistics | READ | GET/POST | Conditional; see details |
| [power.stats.reset](power.md#powerstatsreset) | Reset monitoring statistics | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [power.status](power.md#powerstatus) | Get power monitoring status | Public | GET/POST | Conditional; see details |
| [power.threshold.set](power.md#powerthresholdset) | Set voltage thresholds | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [power.voltage](power.md#powervoltage) | Read current voltage | Public | GET/POST | Conditional; see details |
| [service.list](service.md#servicelist) | List all services | Public | GET/POST | Conditional; see details |
| [service.restart](service.md#servicerestart) | Restart a service | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [service.start](service.md#servicestart) | Start a service | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [service.status](service.md#servicestatus) | Get service status | Public | GET/POST | Conditional; see details |
| [service.stop](service.md#servicestop) | Stop a service | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [sftp.get](sftp.md#sftpget) | Download file via SFTP | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [sftp.ls](sftp.md#sftpls) | List remote directory via SFTP | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [sftp.mkdir](sftp.md#sftpmkdir) | Create remote directory via SFTP | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [sftp.put](sftp.md#sftpput) | Upload file via SFTP | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [sftp.rm](sftp.md#sftprm) | Delete remote file via SFTP | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [sftp.stat](sftp.md#sftpstat) | Get remote file information via SFTP | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ssh.cancel](ssh.md#sshcancel) | Cancel running SSH exec session | ROOT | POST/PUT/DELETE | Conditional; see details |
| [ssh.commands.add](ssh.md#sshcommandsadd) | Add or update SSH command configuration | ROOT | POST/PUT/DELETE | Conditional; see details |
| [ssh.commands.export](ssh.md#sshcommandsexport) | Export SSH command configuration as .tscfg | ROOT | POST/PUT/DELETE | Conditional; see details |
| [ssh.commands.get](ssh.md#sshcommandsget) | Get SSH command configuration by ID | READ | GET/POST | Conditional; see details |
| [ssh.commands.import](ssh.md#sshcommandsimport) | Import SSH command configuration from .tscfg | ROOT | POST/PUT/DELETE | Conditional; see details |
| [ssh.commands.list](ssh.md#sshcommandslist) | List all SSH command configurations | READ | GET/POST | Conditional; see details |
| [ssh.commands.remove](ssh.md#sshcommandsremove) | Remove SSH command configuration | ROOT | POST/PUT/DELETE | Conditional; see details |
| [ssh.commands.update](ssh.md#sshcommandsupdate) | Update an existing SSH commands configuration | ROOT | POST/PUT/DELETE | Conditional; see details |
| [ssh.copyid](ssh.md#sshcopyid) | Deploy public key to remote server | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ssh.exec](ssh.md#sshexec) | Execute remote command via SSH | ROOT | POST/PUT/DELETE | Conditional; see details |
| [ssh.exec_status](ssh.md#sshexec_status) | Read owned current or latest SSH result | ROOT | GET/POST | Conditional; see details |
| [ssh.exec_stream](ssh.md#sshexec_stream) | Execute remote command with streaming output via WebSocket | ROOT | POST/PUT/DELETE | Conditional; see details |
| [ssh.hosts.add](ssh.md#sshhostsadd) | Add SSH host configuration | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ssh.hosts.export](ssh.md#sshhostsexport) | Export SSH host configuration as .tscfg | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ssh.hosts.get](ssh.md#sshhostsget) | Get SSH host configuration by ID | READ | GET/POST | Conditional; see details |
| [ssh.hosts.import](ssh.md#sshhostsimport) | Import SSH host configuration from .tscfg | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ssh.hosts.list](ssh.md#sshhostslist) | List all SSH host configurations | READ | GET/POST | Conditional; see details |
| [ssh.hosts.remove](ssh.md#sshhostsremove) | Remove SSH host configuration | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ssh.hosts.update](ssh.md#sshhostsupdate) | Update an existing SSH hosts configuration | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ssh.keygen](ssh.md#sshkeygen) | Generate SSH key pair | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ssh.revoke](ssh.md#sshrevoke) | Revoke (remove) deployed public key from remote server | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ssh.services.start](ssh.md#sshservicesstart) | Start a stored managed service | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ssh.test](ssh.md#sshtest) | Test SSH connection | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [storage.delete](storage.md#storagedelete) | Delete file or directory | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [storage.info](storage.md#storageinfo) | Get file info | READ | GET/POST | Conditional; see details |
| [storage.list](storage.md#storagelist) | List directory contents | READ | GET/POST | Conditional; see details |
| [storage.mkdir](storage.md#storagemkdir) | Create directory | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [storage.mount](storage.md#storagemount) | Mount SD card | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [storage.read](storage.md#storageread) | Read file content | READ | GET/POST | Conditional; see details |
| [storage.rename](storage.md#storagerename) | Rename/move file | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [storage.status](storage.md#storagestatus) | Get storage status | Public | GET/POST | Conditional; see details |
| [storage.unmount](storage.md#storageunmount) | Unmount SD card | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [system.apis](system.md#systemapis) | List all registered APIs | READ | GET/POST | Conditional; see details |
| [system.cpu](system.md#systemcpu) | Get CPU core statistics | Public | GET/POST | Conditional; see details |
| [system.info](system.md#systeminfo) | Get system information | Public | GET/POST | Conditional; see details |
| [system.log.level](system.md#systemloglevel) | Get/set log level | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [system.memory](system.md#systemmemory) | Get memory information | Public | GET/POST | Conditional; see details |
| [system.memory_detail](system.md#systemmemory_detail) | Get detailed memory analysis | ADMIN | GET/POST | Conditional; see details |
| [system.reboot](system.md#systemreboot) | Reboot the system | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [system.tasks](system.md#systemtasks) | Get task list | ADMIN | GET/POST | Conditional; see details |
| [temp.bind](temp.md#tempbind) | Bind/unbind temperature to a system variable | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [temp.manual](temp.md#tempmanual) | Set/get manual temperature mode | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [temp.read](temp.md#tempread) | Read current temperature | READ | GET/POST | Conditional; see details |
| [temp.select](temp.md#tempselect) | Set/get preferred temperature source | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [temp.sources](temp.md#tempsources) | Get all temperature sources info | READ | GET/POST | Conditional; see details |
| [temp.status](temp.md#tempstatus) | Get temperature system status | Public | GET/POST | Conditional; see details |
| [time.force_sync](time.md#timeforce_sync) | Force NTP sync | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [time.info](time.md#timeinfo) | Get time sync info | Public | GET/POST | Conditional; see details |
| [time.set_ntp](time.md#timeset_ntp) | Set NTP server | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [time.set_timezone](time.md#timeset_timezone) | Set timezone | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [time.sync](time.md#timesync) | Sync time from browser | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [ui.widgets.get](ui.md#uiwidgetsget) | Get data widgets configuration | READ | GET/POST | Conditional; see details |
| [ui.widgets.set](ui.md#uiwidgetsset) | Save data widgets configuration | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [wifi.connect](wifi.md#wificonnect) | Connect to WiFi network | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [wifi.disconnect](wifi.md#wifidisconnect) | Disconnect from WiFi | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [wifi.scan](wifi.md#wifiscan) | Scan for WiFi networks | ADMIN | POST/PUT/DELETE | Conditional; see details |
| [wifi.status](wifi.md#wifistatus) | Get WiFi status | Public | GET/POST | Conditional; see details |

## Other surfaces

[File/image transfer](../transfers.md) | [WebSocket](../websocket.md) | [mTLS diagnostics](../compatibility.md#mtls-diagnostic-service)
