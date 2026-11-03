---
id: "guide-admin"
language: "en"
title: "TianshanOS Admin User Guide"
source_commit: "92736a77e6441ce9af9ba232a3c355760e754df6"
prepared_on: "2026-11-03"
content_kind: "operating-instructions"
applicability: "TianshanOS 0.6.4"
source_files: ["website/guides/content/admin.md"]
source_urls: ["https://rminte.com/guides/admin"]
default_retrieval: true
evidence_status: "source transcription; not independent operational verification"
---

# TianshanOS Admin User Guide

This guide covers system checks, device controls, networking, files, and firmware updates for the admin account. The Root Operations Guide covers terminal access, remote commands, and Automation configuration. See the separate Security Guide for security management.

Version covered: 0.6.4. Revised November 3, 2026.

Use the controls shown on your device. Some need specific hardware or configuration. On a computer, hover over an icon button to see its name. On a phone, swipe within a wide table to view its other columns.

## 1. Getting Started

### Open the WebUI

1. Open the device’s web interface (WebUI) using the address provided by your administrator.
2. Select “Login” in the upper-right corner.
3. Keep `admin` as the username and enter the admin password supplied with the device.
4. Select “Login.” After a successful login, the current username appears in the upper-right corner.

Logging in with the default password opens a “Security Reminder.” Enter the current password, then enter the new password twice and select “Change Now.” Both new-password entries must match. Select “Later” to close the reminder.

When you have finished, select “Logout” in the upper-right corner. You will need to sign in again to use the device.

If permission is denied, check the account. If the login has expired, sign in again. Then check the result of the previous operation. Signing in does not repeat an earlier task. Do not immediately upload, delete, or upgrade again.

### Switch Languages

Select the language button at the top of the page, then choose Chinese or English. Page content and control labels switch immediately.

### Page Navigation

The main admin pages are:

- “System”: View device status, control modules, fans, and LEDs, and open OTA Update.
- “Network”: Check Ethernet status and DHCP clients, configure WiFi, and manage NAT forwarding.
- “Files”: Manage files on the SD Card and SPIFFS.
- “Security”: Open the separate security management page. See the Security Guide for instructions.

## 2. System Status and Routine Operations

Select “System” in the top navigation.

### View Resource and Service Status

“Management Chip Resources” shows CPU, DRAM, and PSRAM usage on the management chip. These readings do not show resource usage on the Inference Computer or Application Computer.

- Select “Details” to view total, used, and free memory and other memory information.
- Values marked “estimated” in memory details are for reference only. If a warning appears, keep the page information and follow its guidance.
- “Services” shows the number of running services and the total. Select it to view each service’s state and startup stage.
- If a service reports a problem, refresh its status. To restart it, follow “Restart One Service” below.

### View System and Power Information

“System Overview” shows the chip, firmware version, ESP-IDF version, and uptime. For routine use, check the firmware version. ESP-IDF is the version of the system framework used by the device.

The right side of the card shows input voltage, internal voltage, current, power, and protection status.

System settings such as networking, fans, temperature, and lighting are saved inside the device. Inserting an old SD card does not restore them. Automation configuration is managed separately; its emergency backup is not a full-device backup.

The switch beside the protection status enables or disables low-voltage protection. When enabled, the device uses the saved voltages and delays to shut down at low voltage and restart after power recovers.

### View Network and Time

“Network & Time” shows Ethernet, WiFi, IP address, current time, sync status, time source, and timezone.

- Select “Sync Time” to copy the browser's current time to the device.
- Select “Timezone,” choose a preset or enter a supported timezone setting, then save.
- Select “OTA Update” to open the firmware update page.

### Advanced Operations

#### Reboot TianshanOS

A reboot temporarily interrupts the WebUI and device management. Finish active operations, then select “Reboot” and confirm. Wait for the device to recover, then reopen the WebUI.

#### Restart One Service

Restarting a service temporarily interrupts the function it provides. Open “Service Status,” find the affected service, and select “Reboot” on that row. Check its status again when the operation finishes.

#### Change Shutdown Settings

These settings control when the device shuts down after a voltage drop and when it starts again after power recovers. Use values that match your device’s power requirements.

Select “Shutdown Settings” to change:

- “Low Voltage Threshold”: Starts the shutdown countdown below this voltage.
- “Recovery voltage threshold”: Starts recovery above this voltage.
- “Shutdown Countdown”: Sets the delay before shutdown after low voltage is detected.
- “Recovery hold time”: Sets the wait time used to confirm stable power recovery.
- “Fan Stop Delay”: Sets the delay before fans stop after shutdown.

Save the form to apply the updated protection settings.

After opening “Shutdown Settings,” wait for the current settings to load. If the page says it is showing defaults, do not treat them as the device's current settings. Review the voltages and wait times before saving. You can cancel while loading.

#### Switch the Top USB Target

Switching the USB target may temporarily disconnect an attached device. Confirm the target and finish active work before continuing.

Devices that support USB switching show a “USB” button. Each click switches the top USB port to the next target: ESP, Inference Computer, then Application Computer. “Disconnected” means no target is connected. Check the target shown on the button and the page message to confirm the result.

## 3. Device Panel

The “Device Panel” is on the “System” page. It contains module power controls, Quick Actions, and data widgets.

### Control the Inference Computer and Application Computer

“Inference Computer” is the former AGX label; “Application Computer” is the former LPMU label. Device identifiers and commands may still use `agx` and `lpmu`. Do not rename those identifiers yourself.

Save work on the module and complete its normal shutdown process before removing power. Forced power-off can cause loss of unsaved data.

- “Inference Computer Power” shows the power-control state. Select it to switch power on or off, then wait for confirmation.
- On “Application Computer Power,” “Network reachable” means the network can be reached; “Network unreachable” means it cannot. A failed check leaves the power state unknown. These results alone do not confirm whether the computer is powered on or off.
- Selecting the Application Computer button triggers the same action as pressing its physical power button. Wait for the check and the displayed result. If the result is unknown, check the computer and network before pressing the button again.

### Use Quick Actions

A root user configures Quick Action cards. Card visibility and manual execution are separate settings. Seeing a card does not mean you can start its task.

1. Read the card name and description to identify the task.
2. Select “Start” or the card and read the result. Do not start it again while processing.
3. An executed or queued message still needs an actual result check on the target device or task. If a service state is shown, distinguish “Process running” from “Ready.” A card with several tasks may show “Some tasks are not ready.”

Cards with remote background tasks also offer “View Log” and “Stop.” Open the logs to review the related tasks. If several records appear, choose by task name and original host. Check the target before stopping it, wait for the result, then verify that it stopped. Closing the log or stopping log updates does not stop the task.

“Run records” can include tasks started earlier; their presence does not mean they are still running. Select “Verify remote state” when needed. Admin users can enter through the relevant card; the separate “Run records” button on System is shown only to root. If a control is unavailable or the result remains unclear, ask a root user to check.

If starting is blocked, follow the reason shown. Do not keep selecting start:

- Rule disabled or manual triggering not allowed: Ask a root user to check the rule settings. A visible card is not permission to run it.
- A task or background operation is in progress: Wait for its result. Do not start it again.
- A run record already exists for the task: Check the original task's state and logs instead of starting it again. If it needs to end, stop and verify it. Ask a root user to check if you cannot resolve it.
- Configuration not loaded, a required item missing, or Automation paused: Ask a root user to check the configuration and enable state.

If the page reports automatic starting or a retry wait, let it continue. Temporary start failures are retried every 30 seconds for up to 6 minutes. An unconfirmed start is checked before another launch. A failed manual run is not automatically repeated. When the wait ends, check the device and network as directed before deciding whether to select “Start.”

After triggering one action, wait a few seconds before starting another. Closing the page, deleting a card, or restarting TianshanOS does not stop background services on remote hosts. To keep a service stopped, ask a root user to disable any automatic rule that could start it again.

Press and hold a card until the reorder indicator appears, then drag it to change the display order.

If no cards appear, read the explanation. Wait if configuration is loading. If loading failed, keep the reason and contact a root user. If no Quick Actions are configured, ask a root user to check the rules’ “Show on panel” setting.

Editing or importing a rule updates the current configuration; a restart is not needed to switch rules. If a card's task was changed, ask a root user to confirm its contents before running it.

Do not restart a device providing active services just to restore a card.

### Manage Data Widgets

Data widgets continuously display device data in the “Device Panel.”

1. Select “Widget Manager.”
2. Choose a refresh interval or disable automatic refresh.
3. Add a preset widget, or choose a component style and data source offered by the page.
4. Edit its label, display style, and unit as needed, then save.

Existing widgets can be edited, deleted, and reordered. You can also select a widget card to edit it. Press and hold a widget, then drag it to a new position.

“Small,” “Medium,” and “Large” use one, two, and three columns; they fit within narrower screens. When editing an icon, enter its name using the example on the page. Each value in a dual-value widget has its own data setting. Check that both sources are correct and the data updates.

“Failed to load data widgets” does not mean no configuration exists. Resolve the cause and read it again. If saving fails or its result is unconfirmed, keep the current content and check the message. Seeing your changes on the page does not confirm they were saved.

## 4. Fan Management

“Fan Control” is on the “System” page. Fan cards show the fans provided by your device. Check the fan number before changing a curve.

### View Fan Status

The status bar shows “Effective Temp” and “Current output.” The large percentage is the control setting confirmed by the device, not the measured speed. RPM is the measured speed in revolutions per minute and is hidden without a valid reading. A large `--` means the current output is unconfirmed.

While you drag the manual slider, the value beside it shows the proposed setting. The large percentage continues to show the current output. Release the slider, then check the message and updated reading to confirm the change. If a requested setting differs from the current output, do not assume it has already taken effect.

Smart mode shows its operating state, such as “Smart Mode,” “Following curve,” protection, or an invalid temperature. It also provides a safety reference, a 45-second forecast, and the rate of temperature change.

If the temperature becomes invalid, check that its source is still updating. The device switches to protective control for temperature loss. Select “TTI” for an explanation of Smart thermal control.

Use the refresh button in the section header to fetch the current state. If adjustment fails or the output is unconfirmed, check the device before deciding whether to retry.

### Select an Operating Mode

| Mode | Purpose |
| --- | --- |
| “Off” | Stops the fan. |
| “Manual” | Uses a fixed control percentage set with the 0-100% slider. |
| “Curve” | Follows the configured temperature-to-control-percentage curve. |
| “Smart” | Uses the base curve, temperature trends, and past adjustments to control cooling. Uses protective control when needed. |

Stopping a fan or setting a low manual value reduces cooling. Check the load and temperature first, and keep monitoring them. The slider is available only in Manual mode when the current output is confirmed.

### Configure a Fan Curve

Select “Curve” in the Fan Control section header to open “Fan Curve Management.” The “Curve” button inside a card only changes the operating mode.

1. Under “Fan,” choose the number to adjust and check it against the System page.
2. Under “Temperature variable binding,” add temperature variables and assign weights.
3. Select “Bind.” The temperature source is shared by fans in Curve and Smart modes, so changing it affects the fans using that source.
4. Add or edit “Curve nodes.” Each curve needs at least 2 nodes and supports up to 10.
5. Set “Minimum speed” and “Maximum speed” as control percentages. The minimum must not exceed the maximum.
6. Set “Temperature hysteresis” and “Minimum interval.” Hysteresis accepts 0-20°C and reduces frequent adjustments caused by small temperature changes. The interval accepts 500-30000 ms; 1000 ms is 1 second.
7. Select “Save curve.” After a successful save, the selected fan switches to Curve mode. To use Smart thermal control, return to the card and select “Smart.”

If saving fails, read the message and check the current state before retrying. After unbinding temperature variables, check the effective temperature and fan state as well.

After opening settings or choosing another fan, wait for its current settings to load. If the page says it is showing defaults or an earlier draft, those values do not confirm the device's current settings. Review them before saving. Check the read and save results for temperature bindings too.

If the message says the fan settings were applied but not fully saved, the current adjustment may already be in effect. A restart may restore earlier settings. Check the actual fan state, confirm that device storage is available, then save again. Do not restart the device just to test whether the save worked.

### Import and Export a Curve

- Select “Import Config” and choose a curve JSON file. JSON is the file format used to store curve data. Review the nodes, limits, and fan number, then select “Save curve” to apply them.
- Select “Export Config” to download the current curve. The page also attempts to save a copy under `/sdcard/config` on the SD card. Check the browser download and the reported SD-card result separately.

### Use a Test Temperature

A test temperature temporarily replaces the normal source and affects Curve or Smart control. Monitor the fan and device throughout the test.

1. Enter 0-100°C under “Test Temp.”
2. Select “Test” and observe the current output, state, and fan response.
3. Select “Clear Test” when finished. Check that the effective temperature has returned to its normal source.

## 5. LED Management

“LED Control” is on the “System” page and shows the LEDs provided by the device. Available features vary by LED.

### Routine Controls

- Use the light-bulb button at the bottom of a card to turn the LED on or off.
- Use the brightness, hue, and saturation sliders. Brightness controls how bright the light is; hue chooses the color; saturation moves between white and color. Saturation at 0 gives white light. Hue and saturation changes are applied when you release the slider.
- Use the animation button to open “LED Settings.” Select an animation under “Programmatic Animation,” then use its play or stop control.
- Select the save icon at the bottom right of the card to save the current LED configuration.
- Select “All Off” to turn off all LEDs and check the reported result. If some fail, check those devices.

### Advanced LED Matrix Features

Matrix cards provide icons for the available features. Open one, then switch between these groups in “LED Settings”:

- “Programmatic Animation”: Select and run an animation.
- “Image/QR Code”: Choose image or QR code under “Type” in the card, then select an SD-card image or enter the QR content.
- “Text Display”: Set text, font, alignment, scrolling, foreground, and background.
- “Post-processing Filter”: Choose a filter and parameters, then apply or stop it.
- “Color Correction”: Adjust the display and use the available reset, import, or export controls.

Check the actual light or matrix display after applying a change. Use only the features shown. If a setting fails, follow the message to check the file, input, or device state.

## 6. Network Management

Select “Network” in the top navigation to open “Network Settings.” Changing the network mode, hotspot, or NAT settings may interrupt the current WebUI connection. Before saving, make sure you can reconnect through the new network address.

### View Network Status

The top of the page shows the state of Ethernet, the WiFi client, and the WiFi AP. Open the related panel to view IP address, subnet mask, gateway, DNS, MAC address, SSID, signal, and connected-device counts when available.

The Ethernet panel displays the current link and address information. It does not provide address editing controls.

### Select a WiFi Mode

| Mode | Purpose |
| --- | --- |
| “Off” | Turns WiFi off. |
| “Station (STA)” | Connects the device to an existing WiFi network. |
| “Access Point (AP)” | Makes the device provide a WiFi hotspot. |
| “STA+AP” | Connects to an existing WiFi network while keeping the device hotspot available. |

After choosing a mode, wait for the page to refresh the state. The current wireless connection may be interrupted during the switch.

### Connect to WiFi

1. Set the WiFi mode to “Station (STA)” or “STA+AP.”
2. Under “Station,” select “Scan.”
3. Choose a network from the list. The list shows SSID, signal strength, channel, and authentication type.
4. Enter the password and confirm. Leave the password blank for an open network.
5. Wait for the state to change to “Connected,” then confirm the new IP address.

Select “Disconnect” to end the current WiFi client connection.

### Configure the WiFi AP

1. Set the WiFi mode to “Access Point (AP)” or “STA+AP.”
2. Under “Hotspot,” select “Config.”
3. Enter the SSID. A blank password creates an open hotspot; a protected hotspot requires at least 8 characters.
4. Select a channel and enable “Hide SSID” if needed.
5. Select “Apply” and wait for the hotspot state to update.

Select “Devices” to view clients currently connected to the hotspot.

### Set the Hostname

Enter a new name in the “Hostname” section under “Network Services,” then select “Set.” The page shows the current hostname after it updates.

### View DHCP Clients

DHCP automatically assigns network addresses to connected devices. Select “Clients,” choose “WiFi AP” or “Ethernet,” and view the current leases. Use the refresh button to reload the list.

### Advanced Network Operations

#### Configure the NAT Gateway

NAT forwards network traffic between the device's network interfaces. Enable or disable NAT, then select “Save” to retain the setting. Check the WiFi and Ethernet status afterward.

#### Access the Upstream Network via the Application Computer

This operation uses the configured Application Computer to set up network access. On System, first switch USB to “Application Computer” and check the network cables. Its SSH host must use key authentication and have a verified host fingerprint. Ask a root user to check these settings using the Security Guide.

Obtain the sudo password for the SSH account on that host. This password authorizes system changes and may differ from the WebUI password.

1. Under “Upstream Network Access,” select “Access via Application Computer.”
2. Enter the Application Computer sudo password and select the access button. The password is used only for this run and is not saved; enter it again for a later run.
3. Wait for the operation to finish. Do not start it again while processing.
4. Access is confirmed only when the result reports both an internet connection and completed network configuration.
5. After closing the result window, select “View Result” to open it again. If it fails or the result is unconfirmed, read the reason and failure stage. Expand “Execution Log” for more detail. Check the password for a password error, or the cabling and upstream network if no internet connection is found.

If the host fingerprint is unconfirmed or has changed, ask a root user to verify the host's identity first. Do not keep retrying access or skip verification. Remote script output may remain in its original language; keep it for investigation if needed.

A failed status request does not mean the script has stopped. Use the available “Refresh Status” control to check the current run before deciding whether to try again.

## 7. File Management

Select “Files” in the top navigation to open “File Manager.”

The SD Card is removable storage, and SPIFFS is internal device file storage. Select “SD Card” or “SPIFFS” to switch locations. The path at the top shows your current folder. Select a folder name in the path to go back to it.

### Browse and Manage Files

- Select a folder name to open it.
- Select the download button beside a file to save it to the browser's download location.
- Select the rename button, enter a new name, and confirm.
- Select “New Folder,” enter a folder name, and create it.
- Select the refresh button to reload the current directory and storage state.

Uploading, deleting, renaming, creating folders, and mounting or unmounting the SD card require a valid login. Reading and downloading protected Automation files also has a root permission check. If access is denied to admin, ask a root user to use the configuration pages. Do not change the path or use another entry to bypass permission checks.

### Upload Files

Files can only be uploaded to the SD Card, not SPIFFS. Confirm that the SD Card is mounted first.

1. Select “SD Card” and open the folder where you want to upload the files.
2. Select “Upload Files.”
3. Select one or more files, or drag files into the upload area.
4. Review the upload list and remove unwanted files.
5. Select “Upload” and wait for each file to show completion.

Uploading a `.tscfg` package opens verification and application steps. However, this file-upload page does not yet apply the package's settings. Successful upload or verification does not mean the settings are in effect.

Give rule packages to a root user to import on Automation. Ordinary file upload is not a substitute for rule import. See the Security Guide for source and signature guidance for other packages.

### Batch Operations

After selecting files or folders, the batch toolbar appears.

- “Batch Download” downloads selected files. Folders are not included.
- “Batch Delete” deletes selected files and folders.
- “Clear Selection” clears the current selection.

### Delete a File or Folder

Deletion cannot be undone in the WebUI. Deleting a folder also deletes all of its contents. Confirm the name and path before selecting “Delete” or “Batch Delete” and approving the prompt.

Files managed by Automation are protected. Uploading or overwriting files in `/sdcard/config/automation`, or deleting or renaming that folder or a parent containing it, may be refused. If the message says that Automation manages the file, ask a root user to use the configuration pages. Do not use Terminal to bypass the restriction.

### Mount and Unmount the SD Card

Unmounting makes SD files temporarily unavailable. Finish uploads, downloads, and other file operations, then select “Unmount SD.”

Unmounting or replacing the card may switch Automation to its internal emergency configuration. That copy may be older, and enabled automatic rules may still run. Without a usable copy, Automation may be unavailable. Ask a root user to confirm that unmounting is safe. Card-based images, fonts, and logs become unavailable.

When the SD Card is not mounted, the page shows “Mount SD.” Select it, wait for the state to change to “Mounted,” then open the SD Card directory again.

Mounting the card does not mean Automation has switched to its configuration. After reinserting a card, a root user must choose which configuration to use. Nothing is overwritten or merged automatically.

## 8. OTA Updates

On the “System” page, select “OTA Update” in the “Network & Time” section to open “Firmware Upgrade.”

The device reboots during an update, temporarily disconnecting the WebUI. Save active work and keep device power stable before starting. Do not power off the device while update progress is incomplete.

### First Upgrade from an Older Version to 0.6.3

The first upgrade from an older storage layout, such as 0.6.2, needs a matched USB / serial package approved by the publisher. Uploading only the firmware or WebUI cannot complete this upgrade. Ask the device administrator or provider to follow the package instructions. Do not erase the whole flash or use an old partition table.

Save important files before upgrading. The matched tool preserves keys and the SD card; it does not clear configuration on the card. The first startup may still read or migrate existing configuration. Customer delivery follows the “clear old configuration and configure again” procedure. The device administrator or provider must follow the delivery instructions. Do not erase the whole flash yourself or treat preserved files as completed configuration.

Keep power connected during the upgrade and first startup. Afterward, check login, networking, fans, lighting, SSH hosts, and Automation rules. Review rules before testing any task that controls power, restarts a device, or runs remote commands.

The matched package updates both application slots. Do not assume that the other slot still contains the old version. If the root password is lost, use only a recovery method confirmed by the provider to match the 0.6.3 layout. Do not flash an old password-reset image.

The web update methods below apply only to versions the publisher has approved for OTA. They do not replace the first layout upgrade.

### Check for Updates from an OTA Server

1. Review the “Current Version.” Two 0.6.3 installations can be different revision builds. Check the full version, build time, and publisher's instructions rather than only the first three numbers.
2. Enter the OTA server address supplied by an administrator or publisher.
3. Select “Save,” then select “Check Update.”
4. The page reports “Update Available,” “Already up to date,” an older server version, or an error.
5. Confirm the target version, then select “Upgrade Now” or the upgrade control shown by the page.
6. Wait for download, installation, and reboot to finish. To cancel, use the “Abort” button when it is available. Not every stage supports cancellation.
7. Wait for the page to confirm the firmware after the upgrade. Reconnect to the WebUI and check “Current Version” and device status.

“Upgrade Progress” shows the current stage in its own section. A 100% reading or a message that files were written does not confirm a completed restart and version check. If the result is unconfirmed or the running firmware differs from the target, keep the message and check the current version. Do not repeat the upgrade without checking. Ask a root user or the provider to investigate if needed.

When “Also upgrade www” is enabled, the firmware and WebUI are updated in sequence. Use matched firmware and WebUI resources from the same release. If the old interface remains after upgrading, force-refresh the browser and check the version and page again.

### Manual Upgrade

Expand “Manual Upgrade” and choose one of these methods:

- “Upgrade from URL”: Enter the firmware URL, set “Also upgrade www” according to the release instructions, then select “Upgrade.” Here, www refers to the device’s web-interface resources.
- “Upgrade from SD Card”: Enter a firmware path such as `/sdcard/firmware.bin`. If “Also upgrade www” is enabled, ensure that `www.bin` from the same release is in that directory.

For an upgrade from a URL, “Skip certificate check” skips verification of the HTTPS server certificate. This removes the certificate check used to confirm the download server’s identity. Leave it unchecked for routine updates. If you see a certificate error, ask your administrator to check the server address and certificate.

### Partition Management and Rollback

“Partition Management” shows the running partition and other available partitions.

- “Mark Valid” confirms the running version and disables automatic rollback protection for that version. Use it after confirming that the current version operates correctly.
- “Rollback to This Version” selects another bootable version and switches through a reboot. Rollback interrupts current services. Confirm the target version and data compatibility first.

After the operation and reboot complete, reopen the WebUI and verify the current version and device state.

Version 0.6.3 changes configuration storage and the device partition layout. Do not return directly to incompatible old firmware. If a downgrade is needed, ask the device provider to confirm a complete firmware, layout, and configuration recovery procedure.

Rollback does not restore the old configuration format or guarantee that old rules will work.

## 9. Security Management Entry

Select “Security” in the top navigation to open security management. Use the TianshanOS Security Guide for SSH keys, remote hosts, known-host fingerprints, HTTPS certificates, configuration packages, and account management. These procedures are not repeated here.

### Failed or Unconfirmed Operations

A red field error tells you what to correct. Fix it, then save. A cleared error mark does not confirm a successful save; check the message and list.

Check which operation failed, then read the reason and next step. If the message gives no reason, do not guess.

Select “Details” when available. Select “Hide” to hide the details. If a × button is shown, select it to dismiss the message. When asking for help, keep a record of the message and details for a root user to check.

If a message or its details are long, scroll within that area to read the full content before deciding what to do next.

If the result is unconfirmed, refresh and check the device, file, or task state. A timeout or lost connection does not mean the operation failed to run. Do not immediately repeat power, delete, task-start, or upgrade operations. Ask a root user to investigate if the result remains unclear.

Check successful, failed, and unconfirmed batch results separately. Confirm saved files in the browser’s download list.
