---
id: "guide-root"
language: "en"
title: "TianshanOS Root Operations Guide"
source_commit: "92736a77e6441ce9af9ba232a3c355760e754df6"
prepared_on: "2026-11-03"
content_kind: "operating-instructions"
applicability: "TianshanOS 0.6.4"
source_files: ["website/guides/content/root.md"]
source_urls: ["https://rminte.com/guides/root"]
default_retrieval: true
evidence_status: "source transcription; not independent operational verification"
---

# TianshanOS Root Operations Guide

This guide covers routine functions in Part I and terminal access, remote commands, Automation, and configuration backup in Part II. Root operations can affect the device and remote hosts; check the target and active tasks before proceeding. See the separate Security Guide for security management.

Version covered: 0.6.4. Revised November 3, 2026.

Use the controls shown on your device. Some need specific hardware or configuration. On a computer, hover over an icon button to see its name. On a phone, swipe within a wide table to view its other columns.

## Part I: Routine Functions

### 1. Getting Started

#### Open the WebUI

1. Open the device’s web interface (WebUI) using the address provided by your administrator.
2. Select “Login” in the upper-right corner.
3. Enter `root` and the root password supplied with the device.
4. Select “Login.” After a successful login, the current username appears in the upper-right corner.

Logging in with the default password opens a “Security Reminder.” Enter the current password, then enter the new password twice and select “Change Now.” Both new-password entries must match. Select “Later” to close the reminder.

When you have finished, select “Logout” in the upper-right corner. You will need to sign in again to use the device.

If permission is denied, check the account. If the login has expired, sign in again. Then check the result of the previous operation. Signing in does not repeat an earlier task. Do not immediately upload, delete, or upgrade again.

#### Switch Languages

Select the language button at the top of the page, then choose Chinese or English. Page content and control labels switch immediately.

#### Page Navigation

Root users can access these pages:

- “System”: View device status, control modules, fans, and LEDs, and open OTA Update.
- “Network”: Check Ethernet status and DHCP clients, configure WiFi, and manage NAT forwarding.
- “Files”: Manage files on the SD Card and SPIFFS.
- “Terminal”: Run device commands and view system logs.
- “Commands”: Manage and run remote SSH commands.
- “Automation”: Configure tasks and save an emergency backup.
- “Security”: Open the separate security management page. See the Security Guide for instructions.

### 2. System Status and Routine Operations

Select “System” in the top navigation.

#### View Resource and Service Status

“Management Chip Resources” shows CPU, DRAM, and PSRAM usage on the management chip. These readings do not show resource usage on the Inference Computer or Application Computer.

- Select “Details” to view total, used, and free memory and other memory information.
- Values marked “estimated” in memory details are for reference only. If a warning appears, keep the page information and follow its guidance.
- “Services” shows the number of running services and the total. Select it to view each service’s state and startup stage.
- If a service reports a problem, refresh its status. To restart it, follow “Restart One Service” below.

#### View System and Power Information

“System Overview” shows the chip, firmware version, ESP-IDF version, and uptime. For routine use, check the firmware version. ESP-IDF is the version of the system framework used by the device.

The right side of the card shows input voltage, internal voltage, current, power, and protection status.

System settings such as networking, fans, temperature, and lighting are saved inside the device. Inserting an old SD card does not restore them. Automation configuration is managed separately; its emergency backup is not a full-device backup.

The switch beside the protection status enables or disables low-voltage protection. When enabled, the device uses the saved voltages and delays to shut down at low voltage and restart after power recovers.

#### View Network and Time

“Network & Time” shows Ethernet, WiFi, IP address, current time, sync status, time source, and timezone.

- Select “Sync Time” to copy the browser's current time to the device.
- Select “Timezone,” choose a preset or enter a supported timezone setting, then save.
- Select “OTA Update” to open the firmware update page.

#### Advanced Operations

##### Reboot TianshanOS

A reboot temporarily interrupts the WebUI and device management. Finish active operations, then select “Reboot” and confirm. Wait for the device to recover, then reopen the WebUI.

##### Restart One Service

Restarting a service temporarily interrupts the function it provides. Open “Service Status,” find the affected service, and select “Reboot” on that row. Check its status again when the operation finishes.

##### Change Shutdown Settings

These settings control when the device shuts down after a voltage drop and when it starts again after power recovers. Use values that match your device’s power requirements.

Select “Shutdown Settings” to change:

- “Low Voltage Threshold”: Starts the shutdown countdown below this voltage.
- “Recovery voltage threshold”: Starts recovery above this voltage.
- “Shutdown Countdown”: Sets the delay before shutdown after low voltage is detected.
- “Recovery hold time”: Sets the wait time used to confirm stable power recovery.
- “Fan Stop Delay”: Sets the delay before fans stop after shutdown.

Save the form to apply the updated protection settings.

After opening “Shutdown Settings,” wait for the current settings to load. If the page says it is showing defaults, do not treat them as the device's current settings. Review the voltages and wait times before saving. You can cancel while loading.

##### Switch the Top USB Target

Switching the USB target may temporarily disconnect an attached device. Confirm the target and finish active work before continuing.

Devices that support USB switching show a “USB” button. Each click switches the top USB port to the next target: ESP, Inference Computer, then Application Computer. “Disconnected” means no target is connected. Check the target shown on the button and the page message to confirm the result.

### 3. Device Panel

The “Device Panel” is on the “System” page. It contains module power controls, Quick Actions, and data widgets.

#### Control the Inference Computer and Application Computer

“Inference Computer” is the former AGX label; “Application Computer” is the former LPMU label. Device identifiers and commands may still use `agx` and `lpmu`. Do not rename those identifiers yourself.

Save work on the module and complete its normal shutdown process before removing power. Forced power-off can cause loss of unsaved data.

- “Inference Computer Power” shows the power-control state. Select it to switch power on or off, then wait for confirmation.
- On “Application Computer Power,” “Network reachable” means the network can be reached; “Network unreachable” means it cannot. A failed check leaves the power state unknown. These results alone do not confirm whether the computer is powered on or off.
- Selecting the Application Computer button triggers the same action as pressing its physical power button. Wait for the check and the displayed result. If the result is unknown, check the computer and network before pressing the button again.

#### Use Quick Actions

A root user configures Quick Action cards. Card visibility and manual execution are separate settings. Seeing a card does not mean you can start its task.

1. Read the card name and description to identify the task.
2. Select “Start” or the card and read the result. Do not start it again while processing.
3. An executed or queued message still needs an actual result check on the target device or task. If a service state is shown, distinguish “Process running” from “Ready.” A card with several tasks may show “Some tasks are not ready.”

Cards with remote background tasks also offer “View Log” and “Stop.” Open the logs to review the related tasks. If several records appear, choose by task name and original host. Check the target before stopping it, wait for the result, then verify that it stopped. Closing the log or stopping log updates does not stop the task.

“Run records” can include tasks started earlier; their presence does not mean they are still running. Select “Verify remote state” when needed. Open “Run records” from the relevant card, System, or Automation (Chapter 11). If a control is unavailable or the result remains unclear, check the records and System Logs.

If starting is blocked, follow the reason shown. Do not keep selecting start:

- Rule disabled or manual triggering not allowed: Check the rule settings on “Automation” (Chapter 12). A visible card is not permission to run it.
- A task or background operation is in progress: Wait for its result. Do not start it again.
- A run record already exists for the task: Check the original task's state and logs instead of starting it again. If it needs to end, stop and verify it. Check “Run records” and System Logs if you cannot resolve it.
- Configuration not loaded, a required item missing, or Automation paused: Check the configuration and enable state on “Automation” (Chapters 12 and 13).

If the page reports automatic starting or a retry wait, let it continue. Temporary start failures are retried every 30 seconds for up to 6 minutes. An unconfirmed start is checked before another launch. A failed manual run is not automatically repeated. When the wait ends, check the device and network as directed before deciding whether to select “Start.”

After triggering one action, wait a few seconds before starting another. Closing the page, deleting a card, or restarting TianshanOS does not stop background services on remote hosts. To keep a service stopped, disable any automatic rule that could start it again on Automation.

Press and hold a card until the reorder indicator appears, then drag it to change the display order.

If no cards appear, read the explanation. Wait if configuration is loading. If loading failed, keep the reason and check “System Logs” on Terminal. If no Quick Actions are configured, select “Open Automation” and check the rules’ “Show on panel” setting.

Editing or importing a rule updates the current configuration; a restart is not needed to switch rules. If a card's task was changed, review its conditions, actions, and targets before running it.

Do not restart a device providing active services just to restore a card.

#### Manage Data Widgets

Data widgets continuously display device data in the “Device Panel.”

1. Select “Widget Manager.”
2. Choose a refresh interval or disable automatic refresh.
3. Add a preset widget, or choose a component style and data source offered by the page.
4. Edit its label, display style, and unit as needed, then save.

Existing widgets can be edited, deleted, and reordered. You can also select a widget card to edit it. Press and hold a widget, then drag it to a new position.

“Small,” “Medium,” and “Large” use one, two, and three columns; they fit within narrower screens. When editing an icon, enter its name using the example on the page. Each value in a dual-value widget has its own data setting. Check that both sources are correct and the data updates.

“Failed to load data widgets” does not mean no configuration exists. Resolve the cause and read it again. If saving fails or its result is unconfirmed, keep the current content and check the message. Seeing your changes on the page does not confirm they were saved.

### 4. Fan Management

“Fan Control” is on the “System” page. Fan cards show the fans provided by your device. Check the fan number before changing a curve.

#### View Fan Status

The status bar shows “Effective Temp” and “Current output.” The large percentage is the control setting confirmed by the device, not the measured speed. RPM is the measured speed in revolutions per minute and is hidden without a valid reading. A large `--` means the current output is unconfirmed.

While you drag the manual slider, the value beside it shows the proposed setting. The large percentage continues to show the current output. Release the slider, then check the message and updated reading to confirm the change. If a requested setting differs from the current output, do not assume it has already taken effect.

Smart mode shows its operating state, such as “Smart Mode,” “Following curve,” protection, or an invalid temperature. It also provides a safety reference, a 45-second forecast, and the rate of temperature change.

If the temperature becomes invalid, check that its source is still updating. The device switches to protective control for temperature loss. Select “TTI” for an explanation of Smart thermal control.

Use the refresh button in the section header to fetch the current state. If adjustment fails or the output is unconfirmed, check the device before deciding whether to retry.

#### Select an Operating Mode

| Mode | Purpose |
| --- | --- |
| “Off” | Stops the fan. |
| “Manual” | Uses a fixed control percentage set with the 0-100% slider. |
| “Curve” | Follows the configured temperature-to-control-percentage curve. |
| “Smart” | Uses the base curve, temperature trends, and past adjustments to control cooling. Uses protective control when needed. |

Stopping a fan or setting a low manual value reduces cooling. Check the load and temperature first, and keep monitoring them. The slider is available only in Manual mode when the current output is confirmed.

#### Configure a Fan Curve

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

#### Import and Export a Curve

- Select “Import Config” and choose a curve JSON file. JSON is the file format used to store curve data. Review the nodes, limits, and fan number, then select “Save curve” to apply them.
- Select “Export Config” to download the current curve. The page also attempts to save a copy under `/sdcard/config` on the SD card. Check the browser download and the reported SD-card result separately.

#### Use a Test Temperature

A test temperature temporarily replaces the normal source and affects Curve or Smart control. Monitor the fan and device throughout the test.

1. Enter 0-100°C under “Test Temp.”
2. Select “Test” and observe the current output, state, and fan response.
3. Select “Clear Test” when finished. Check that the effective temperature has returned to its normal source.

### 5. LED Management

“LED Control” is on the “System” page and shows the LEDs provided by the device. Available features vary by LED.

#### Routine Controls

- Use the light-bulb button at the bottom of a card to turn the LED on or off.
- Use the brightness, hue, and saturation sliders. Brightness controls how bright the light is; hue chooses the color; saturation moves between white and color. Saturation at 0 gives white light. Hue and saturation changes are applied when you release the slider.
- Use the animation button to open “LED Settings.” Select an animation under “Programmatic Animation,” then use its play or stop control.
- Select the save icon at the bottom right of the card to save the current LED configuration.
- Select “All Off” to turn off all LEDs and check the reported result. If some fail, check those devices.

#### Advanced LED Matrix Features

Matrix cards provide icons for the available features. Open one, then switch between these groups in “LED Settings”:

- “Programmatic Animation”: Select and run an animation.
- “Image/QR Code”: Choose image or QR code under “Type” in the card, then select an SD-card image or enter the QR content.
- “Text Display”: Set text, font, alignment, scrolling, foreground, and background.
- “Post-processing Filter”: Choose a filter and parameters, then apply or stop it.
- “Color Correction”: Adjust the display and use the available reset, import, or export controls.

Check the actual light or matrix display after applying a change. Use only the features shown. If a setting fails, follow the message to check the file, input, or device state.

### 6. Network Management

Select “Network” in the top navigation to open “Network Settings.” Changing the network mode, hotspot, or NAT settings may interrupt the current WebUI connection. Before saving, make sure you can reconnect through the new network address.

#### View Network Status

The top of the page shows the state of Ethernet, the WiFi client, and the WiFi AP. Open the related panel to view IP address, subnet mask, gateway, DNS, MAC address, SSID, signal, and connected-device counts when available.

The Ethernet panel displays the current link and address information. It does not provide address editing controls.

#### Select a WiFi Mode

| Mode | Purpose |
| --- | --- |
| “Off” | Turns WiFi off. |
| “Station (STA)” | Connects the device to an existing WiFi network. |
| “Access Point (AP)” | Makes the device provide a WiFi hotspot. |
| “STA+AP” | Connects to an existing WiFi network while keeping the device hotspot available. |

After choosing a mode, wait for the page to refresh the state. The current wireless connection may be interrupted during the switch.

#### Connect to WiFi

1. Set the WiFi mode to “Station (STA)” or “STA+AP.”
2. Under “Station,” select “Scan.”
3. Choose a network from the list. The list shows SSID, signal strength, channel, and authentication type.
4. Enter the password and confirm. Leave the password blank for an open network.
5. Wait for the state to change to “Connected,” then confirm the new IP address.

Select “Disconnect” to end the current WiFi client connection.

#### Configure the WiFi AP

1. Set the WiFi mode to “Access Point (AP)” or “STA+AP.”
2. Under “Hotspot,” select “Config.”
3. Enter the SSID. A blank password creates an open hotspot; a protected hotspot requires at least 8 characters.
4. Select a channel and enable “Hide SSID” if needed.
5. Select “Apply” and wait for the hotspot state to update.

Select “Devices” to view clients currently connected to the hotspot.

#### Set the Hostname

Enter a new name in the “Hostname” section under “Network Services,” then select “Set.” The page shows the current hostname after it updates.

#### View DHCP Clients

DHCP automatically assigns network addresses to connected devices. Select “Clients,” choose “WiFi AP” or “Ethernet,” and view the current leases. Use the refresh button to reload the list.

#### Advanced Network Operations

##### Configure the NAT Gateway

NAT forwards network traffic between the device's network interfaces. Enable or disable NAT, then select “Save” to retain the setting. Check the WiFi and Ethernet status afterward.

##### Access the Upstream Network via the Application Computer

This operation uses the configured Application Computer to set up network access. On System, first switch USB to “Application Computer” and check the network cables. Its SSH host must use key authentication and have a verified host fingerprint. Check the host, key, and fingerprint settings using the Security Guide.

Obtain the sudo password for the SSH account on that host. This password authorizes system changes and may differ from the WebUI password.

1. Under “Upstream Network Access,” select “Access via Application Computer.”
2. Enter the Application Computer sudo password and select the access button. The password is used only for this run and is not saved; enter it again for a later run.
3. Wait for the operation to finish. Do not start it again while processing.
4. Access is confirmed only when the result reports both an internet connection and completed network configuration.
5. After closing the result window, select “View Result” to open it again. If it fails or the result is unconfirmed, read the reason and failure stage. Expand “Execution Log” for more detail. Check the password for a password error, or the cabling and upstream network if no internet connection is found.

If the host fingerprint is unconfirmed or has changed, verify the host's identity on Security first. Do not keep retrying access or skip verification. Remote script output may remain in its original language; keep it for investigation if needed.

A failed status request does not mean the script has stopped. Use the available “Refresh Status” control to check the current run before deciding whether to try again.

### 7. File Management

Select “Files” in the top navigation to open “File Manager.”

The SD Card is removable storage, and SPIFFS is internal device file storage. Select “SD Card” or “SPIFFS” to switch locations. The path at the top shows your current folder. Select a folder name in the path to go back to it.

#### Browse and Manage Files

- Select a folder name to open it.
- Select the download button beside a file to save it to the browser's download location.
- Select the rename button, enter a new name, and confirm.
- Select “New Folder,” enter a folder name, and create it.
- Select the refresh button to reload the current directory and storage state.

Uploading, deleting, renaming, creating folders, and mounting or unmounting the SD card require a valid login. Reading and downloading protected Automation files also has a root permission check. To access these files, confirm a valid root login and use the configuration pages. Do not change the path or use another entry to bypass permission checks.

#### Upload Files

Files can only be uploaded to the SD Card, not SPIFFS. Confirm that the SD Card is mounted first.

1. Select “SD Card” and open the folder where you want to upload the files.
2. Select “Upload Files.”
3. Select one or more files, or drag files into the upload area.
4. Review the upload list and remove unwanted files.
5. Select “Upload” and wait for each file to show completion.

Uploading a `.tscfg` package opens verification and application steps. However, this file-upload page does not yet apply the package's settings. Successful upload or verification does not mean the settings are in effect.

Import rule packages on Automation, as described in Chapter 12. Ordinary file upload is not a substitute for rule import. See the Security Guide for source and signature guidance for other packages.

#### Batch Operations

After selecting files or folders, the batch toolbar appears.

- “Batch Download” downloads selected files. Folders are not included.
- “Batch Delete” deletes selected files and folders.
- “Clear Selection” clears the current selection.

#### Delete a File or Folder

Deletion cannot be undone in the WebUI. Deleting a folder also deletes all of its contents. Confirm the name and path before selecting “Delete” or “Batch Delete” and approving the prompt.

Files managed by Automation are protected. Uploading or overwriting files in `/sdcard/config/automation`, or deleting or renaming that folder or a parent containing it, may be refused. If the message says that Automation manages the file, use “Configuration & backup” on Automation or the relevant list. Do not use Terminal to bypass the restriction.

#### Mount and Unmount the SD Card

Unmounting makes SD files temporarily unavailable. Finish uploads, downloads, and other file operations, then select “Unmount SD.”

Unmounting or replacing the card may switch Automation to its internal emergency configuration. That copy may be older, and enabled automatic rules may still run. Without a usable copy, Automation may be unavailable. Review the emergency configuration and tasks before unmounting (Chapter 13). Card-based images, fonts, and logs become unavailable.

When the SD Card is not mounted, the page shows “Mount SD.” Select it, wait for the state to change to “Mounted,” then open the SD Card directory again.

Mounting the card does not mean Automation has switched to its configuration. After reinserting a card, choose which configuration to use as described in Chapter 13. Nothing is overwritten or merged automatically.

### 8. OTA Updates

On the “System” page, select “OTA Update” in the “Network & Time” section to open “Firmware Upgrade.”

The device reboots during an update, temporarily disconnecting the WebUI. Save active work and keep device power stable before starting. Do not power off the device while update progress is incomplete.

#### First Upgrade from an Older Version to 0.6.3

The first upgrade from an older storage layout, such as 0.6.2, needs a matched USB / serial package approved by the publisher. Uploading only the firmware or WebUI cannot complete this upgrade. Ask the device administrator or provider to follow the package instructions. Do not erase the whole flash or use an old partition table.

Save important files before upgrading. The matched tool preserves keys and the SD card; it does not clear configuration on the card. The first startup may still read or migrate existing configuration. Customer delivery follows the “clear old configuration and configure again” procedure. The device administrator or provider must follow the delivery instructions. Do not erase the whole flash yourself or treat preserved files as completed configuration.

Keep power connected during the upgrade and first startup. Afterward, check login, networking, fans, lighting, SSH hosts, and Automation rules. Review rules before testing any task that controls power, restarts a device, or runs remote commands.

The matched package updates both application slots. Do not assume that the other slot still contains the old version. If the root password is lost, use only a recovery method confirmed by the provider to match the 0.6.3 layout. Do not flash an old password-reset image.

The web update methods below apply only to versions the publisher has approved for OTA. They do not replace the first layout upgrade.

#### Check for Updates from an OTA Server

1. Review the “Current Version.” Two 0.6.3 installations can be different revision builds. Check the full version, build time, and publisher's instructions rather than only the first three numbers.
2. Enter the OTA server address supplied by an administrator or publisher.
3. Select “Save,” then select “Check Update.”
4. The page reports “Update Available,” “Already up to date,” an older server version, or an error.
5. Confirm the target version, then select “Upgrade Now” or the upgrade control shown by the page.
6. Wait for download, installation, and reboot to finish. To cancel, use the “Abort” button when it is available. Not every stage supports cancellation.
7. Wait for the page to confirm the firmware after the upgrade. Reconnect to the WebUI and check “Current Version” and device status.

“Upgrade Progress” shows the current stage in its own section. A 100% reading or a message that files were written does not confirm a completed restart and version check. If the result is unconfirmed or the running firmware differs from the target, keep the message and check the current version. Do not repeat the upgrade without checking. Check System Logs and contact the provider if needed.

When “Also upgrade www” is enabled, the firmware and WebUI are updated in sequence. Use matched firmware and WebUI resources from the same release. If the old interface remains after upgrading, force-refresh the browser and check the version and page again.

#### Manual Upgrade

Expand “Manual Upgrade” and choose one of these methods:

- “Upgrade from URL”: Enter the firmware URL, set “Also upgrade www” according to the release instructions, then select “Upgrade.” Here, www refers to the device’s web-interface resources.
- “Upgrade from SD Card”: Enter a firmware path such as `/sdcard/firmware.bin`. If “Also upgrade www” is enabled, ensure that `www.bin` from the same release is in that directory.

For an upgrade from a URL, “Skip certificate check” skips verification of the HTTPS server certificate. This removes the certificate check used to confirm the download server’s identity. Leave it unchecked for routine updates. If you see a certificate error, ask your administrator to check the server address and certificate.

#### Partition Management and Rollback

“Partition Management” shows the running partition and other available partitions.

- “Mark Valid” confirms the running version and disables automatic rollback protection for that version. Use it after confirming that the current version operates correctly.
- “Rollback to This Version” selects another bootable version and switches through a reboot. Rollback interrupts current services. Confirm the target version and data compatibility first.

After the operation and reboot complete, reopen the WebUI and verify the current version and device state.

Version 0.6.3 changes configuration storage and the device partition layout. Do not return directly to incompatible old firmware. If a downgrade is needed, ask the device provider to confirm a complete firmware, layout, and configuration recovery procedure.

Rollback does not restore the old configuration format or guarantee that old rules will work.

### 9. Security Management Entry

Select “Security” in the top navigation to open security management. Use the TianshanOS Security Guide for SSH keys, remote hosts, known-host fingerprints, HTTPS certificates, configuration packages, and account management. These procedures are not repeated here.

#### Failed or Unconfirmed Operations

A red field error tells you what to correct. Fix it, then save. A cleared error mark does not confirm a successful save; check the message and list.

Check which operation failed, then read the reason and next step. If the message gives no reason, do not guess.

Select “Details” when available. Select “Hide” to hide the details. If a × button is shown, select it to dismiss the message. For further checks, keep a record of the message and details, then open “System Logs” on Terminal to investigate.

If a message or its details are long, scroll within that area to read the full content before deciding what to do next.

If the result is unconfirmed, refresh and check the device, file, or task state. A timeout or lost connection does not mean the operation failed to run. Do not immediately repeat power, delete, task-start, or upgrade operations. If the result remains unclear, open “System Logs” on Terminal to investigate.

Check successful, failed, and unconfirmed batch results separately. Confirm saved files in the browser’s download list.

## Part II: Root-only Functions

### 10. Terminal and System Logs

“Terminal” is shown only to root. It can run device console commands directly and display device logs. A command may change device state immediately. Confirm its source, parameters, and impact before entering it.

#### Connect to and Use Terminal

1. Select “Terminal” in the top navigation.
2. Wait for “Connected to device” and the `tianshan>` prompt.
3. Enter `help` to view the commands provided by the current firmware.
4. Enter a command and press Enter. Wait for its output to finish and the prompt to return.

Input is not executed while the page shows “Not connected to device.” After a disconnect, wait for the reconnection message before submitting a command again to avoid duplicate execution.

If another terminal session is in use, close the original terminal first. If connections are full, wait for reconnection rather than opening more tabs. After an expired login, sign in again and wait for Terminal to confirm the connection.

While a command is active, wait for completion or request a stop. If the page says it is waiting for the task to exit safely, stopping is still in progress. Wait for the prompt before entering another command. If output is incomplete, check the task result and System Logs separately. Missing output is not a reason to run the command again.

Terminal supports these keyboard controls:

| Control | Purpose |
| --- | --- |
| Ctrl+C | Clear the current input and request an interrupt. The command must support interruption for it to stop. |
| Ctrl+L | Clear the screen. |
| ↑ / ↓ | Browse command history from the current page session. |
| ← / → | Move the cursor within the current input. |

“Clear” at the top of the page only clears the display. It does not undo commands that have already run. “Disconnect” ends the current Terminal connection.

#### Open a Remote SSH Shell

An SSH Shell sends subsequent keyboard input to a remote host. Confirm the target address, user, and authentication method, and complete the SSH preparation described in the Security Guide before connecting. If the web terminal requires host verification, check and confirm the fingerprint on Security before reconnecting. Do not answer a confirmation in a serial console or another person's terminal on its behalf.

1. Enter `ssh --help` to view the SSH command options.
2. Enter `ssh --host <host> --user <user> --shell`, replacing each placeholder, including its angle brackets, with the actual value. To specify a port, add `--port <port>` before --shell.
3. Wait for the remote connection confirmation before entering remote commands.
4. Press Ctrl+\ to leave the SSH Shell and return to the tianshan> prompt.

Do not enter plaintext credentials while the terminal is being shared, recorded, or viewed by another person.

#### View System Logs

Select “System Logs” at the top of Terminal to open the log window.

- “Level” sets the minimum displayed level. Use ERROR, WARN+, INFO+, or DEBUG+ to narrow the output.
- “TAG” filters by log source.
- “Search” filters the current logs by keyword.
- “Auto Scroll” follows new log entries when enabled.
- The refresh button reloads historical logs.
- The clear button clears only the logs currently shown in the window.

If filtering produces no output, clear TAG and Search first, then change Level. Closing the log window does not stop device services.

#### Check Where Automation Is Saved

For a command-line check, enter `auto --config status` to view the current configuration location and backup status. Use `auto --help` for the available options. The old `config --sync` option has been removed. Use the web steps in Chapter 13 for routine backup and recovery.

### 11. Manage and Run Remote Commands

“Commands” stores reusable SSH commands and runs them on a selected remote host. Remote hosts and their authentication information are managed on the “Security” page. See the Security Guide for those procedures.

#### Check the Host Fingerprint Before Connecting

A fingerprint helps identify the host you are connecting to. These steps apply to SSH host tests on the web “Security” page, not to the Terminal SSH Shell confirmation flow. If the message says that the fingerprint is unregistered or has changed, do not keep executing the command. Open “Security,” find the target SSH host, and select “Test.”

For a first connection, the confirmation dialog shows the host address and fingerprint. Check them with the host administrator through a trusted channel. Select “Trust & connect” only after confirming a match.

If the fingerprint has changed, the dialog shows both the stored and current fingerprints, with “Cancel” selected by default. Reinstalling the host can change its fingerprint, but a change may also mean that you have reached another host or an impersonator.

Check the address and confirm the reason through a trusted channel. Select “Cancel” if you cannot confirm it. Do not delete the old fingerprint to skip this check. Select “Update Host Key” only after confirming that the new fingerprint is trusted.

#### Select a Host and View Commands

1. Select “Commands” in the top navigation.
2. Choose a host currently shown under “Select Host.”
3. Review its saved items under “Command List.”

Command text is collapsed by default. Select “Show command” to see all its lines, or “Hide command” to collapse it. Expanding the text does not execute it.

“Orphan Commands” have no usable host and cannot run. Prepare a valid host, edit the command, choose that host, and review the content. Enable and save it only when execution is allowed. Check the templates and rules that use it. A new command with the same name is not needed just to reconnect it to a host.

To change a host address, port, account, or key, use edit in the SSH host list on Security; see the Security Guide for the full steps. Changes apply to later connections. Existing tasks remain managed using the original host details in their run records. Before deleting a key, review the related hosts and run records. Deleting a key does not stop remote tasks, but may prevent this device from checking or stopping them.

#### Create or Edit a Command

A saved command runs on a remote host. Verify the command and required permissions on that host before saving it. Take extra care with commands that delete data, shut down or restart a host, or overwrite files.

1. Select a host, then select “New Command.” Use the edit button on an existing command to change it.
2. Enter a unique “Command ID,” such as `model.v1`. Do not use line breaks, control characters, slashes, or only `.` or `..`. It can hold up to 31 English letters or digits; Chinese and some other characters use more space. Follow the field's length message.
3. Enter “Command Name” and “Command.” Put each command on a separate line when using multiple lines.
4. Add a description and choose an icon or an image from the SD Card if needed.
5. Check the host, enable setting, run mode, and output-matching options, then select “Save.” Creating a duplicate ID reports an error instead of overwriting the existing command. Use the existing command's edit button to change it.

The name helps you recognize a command; Automation uses its ID to find it. You cannot change an existing command's ID. To use a new ID, create a command and update the templates and sources that use it.

#### Execute a Command and Review the Result

1. Select the execute control on a command card.
2. Watch the output and status under “Execution Result.”
3. When “Cancel” is shown, use it to request interruption of the current session. Check the state and output to confirm whether it stopped. Completed remote operations are not undone.
4. Select “Clear” to remove the current result display.

“Clear” does not undo work already completed on the remote host. Success, failure, extracted content, and final status depend on the command's matching settings.

The page checks this execution's result without running the command again. If automatic result checks pause, reopen Commands in the same browser tab to continue checking. Logging out, restarting the device, or a result no longer being retained may prevent recovery. Check the actual remote state before deciding whether to run it again.

Distinguish the command's exit result, condition matching, and log completeness. “Execution completed with confirmed exit code 0” confirms a normal exit. Incomplete collected output can still leave matching and extraction unconfirmed. Missing log output on the page does not mean the remote command failed. Follow the message to check the original output and target host.

#### Configure Result Matching

Result matching converts remote output into a status that is easier to use.

- “Expected match”: Marks the result successful when the output contains the configured text.
- “Fail Match”: Marks the result failed when the output contains the configured text.
- “Extract regex”: Uses one `(.*)` capture group to save selected output.
- “Stop on match”: Requests an end to a continuing command after a configured result matches. Check the final state as well.
- “Timeout (s)”: Sets how long to wait for a match, in seconds. It applies only when a success or failure pattern is set, or “Stop on match” is enabled.
- “Variable Name”: Saves status and extracted output for use on the Automation page.

Choose stable, specific success and failure text. Broad text can produce incorrect matches. Execute the command once and review “Match Results” before using its variables in a rule.

When Automation references this ordinary SSH command, it also uses the saved matching, extraction, and stop-on-match settings. A match already found may be retained when the execution deadline is reached. A match or the absence of a timeout does not prove the remote process ended. Check the exit code and actual state too.

#### Use Background Execution and Service Mode

nohup means a command continues to run in the remote host's background after the SSH connection closes. Closing the WebUI does not stop a background task.

Background runs require SSH key authentication. Deploy the public key on “Security,” then select the associated host. Do not save plaintext passwords in background commands. The same key must remain available to stop or verify the original task.

After enabling “Run in background (nohup)” and executing the command, select “Run records” on Commands. The root-only control on System and the control on Automation open the same list. Records include tasks started earlier, not proof that they are still running. Starting a task also checks related earlier records.

1. Find the original task by its name, user, host address, and port.
2. Select “Verify remote state” to check this run on the original host. “Refresh” only reads known records; it does not replace verification.
3. Select “View Log” to read the last 100 lines from the original host. Select “Follow log” for updates. “Stop following” stops only the page updates.
4. To end the task, select “Stop” on its record and confirm. Wait for the result, then verify that it has stopped. Do not start it again without checking.

After a device restart, old records show “Not checked.” “Remote state unconfirmed” means neither stopped nor running. “Last result” describes the last confirmed result, not a guarantee of the current state.

A failed read does not mean the log is empty or the process has exited. Check the original host connection, log path, and SSH key. Verify again after resolving the issue; do not restart a task just because its status check failed.

If the log is no longer on the original host, the host may have restarted or temporary files may have been cleared. This differs from an empty log and does not prove the task never ran. Verify the remote state or ask the host administrator to check.

Deleting a command, changing its host configuration, or switching Automation configurations does not end a remote process. Manage the original task from “Run records.” Recreating a command with the same name or ID does not take over the original task. Keep any key still needed to control it.

“Service Mode” watches a background task until it becomes available. Provide “Ready match” and “Variable Name.” Adjust the optional failure pattern and timing settings as needed:
- “Ready match”: Marks the service ready when the configured text appears. Use `|` to separate multiple patterns.
- “Fail Match”: Marks the service failed when the configured text appears.
- “Ready timeout (s)”: Sets the longest wait for the ready state, in seconds.
- “Check interval (ms)”: Sets how often the log is checked, in milliseconds; 1000 ms is 1 second.
- “Variable Name”: Stores states such as checking, ready, and timeout.

Service-mode tasks may be starting, verifying, stopping, or unconfirmed. Wait for the final result after a request is accepted. If a background run record already exists, verify that original run and confirm it has ended before starting again. An enabled automatic rule may start the service again. Disable that rule first if the service must stay stopped.

#### Import and Export Commands

- Use the export button on a command to export it and, when selected, include its dependent host configuration.
- Select “Import Command,” choose a `.tscfg` configuration package, preview its contents, and decide whether to overwrite existing configuration.

Import may include a remote host and replace configuration with the same ID. Review the command, host, and replacements in the preview before confirming. Saving updates the current configuration without a restart. Existing remote processes do not stop or move to the new host.

New imports check the source, signature, signing permission, and target device. A successful export does not guarantee a later import. A device certificate intended only for HTTPS may lack permission to sign configuration packages. Ask the configuration provider to resolve this; do not disable verification.

#### Check the Impact Before Deleting a Command

After selecting delete, review the linked templates and rules. Choose an available replacement command, or unlink the affected configuration and disable its rules. See Chapter 12 for the steps. Deletion changes only the configuration in use; it does not update the other emergency copy.

Deleting configuration and stopping a remote service are separate operations. Deleting does not stop the service or undo completed operations. To end a remote task, stop it from “Run records” and confirm the result.

### 12. Automation Management

“Automation” connects data and operations into repeatable workflows. Create data sources and action templates, then use rules to decide when to run them.

```text
Automatic: Data source → Variable → Rule evaluation → Actions
Manual: System-page Quick Action → Actions
```

Sources read data, variables hold values, rules evaluate conditions, and templates define tasks. Showing a rule on the panel and allowing manual execution are separate settings. Automatic rules can also appear on the panel.

#### View and Control the Automation Engine

The top of the page shows the engine state, rule, variable, and source counts, trigger count, and runtime.

| Control | Effect |
| --- | --- |
| “Start” | Starts a stopped engine. Enabled rules run only if the current configuration permits execution. |
| “Pause” | Pauses further automatic evaluation. Existing actions may continue. To resume through the page, stop the engine, then start it. |
| “Stop” | Attempts to stop rule checks, data reading, and scheduling later actions, while keeping configuration. Wait for confirmation; a timeout does not mean the engine has stopped. |
| “Reload” | Reads configuration again from the location in use. Save edits and check the result. An existing configuration pause remains in place. |

Check whether cooling, alerts, or other ongoing tasks depend on Automation. Stopping the engine does not stop a remote background process. Stop remote tasks from “Run records” and confirm the result.

“Disable automation” under “Configuration & backup” is separate from the engine's “Pause” control. If the configuration is paused, review it before selecting “Enable automation.” Restarting the device, reloading, or stopping and starting the engine does not clear this configuration pause. See Chapter 13.

#### Build a Minimal Automation Workflow

1. Create a source and use its test to check the connection and selected fields.
2. Enable it, then use the row’s “View Variables” icon to check values and update times.
3. Create a template, review its parameters, and select “Test.” Testing runs the action immediately; confirm that the device and host can accept it.
4. Create a rule with “Enable immediately” off. Set conditions, cooldown, action order, delays, and repetition.
5. Set “Show on panel” and “Allow manual trigger” as needed.
6. Save, then enable the rule. Check variables, trigger counts, and actual results.

#### Manage Data Sources

Select “Add” under “Data Sources” and choose a type:

| Type | Purpose |
| --- | --- |
| “REST API” | Periodically reads data from an HTTP address. |
| “WebSocket” | Receives data pushed over a persistent connection. |
| “Socket.IO” | Receives events from a Socket.IO service. |
| “Command Variable” | Reads the results of a configured remote command. |

1. Enter a unique ID, display label, and the required connection information.
2. Use the test to check the connection. Obtain addresses, authentication details, and field information from the data provider.
3. For the first three types, select fields from the test response. Leaving a Socket.IO event name blank lets the test attempt event discovery.
4. For a Command Variable, select the host and a command with a configured variable name, then set the polling interval.
5. Check the enable switch in the form, save, and use “View Variables” on its row to check the result.

Source rows provide an enable switch, variable viewer, edit, export, and delete controls. Check which rules use a source before disabling or deleting it, so you do not disrupt their tasks.

To change an existing source, select its edit button. Review the address, authentication, collection interval, and enable state, then save. Existing field mappings remain in place. Use “View Variables” afterward to check the source, values, and update times. Intervals in the edit window are in seconds, with up to three decimal places. Creating a duplicate ID does not overwrite the existing source.

REST collection uses the saved GET or POST method. WebSocket receives pushed data; Socket.IO uses the configured event and address. After a successful test, check that actual collection keeps updating. A Command Variable source only reads existing status; it does not start a command. Run the command separately when a new result is needed.

Import and export use configuration packages. Preview IDs, types, and replacements before import, and follow the Security Guide for source and trust requirements.

#### View Variables

Select the eye-shaped “View Variables” icon on a source row. The window shows names, types, values, and update times. Remote-command variables can also be viewed from the command’s variable control.

- Confirm the names and source, and check that values and types suit the rule’s comparisons.
- Check whether update times match the expected data frequency.
- If no data is available, check that the source is enabled, then test the connection and fields. For command variables, check the command’s execution result too.

#### Manage User Variables

Select “User variables” on Automation to view variables and initial values you saved. This list does not contain the device's live collected data.

1. Find the variable and select its delete icon.
2. Review the affected sources, templates, and rules. Follow the page to delete or handle their links.
3. Read the list again after confirming. Check the related configuration's enable states and run results. Removing an initial definition is not the same as clearing all live data.

#### Create and Test Action Templates

Select “Add” under “Action Templates” and choose a task type:

| Type | Purpose |
| --- | --- |
| “CLI Command” | Runs a local device-console command. |
| “SSH Command” | Runs a remote command saved on the Commands page. |
| “LED Control” | Controls LED colors, effects, or matrix content. |
| “Log” | Writes a message at the selected level. |
| “Set Variable” | Assigns a value to an Automation variable. |
| “Webhook” | The option remains visible, but action execution is not implemented. It cannot currently send a request. |

Enter a unique ID, a name, and the type-specific parameters. Set a delay or “Async Execution” if needed. An asynchronous action continues in the background; check its final result through logs, variables, or the target device.

- CLI: Enter the command, with an optional result variable and timeout.
- SSH: Choose a configured host and command, and check the preview.
- LED: Choose a device and supported color, effect, brightness, text, image, QR-code, or filter operation.
- Log: Choose a level and message; the message can reference variables.
- Set Variable: Enter the variable name and value.
- Webhook: Currently unavailable. Choose a supported action instead. Rule packages containing Webhook actions cannot be imported either.

“Test” runs the action. Check the effect of power, reboot, remote-command, or external-request operations before testing. A queued message means the task was accepted, not that it succeeded. Check System Logs and the target device too.

After editing, save and check the parameters. If saving fails, keep the draft and correct the reported issue. Imports may replace templates; review the deletion impact before removing one. If an image or font is missing, insert the original SD card or select an available resource. The emergency backup does not save these files.

#### Delete Configuration and Handle Its Links

Deleting a rule, template, SSH command, host, source, or user variable can affect other configuration. Save an emergency backup first if you will need it. Deletion cannot be undone from the page.

1. Select delete in the relevant list. Review the target name and affected items.
2. Confirm deletion if there are no links. Otherwise, choose an available replacement or “Unlink and disable affected rules.”
3. Refresh the list afterward. Confirm removal and check the linked templates, rules, and enable states.

Unlinking a deleted template removes its action from affected rules and disables those rules. Deleting an SSH command leaves linked templates as disabled drafts with the command reference cleared; affected rules are unlinked and disabled. Before choosing a replacement, check its target, action, and data, not just a similar name. If the replacement cannot supply the required data, related configuration may be disabled and kept for editing.

When deleting a host, also review affected commands and sources. A command without a host cannot run. Edit it to choose a valid host, then check related templates and rules before enabling it. Deleting local host configuration is separate from revoking a remote public key; see the Security Guide.

After deletion, the page reports deleted, disabled, and relinked items separately. Check the actual list. Handling links does not mean every related item was deleted or is ready to run.

#### Use Force Delete When Needed

If ordinary deletion cannot complete, select “Force delete.” Read the explanation before confirming. It deletes the target, clears links it can identify, and disables affected rules. It does not stop remote background services.

If the full impact cannot be confirmed, the page asks you to check “I agree to pause automation and continue deleting.” Automation stays paused afterward. Review and repair the remaining configuration, then select “Enable automation” in “Configuration & backup.” Do not rely on a restart to resume it.

If configuration changes during confirmation, select “Review deletion impact,” review the new list, and confirm again. Force delete cannot guarantee completion when storage writes fail. Read the list again to check; a disappearing card does not prove the deletion was saved.

#### Create a Rule

1. Select “Add” under “Rules” and enter a unique ID, name, and icon.
2. Choose “Logic”: AND requires all conditions; OR requires any condition.
3. Set the cooldown for automatic triggers. Values are in ms; 1000 ms is 1 second.
4. Add conditions and choose a variable, comparison, and value. Comparisons include equal, not equal, greater than, greater or equal, less than, less or equal, value changed, and contains. Match the value type to the variable.
5. Add templates and set any action delays, repetition, and action-level conditions.
6. Set “Show on panel” and “Allow manual trigger.” The first controls card visibility on System; the second controls manual execution.
7. Review, save, and then enable the rule. Leave “Enable immediately” off while configuring it for the first time.

Saving, enabling, or disabling a rule updates the current configuration without a restart. If Automation is paused, saving does not resume it. Refresh the list and check the result. Update the emergency backup after important changes, as described in Chapter 13.

Temporary automatic-start failures are retried every 30 seconds for up to 360 seconds. An unconfirmed result is verified before another launch. Retries in that attempt continue from the unfinished background-start step; completed earlier steps are not repeated. If the page says it has stopped trying or the wait has ended, follow the message before deciding whether to start manually. Manual failures are not automatically retried.

Changing related configuration allows a failed attempt to try again. Successful attempts still follow the normal cooldown. Cooldown limits automatic triggers; it is not the only thing to check after a failure.

You can save up to 64 rules. This is not a guarantee that 64 tasks can run at once. Command length and the number of conditions and actions also affect storage and memory. If capacity is insufficient, remove unneeded configuration or reduce its content before saving.

Match the value to the selected type. For a number, enter a specific value, not infinity or NaN (an invalid number). Enter text, a boolean (true or false), or null for the other types. Do not enter a whole JSON object or array. If the page reports an error, check the variable, comparison, and value before saving again.

#### Configure Repetition and Action Conditions

| Mode | Meaning |
| --- | --- |
| “Once” | Runs once per trigger. |
| “Repeat while true” | Repeats while the action’s condition holds, up to 100 times per run. |
| “Fixed count” | Repeats for the configured count and interval, checking the action condition before each execution. |

Action conditions are separate from rule-trigger conditions. Without an action condition, “Repeat while true” continues to the per-run limit. The rule may trigger another run later.

Disabling a rule prevents new triggers; a run already started may continue. To stop scheduling later actions, select the engine's “Stop” control and wait for confirmation. Check actions already sent and remote processes separately. Completed operations are not undone.

#### Create a Quick Action

“Manual Trigger Only,” “Show on panel,” and “Allow manual trigger” control whether a rule runs only manually, whether its card is visible, and whether users may execute it.

1. Enter the ID, name, and icon, then enable “Manual Trigger Only.” Such a rule needs no automatic trigger conditions.
2. Add templates and review delays, repetition, and action conditions.
3. Enable “Show on panel” and “Allow manual trigger,” then save and enable the rule.
4. Return to the System Device Panel. Check the card’s name and state, run it once, and review the result.

Automatic rules can also appear on the panel. Showing a card does not make its rule manual-only. A disabled rule may remain visible but cannot start. Name actions to explain their effect. For background SSH tasks, admin can use the card's log and stop buttons; configuration changes remain root operations. Root can also view logs, verify, and stop services from “Run records.”

#### Import a Rule Configuration Package

Import rule packages on Automation, not through Security's “Verify Only” or file upload. This control checks the signer, target device, and required configuration. Verify each package through its own import control; another package's result does not apply.

Before importing, prepare:

- Confirm whether the SD card or internal emergency configuration is in use, and that it can be saved. See Chapter 13.
- The device has a valid certificate, its matching private key, and a CA chain; its time is verified. A CA chain checks certificate origins. See the Security Guide for installation steps.
- The deployment administrator has selected a trusted signer. Root login or installing HTTPS certificates does not complete this setting. Ask the deployment administrator to configure it if it is missing.
- The rule's templates, commands, and hosts are ready. Import does not install these for you. Add any missing configuration first. If the rule is enabled, also check the enable state of the configuration it uses.

Saving an import updates the current configuration without a restart. Before confirming, check the enable state, conditions, actions, and targets, and confirm that execution is safe. An existing configuration pause remains in place. To prevent execution, disable Automation first or ask the provider for a disabled version.

1. Select the import icon under “Rules” to open “Import Rule Configuration,” then choose the `.tscfg` file. Verification starts and the page displays a preview.
2. Wait for “Signing trust, target device and rule content verified.” Check the name, rule ID, and “Rule summary.” Expand “View rule content” to review conditions, actions, targets, and enable state; do not rely on the filename.
3. If the same ID exists, review what will be replaced. Select “Overwrite existing configuration” only if you intend to replace it. If the file, credentials, or configuration change after preview, select “Check package again.” Close and reopen the editor if the page asks you to, then verify again.
4. Select “Confirm Import” and wait for the save result. Check the rule list, enable state, and required variables. A successful save does not prove successful task execution.
5. If the rule permits a safe manual check, run it once and check the device or host. For other rules, watch the logs and results after a normal trigger. To clear a configuration pause, review the configuration before selecting “Enable automation.”

Imported rules can be edited, enabled, disabled, and deleted. Check the current configuration after edits and update the emergency backup if needed. A later import still requires signature verification; permission to edit locally does not bypass it.

A certificate intended only for HTTPS may not authorize configuration signing. A successful local export may still be rejected on import. Ask the provider to resolve the certificate-purpose issue; do not disable verification or repeat the import.

Imports and edits do not undo completed actions or stop remote background processes. End those tasks separately from “Run records” and confirm the result.

#### If Import Does Not Complete

##### Verification Failed

| Message or issue | Next step |
| --- | --- |
| Signing root not selected, signer untrusted, or signer unauthorized | Ask the deployment administrator or configuration provider to check the signing source and certificate permissions. Do not substitute Security's “Verify Only” or disable verification. |
| Package targets another device | Ask the provider to export it using this device's certificate; do not change the name inside the package. Arrange matching replacement packages before changing this device's certificate too. |
| Device time is unverified | Check and synchronize time under “Network & Time” on System, then verify the file again. |
| Configuration loading | Wait for it to finish, then verify the package again. |
| Configuration failed to load | Check System Logs, resolve the cause, and restore configuration before verifying again. |
| Required configuration missing | Add the template, command, or host named by the page, then verify again. |
| Required configuration disabled | Check whether it should be enabled. Once it is safe to run, enable it and verify again. |
| Unsupported action | Ask the provider to revise the package. Rule-package import currently rejects Webhook actions; their presence in the template selector does not mean the package can be imported. |
| File, credentials, or configuration changed after preview | Select “Check package again.” Reopen the editor or select the file as instructed, then review and confirm. |

##### Save Incomplete

| Message or issue | Next step |
| --- | --- |
| Current storage unavailable or full | Check the location in “Configuration & backup.” Resolve the storage issue or reduce unneeded content, then verify again. |
| Current configuration or save location changed | Keep and copy the draft. Reopen the editor, review the latest configuration, and submit again. Do not keep selecting save. |
| Save outcome unconfirmed | Refresh and check the rule content and enable state. If still unclear, inspect System Logs. Keep the original package and do not repeat the import. |

A condition variable without a sample is not necessarily missing configuration; check when it will update. If configuration cannot be read, keep the original files and check System Logs. Do not overwrite damaged content as though it were empty.

#### Maintain Rules and Configuration

- Manual execution requires an enabled rule that permits manual triggers, with no run of the same rule already in progress. It bypasses automatic trigger conditions and cooldown, but still applies action conditions, delays, and repetition.
- Disabling does not undo completed actions. Deletion cannot be undone from the page.
- Before editing sources, templates, or commands, check which rules use them. Configuration edits do not stop existing remote tasks. Verify and stop those tasks separately if needed.
- Import each package through its relevant list and review the preview. See the Security Guide for full signature and account procedures.
- If saving fails, read the message and retain the draft. If saving succeeded but refreshing failed, refresh and check the list before creating another item.

### 13. Configuration and Backup

Select “Configuration & backup” on Automation. Check “Currently using” before saving, restoring, or choosing a configuration. First review any effect on cooling, alerts, or remote tasks.

While using the SD card, find “Save current configuration” and “Restore saved configuration” in the emergency-backup group. Follow the steps below to select “Save emergency backup” or “Restore emergency backup.” The “SD card and automation” group contains card checks and Automation enable controls. Saving a copy does not switch configurations.

#### Distinguish the Three Types of Content

| Content | How it is saved |
| --- | --- |
| System settings such as networking, fans, temperature, and lighting | Saved inside the device. An Automation backup restore does not change them. |
| Current Automation configuration | Additions, edits, and deletions go to the SD card during normal SD use, or to internal storage in emergency mode. |
| Internal emergency backup | While using the SD card, it updates only when you select “Save emergency backup.” Emergency-mode edits update this internal configuration directly. |

The emergency backup saves rules, action templates, SSH commands, associated hosts, sources, and initial definitions of user variables together. It does not save private keys, images, fonts, logs, or remote run states. Host settings only remember which key to use; the key itself is not copied.

This is not a full-device backup. Keep important files and keys through their own backup methods. A restore does not mean remote services have stopped or that every file needed by a rule is available.

#### Save an Emergency Backup

1. Confirm that “Currently using” shows “SD card configuration,” then review the current rules and tasks.
2. Select “Save emergency backup” and wait for completion.
3. Check “Last internal save” and “Backup status.” “Includes the current changes” means the internal copy matches the current configuration.

Saving replaces the previous emergency backup. Later SD-card edits do not update it. If it does not include the latest changes, review the current content before deciding whether to save again.

While using “Internal emergency configuration,” edits are saved internally. You do not need to select “Save emergency backup” again.

#### Restore an Emergency Backup

A restore replaces the current SD-card configuration with the internal copy, which may be older. Export any current configuration and files you need first. Do not save an emergency backup first; that would overwrite the old copy you intend to restore.

1. While using the SD-card configuration, select “Restore emergency backup.”
2. Review added, changed, and removed items, and whether Automation will stay paused.
3. Confirm and wait for completion. The lists update without a device restart.
4. Check rules, hosts, variables, enable states, and task results. If still paused, review the configuration before selecting “Enable automation.”

A restore does not change networking, fans, or keys. It does not end running remote services. Manage them from “Run records” if needed.

#### When No Usable SD Card Is Available

If a usable internal configuration exists, the device switches to it. Enabled automatic rules still follow their conditions; manual rules still need a click. The internal copy may be older, so check which tasks may run before a planned switch.

Emergency mode permits additions, edits, and deletions. Saves go directly to internal storage. If no usable internal configuration exists, read the reason first. You can start with a valid new configuration, but do not overwrite damaged files as though they were empty.

Networking, fans, and other system settings still load from internal storage. Emergency configuration does not restore SD-card images, fonts, or logs. Insert the original card or select available files if resources are missing. A missing card does not mean all functions stop, or that every task can continue.

#### Choose a Configuration After Reinserting the Card

Insert a usable SD card and select “Check SD card,” then review the two choices below. Insertion does not switch or merge configurations. Close the panel to keep using internal configuration. Restarting does not make the choice for you.

| Button | What happens |
| --- | --- |
| “Use SD card configuration” | Reads and switches to the card's configuration. Internal configuration is kept, not copied to the card. |
| “Save current configuration to SD card and use it” | Replaces the card's configuration with the current internal configuration, then switches to the card. The old card configuration is overwritten. |

1. Check the current location and decide which configuration to keep.
2. Select the relevant button and review the replacement and enable-state notice. Before writing to the card, check the added, changed, and removed items.
3. Confirm and wait. Check that “Currently using” shows “SD card configuration,” then review the lists and task results.

Missing or empty card configuration is not filled from internal storage automatically. Confirm that an empty configuration is what you want before choosing it. If the card or configuration changes after preview, check again as instructed; do not reuse the old confirmation.

#### Distinguish Save, Switch, and Run Results

| Message or situation | Next step |
| --- | --- |
| Saved to SD card, but not switched | Internal configuration is still in use. Select “Use SD card configuration” to finish switching. Do not overwrite the card again. |
| Configuration saved, Automation still paused | Review the configuration, then select “Enable automation.” Do not save again or rely on a restart to clear the pause. |
| Deletion not saved, Automation paused | Check whether the target is still present and storage is available. Repair and review the configuration before deciding whether to enable it. |
| Save outcome unconfirmed | Read the location and content again. Check System Logs if needed. Do not submit the same change again without checking. |
| Current input differs from the latest configuration | Copy any draft you need before closing and reopening the editor. Review the latest content and enter your edits. The page does not merge drafts for you. |

After a successful switch, restore, or save, check whether tasks are allowed to run and whether they finish. A configuration pause remains in place; review and select “Enable automation” to resume. A pause caused by “Disable automation” or force deletion is not cleared by restarting or switching configurations.
