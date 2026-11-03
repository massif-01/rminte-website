---
id: "guide-security"
language: "en"
title: "TianshanOS Complete Guide to the Security Page"
source_commit: "92736a77e6441ce9af9ba232a3c355760e754df6"
prepared_on: "2026-11-03"
content_kind: "operating-instructions"
applicability: "TianshanOS 0.6.4"
source_files: ["website/guides/content/security.en.md"]
source_urls: ["https://rminte.com/guides/security"]
default_retrieval: true
evidence_status: "source transcription; not independent operational verification"
---

# TianshanOS Complete Guide to the Security Page

Version covered: TianshanOS 0.6.4. Reviewed November 3, 2026.

Use this guide to change device passwords, connect to SSH servers, check server identities, and manage certificates and configuration packages. For first-time setup, start with Chapters 1, 2, and 3. Work with your device or server administrator on certificate issuance and recovery.

> Use a trusted management network. The full web interface uses HTTP; installing a certificate does not switch it to HTTPS. Some certificate operations can still be called without signing in, so signing out does not replace network isolation. Do not expose device management access to public networks.

## 1. Before you begin

### 1.1 Find the task you need

1. Enter the target device's IP address in your browser and sign in with your device account.
2. Select Security in the navigation bar. Check the address before entering passwords or handling keys.
3. Use the table below to find the right section. Root also sees Account Security.

| Task | Where to go |
|---|---|
| Change the device's root or admin password | Account Security; Chapter 2 |
| Connect to a server using an SSH key | Key Management and Deployed Hosts; Chapter 3 |
| Copy keys, edit or remove a host, or check fingerprints | Key Management, Deployed Hosts, and Known Host Fingerprints; Chapter 4 |
| Request and install device certificates | HTTPS Certificate; Chapter 5 |
| Inspect or create general encrypted configuration packages | Config Pack; read the limitations in Chapter 6 first |

### 1.2 Accounts and device identity

- **admin** can open Security and manage SSH keys, hosts, and the certificate functions provided by the page. Account Security is not shown.
- **root** can also set root and admin passwords, restore admin access, and manage Automation configuration and the web terminal where root is required. Signed-in admin users retain the service controls provided on the home page.
- A **Developer device** has a development identity recorded in its certificate. This is not a login account. Exporting encrypted Config Packs and SSH host configurations requires this identity; signing in as root does not change it.

Operations that require sign-in check the account. Some queries and certificate operations still do not require sign-in. A visible button does not mean every account or device requirement is met. If permission is denied, check your session and the operation's requirements before trying again.

### 1.3 Prepare for the operation

1. Check that your computer and the target device are on a trusted management network.
2. Confirm the SSH address, port, account, and full host fingerprint with the server administrator.
3. Deploying or revoking a public key through the page requires the remote account's password and password authentication. The server administrator decides whether to keep password authentication enabled afterward.
4. Before revoking access, deleting keys, or replacing certificates, check that another management connection works, such as a server console, another administrator key, or the device's HTTP interface.

## 2. Change device passwords

These controls change TianshanOS login passwords. They do not change a remote server's SSH password.

### 2.1 The prompt after first sign-in

A password-change prompt appears after sign-in if the account is still marked as having an unchanged password. Set a long, unique password. Choosing to change it later only dismisses the prompt.

This prompt is not an account-settings screen that you can reopen at any time. If admin has already changed its password and needs another change, ask root to set it from Security.

### 2.2 Set a password as root

1. Sign in as root and open Security.
2. Under Account Security, find the root or admin password controls. Enter the new password and its confirmation.
3. Select Set root password or Set admin password. Use a unique password of at least 12 characters. English letters, numbers, and symbols help avoid differences in length counting.

The page states a limit of 4-64 characters; the device checks UTF-8 bytes. English letters, numbers, and common ASCII symbols each use one byte. Chinese characters usually use several. Four is the minimum accepted length, not a recommended password length.

**Check the result:** sign in with the new password in a private browsing window before signing out of the original session. Setting a new password does not automatically end existing sessions.

**If sign-in fails:** check the account and device address. Five consecutive failures trigger a lockout of about five minutes. Avoid repeated guesses.

### 2.3 Reset the admin password

Root can select Reset admin to default to restore the password to `rm01` and clear the login lockout. Sign in as admin in a new session and set a unique password immediately afterward.

> Use the default password only to recover access temporarily. Change it promptly and sign out of sessions you no longer need.

### 2.4 If you forget the root password

Contact the device administrator for a recovery method that matches the device. The current recovery firmware supports only the new configuration storage scheme and resets both root and admin passwords. Do not install old recovery firmware yourself. After access is restored, set a unique password for each account.

## 3. Connect to a server with an SSH key

For initial setup, create an RSA key, deploy its public key, review the result, and test the connection. Check the server fingerprint as part of this process. To retire a key, revoke access on every server, confirm that the old key no longer works, and then delete the local key.

### 3.1 Create a key

1. In Key Management, select Generate New Key.
2. Choose an unused key ID, such as `backup01`. Use no more than 10 English letters or numbers, with no commas. The actual limit is 10 UTF-8 bytes, not 10 Chinese characters.
3. Choose RSA 2048 or RSA 4096. RSA 2048 is the default. ECDSA options are also shown, but the current SSH workflow does not support them; choose RSA for SSH.
4. Add a comment or alias if useful. Enable Exportable only if you need to back up or migrate the private key. There is no page control for changing this option after creation.
5. Set Hidden if needed, then select Generate. Hidden affects display; it does not prevent access to the real key ID or the key.

**Check the result:** after the window closes and the list refreshes, find the intended ID and RSA type. Open Public Key and check that the complete text starts with `ssh-rsa`.

**While you wait:** do not submit again. Closing the window does not cancel generation on the device.

| Message or situation | What to do |
|---|---|
| The ID is already in use | Choose another ID. Creating a new key cannot overwrite an existing one |
| The key count limit has been reached | The device holds up to 8 SSH keys. Retire an unused key through the revocation process first |
| Storage or memory is insufficient | Resolve the device resource issue. Do not treat the failure as successful creation |
| The key was generated, but the list could not be refreshed | Refresh manually and check the key; do not generate it again |
| Generation has not been confirmed | Wait and check the record. Do not resubmit the same ID |
| Cleanup did not complete | Pause key creation and ask an administrator to check storage |

A record with the same ID does not prove that this attempt completed. If the result is uncertain, check the record and key material.

### 3.2 Deploy the public key

Deployment adds the public key to the remote account's authorization file, `~/.ssh/authorized_keys`, so the matching private key can sign in. It does not change the server password.

1. Select Deploy on the intended key's row.
2. Enter the server address, username, SSH port, and SSH login password.
3. Review the address and account, then select Start Deploy.
4. Read the result and check the corresponding record under Deployed Hosts.

> Deployment checks the host fingerprint before using the password. A changed fingerprint for a known host is rejected. However, initial deployment to an unknown host still saves and trusts its fingerprint without asking you to confirm it first. Use a controlled network and verify the full fingerprint through a trusted channel.

### 3.3 Understand the deployment result

| What the result tells you | What to do next |
|---|---|
| The key was deployed, the host registered, and public-key sign-in verified | Check the host details, then test the actual task |
| The key was deployed and the host registered, but sign-in is unconfirmed | Select Test. If it fails, check authorization and account settings through another connection |
| The key was deployed, but registration failed or is unconfirmed | Check the local list and remote authorization before deploying again |
| Deployment completed, but the list could not be refreshed | Refresh manually. A failed refresh does not mean the remote key was not installed |

Each deployment appends the key, so repeating it may create duplicate lines. Use another management connection to inspect the authorization file when the remote result needs confirmation.

### 3.4 Test the connection

1. Under Deployed Hosts, check the address, port, username, and key ID, then select Test.
2. If an initial fingerprint confirmation appears, compare the full fingerprint as described in Section 4.3 before choosing Trust & connect.
3. If the fingerprint has changed, the dialog shows both the stored and current values. Cancel and investigate first. Select Update Host Key only after confirming an authorized change.

The test attempts the fixed echo command `echo "TianshanOS SSH Test OK"`. The success message does not check the command's exit status or output. Use it only as a basic connection check; it does not establish that sudo or your application commands will work.

**If it fails:** check the network, SSH service, account, and remote authorization. Stop retrying if the server identity is uncertain or its fingerprint has changed.

### 3.5 Revoke remote access, then clean up local records

> Revocation affects future sign-ins. Check that another management connection works, and handle tasks that still need to be stopped or checked. Revoking a public key, removing a host, or deleting a key does not automatically stop remote programs.

1. Select Revoke on the host row, enter the server password, then select Revoke remote public key. You can also start from the key row and enter the target details.
2. Read the remote result. Successful revocation opens the local host deletion check. Local deletion still needs a separate decision; the record has not been removed automatically.
3. Through a trusted connection, check that the public key and any duplicates are gone from the authorization file. Confirm that the old key no longer works. Handle the resulting `authorized_keys.bak` under the server's backup policy so old access is not restored later.
4. If you want to remove the local host configuration, review its references and impact as described in Section 4.2 before confirming.
5. Once every target server and the related tasks have been handled, delete the old device key and unneeded private-key copies as described in Section 4.1.

**If no matching public key is found:** check the target account and remote authorization. Review and delete local host configuration handles only the local record; it does not replace that check.

**If revocation fails or is unconfirmed:** inspect remote authorization through a trusted connection. Keep the local key until the result is clear. Assess remote revocation and local deletion separately; a failure in one does not prove that the other never happened.

## 4. Manage keys, hosts, and fingerprints

### 4.1 Copy, export, and delete keys

Follow the instructions below for SSH key rows. The row named `https` holds the device certificate key. Deleting that row clears all certificate credentials; read Section 5.6 first.

**Copy a public key:** select Public Key and send the complete single-line value to the server administrator. Public keys can be shared. Access is granted when an administrator adds the key to an account's authorization list.

**Export a private key:** this is available only if Exportable was enabled during creation. Select Private Key on a trusted computer and isolated management network, then store it in an approved secret store. Clear temporary clipboard and download copies. Do not paste it into chat, tickets, or logs.

**If Copy does nothing:** browsers may restrict clipboard access on an HTTP page. Select and copy the text manually, then check completeness. Do not weaken browser security settings to enable copying.

**Before deleting a key:** revoke server authorization and review the hosts and run records listed in the confirmation. After deletion, this device cannot use that key to connect, check, or stop related tasks, while those tasks may keep running remotely. Handle them through another connection first. An incomplete impact list does not mean there are no references.

After confirming deletion, refresh and check the result. If storage deletion did not complete, inspect the current state and ask an administrator to resolve it. A missing list entry alone is not proof of completion.

### 4.2 Remove a host and handle its references

| Action | What it changes |
|---|---|
| Revoke a public key | Removes the matching remote authorization; requires the remote password |
| Remove a host | Deletes its device configuration and handles related commands and rules according to your choice |
| Delete a key | Deletes key material on the device |
| Remove a known-host fingerprint | Deletes a saved server-identity record on the device |

The last three actions neither revoke remote public keys nor stop remote programs. Deployed Hosts is only a local list; an empty list does not prove that remote access has been removed.

1. Select Remove on the host row and wait for Reference check.
2. Review the affected commands, templates, or rules. Choose a replacement host, or unlink references and disable affected configuration. A replacement must have the required account, key, and task environment.
3. Select Delete, read the result, and check the related commands and rules. Unlinked commands need a host selected before they can be enabled again.

Force delete is for a deliberate decision to remove configuration. It does not require the remote service to be stopped or its state to be known. If the impact cannot be established, you may need to select I agree to pause automation and continue deleting. Automation then stays paused until root checks the configuration and explicitly enables it.

> Do not force deletion just to clear an error. First establish who will manage remote tasks and which automatic rules will be affected.

If the configuration has changed, select Review deletion impact and decide from the new result. After a storage failure or unconfirmed result, refresh and inspect the configuration before deleting again.

### 4.3 Check the SSH server fingerprint

A fingerprint helps identify the server. This page shows a SHA-256 digest as 64 hexadecimal characters. OpenSSH tools commonly show `SHA256:base64`. Ask the administrator for the same format; these strings cannot be compared directly.

**Compare the full value:** select View under Known Host Fingerprints and compare it with one from a server console, asset record, or another trusted channel. The table shows only the first 32 characters, which is insufficient for a full check.

**When Test asks for confirmation:** an initial dialog shows the current fingerprint. A change warning shows both stored and current values and allows cancellation by default. Check the server, address, port, and maintenance record before deciding. Confirmation applies only to the displayed fingerprint; another change requires another check.

**If it differs or its source is unclear:** cancel and investigate. If a password was used over a suspicious connection, change it through a trusted connection and review sign-in logs and authorization. Do not send a password through the suspicious connection to revoke a key.

**After an authorized rebuild or host-key change:** verify the new fingerprint and change record, then select Update Host Key in the test dialog. Do not remove the old entry to bypass verification; removing it does not make the next connection trustworthy.

Fingerprints are stored inside the device and no longer synchronize with SD card fingerprint files. Configuration backups and SSH host imports do not include these records. Check server identities again after recovery or migration.

### 4.4 Edit a host

1. Under Deployed Hosts, select Edit.
2. In Edit SSH host, change the address, port, or login account. For key authentication, you can also change the login key ID. The port must be 1-65535.
3. Select Save, refresh and review the details, then test the connection. Check the full fingerprint when changing the target server.

Changes apply to future connections. Run records for tasks already started still use the original host details. Changing the address does not move or stop an old task.

### 4.5 Import and export SSH host configurations

Import Host is a dedicated workflow, separate from the general Config Pack controls in Chapter 6. The package contains the address, port, account, authentication method, and key ID. It contains no SSH password, private key, or saved host fingerprint, and grants no server access.

**To export:** on a Developer device, select Export on the host row. For another device, paste and verify its certificate, generate the package, and select Download. Confirm the file was saved. Signing in as root does not give an ordinary device export eligibility.

**Before importing:** verify the source, confirm that the package was made for this device, and check that the correct key is already present. A matching ID is not enough; its key material must match remote authorization. The current configuration location must be writable, but an SD card is not always required.

1. Select Import Host, choose the `.tscfg` file, and wait for checks to finish.
2. Review the host, address, account, and changes in the preview. Enable overwrite only when you intend to replace an existing configuration with the same ID.
3. Select Confirm Import. The device rechecks the package, credentials, and current configuration rather than relying on an outdated preview.
4. After a successful save, refresh and check the host list, then test the connection. The saved configuration takes effect immediately without a restart. The existing enabled or paused Automation setting is preserved.

This workflow checks the recipient device, signature, trusted issuer, and signer's eligibility during preview, then decrypts and checks the content. Also confirm the source through a trusted channel. A name or Official label alone is not enough.

**If checks fail:** follow the message to check device time, the device certificate, client CA chain, and trusted issuer settings. A certificate accepted for HTTPS is not necessarily eligible to sign Config Packs. Ask the device administrator to resolve this; do not install an unfamiliar CA just to import an unfamiliar package.

**If the preview expires:** select Check package again and review the changes. If the dialog must be reopened, preserve any needed input first and follow Section 7.2.

### 4.6 What backup and restore can bring back

SSH hosts are saved together with Automation rules, templates, commands, and related configuration. Normal operation uses the SD configuration. In internal emergency mode, edits are saved inside the device. Host imports, edits, and removals all write to the configuration currently in use.

Root can view the current location under Configuration & backup on the Automation page. Save emergency backup manually updates the complete internal copy; it does not synchronize after every edit. Restore emergency backup shows differences before replacing the current configuration, without a restart.

An older copy may bring back old hosts, commands, and rules, and may change whether Automation is enabled. Review the differences before restoring. Restore does not stop or restart remote services, or recover private keys or known-host fingerprints.

Deleting current configuration does not clean up the other manual copy. Arrange to update the emergency copy after retiring a host. Reinserting the SD card does not switch configurations automatically; root should choose which to use under Configuration & backup. Do not delete or overwrite internally managed Automation files through the file manager.

## 5. Configure HTTPS certificates and mTLS

The build configuration reviewed for this guide does not enable the HTTPS service. Certificate controls can prepare credentials, but do not establish that port 443 is open. If you need HTTPS, first ask the device administrator to confirm that the installed firmware enables it.

When enabled, the current HTTPS service provides health, identity, and permission-test endpoints, not the full web interface. The connection tests below apply to deployments with HTTPS enabled.

### 5.1 Know which certificate does what

- The **device certificate and private key** let the device prove its identity to clients.
- A **client certificate and private key**, held by a computer or service, let that client prove its identity to the device.
- The **client verification CA on the device** validates client certificates. It does not automatically make a browser trust the device certificate.

This two-way authentication is called mTLS. Clients must still trust the device certificate's issuer and check its access names, permitted uses, and validity. A CA is a certificate authority, or its certificate.

### 5.2 Read the status and set the device time

Saved, Within validity period, and HTTPS: Running describe stored material, time validity, and service operation separately. One does not establish the others.

| Status or situation | What to do |
|---|---|
| The device certificate, private key, or client verification CA is missing | Install the missing material |
| Awaiting device time | Check your computer's clock, then select Set device time from this computer (browser source) |
| Not yet valid or Expired | Check device time and certificate dates; arrange renewal if needed |
| Time validity is correct, but HTTPS is stopped | First confirm that firmware enables HTTPS, then resolve displayed credential, matching, or startup issues |
| The running service still uses previous material | Save other work, restart as instructed, and check the certificate actually in use |
| Saving or reading is unconfirmed | Refresh and check before installing or deleting again |

With HTTPS enabled in firmware, a stopped service attempts startup when credentials and time are ready. After setting the time, check the device clock, synchronization status, and HTTPS status. Installation success alone does not prove readiness.

### 5.3 Generate a device key and certificate request

> If a key already exists, read Section 5.6 first. Regeneration overwrites it and may prevent continued use of old certificates and packages.

1. Select Generate Key Pair. This creates a separate ECDSA P-256 private key, unrelated to SSH keys. It cannot be exported through this interface.
2. Select Generate CSR. Enter the device ID (CN), Organization, and Department, or leave all fields blank. Department corresponds to the certificate's organizational unit (OU).
3. Select Generate Certificate Signing Request and send the complete CSR to the CA administrator.

Use a short, stable device ID made of English letters and numbers. Form fields allow up to 63 UTF-8 bytes; Chinese characters use multiple bytes. Shorten fields if a length error appears.

**Check access names before issuance:** with custom fields, this form does not generate a Subject Alternative Name (SAN) list. With all fields blank, the device ID is fixed at `TIANSHAN-DEVICE-001`. Only the current IP is added if available; no DNS name is added. Have the CA administrator include the actual access IP or DNS name and check authentication purposes through a controlled issuance process. This form cannot edit SANs.

A CSR is only a request. It contains no private key and does not install a certificate. Check its public key, subject, and access names before issuance.

### 5.4 Install the device certificate

1. Obtain a PEM certificate that matches the current device private key. PEM is text with BEGIN/END boundary markers.
2. Select Install Cert, paste the complete text, then select Install.
3. Check the saved result, subject, issuer, and validity, then check the actual HTTPS status.

Installation checks format and key matching. Clients must still check trust, access address, and permitted uses separately.

To view the certificate text, select Cert on the `https` row in Key Management. Review or copy the complete PEM. You can share the public certificate with a Config Pack sender; keep the private key secret.

**If the key does not match:** find the certificate issued for the current CSR. Do not regenerate a private key just to clear the error. If the result is unconfirmed, refresh and check what was saved before deciding whether to retry.

### 5.5 Install the client CA chain and test

1. Select Install CA, paste one or more PEM CA certificates needed to validate clients, then select Install. Install only CAs approved by your administrator.
2. Check the status. With HTTPS enabled, a stopped service attempts startup once credentials and time are ready. If a running service needs to apply new material, restart as instructed.
3. Have an administrator access the appropriate test endpoints with a trusted client certificate whose purpose and role are correct.
4. Repeat with an untrusted certificate or no certificate, and confirm rejection.

**Check the result:** HTTPS is running with the intended certificate. Compare Active certificate SHA-256 if displayed. Trusted clients should access only the endpoints their roles permit. Verify both accepted and rejected connections separately on the target device.

### 5.6 Renew, replace, or delete credentials

**Certificate expiry:** reuse an uncompromised key to request a new certificate, install it, apply it as instructed, and test. Config Packs are tied to the recipient certificate fingerprint. Even with the same private key, an old package may be rejected when reloaded after a certificate change. Arrange replacement packages first.

**Private-key replacement:** the old CSR and certificate no longer match. Packages that depend on the old key may be unrecoverable. If the key was exposed, also ask the CA administrator to revoke the certificate. Generating a new key does not perform revocation.

**Delete all credentials:** first check that HTTP management access works and arrange for packages you still need. Delete Credentials removes the device key, device certificate, and client CA chain together. A public-certificate backup cannot recover a private key.

After deletion, refresh and check that material is missing. A running HTTPS service may still hold old credentials; deleting stored data is not immediate revocation. Restart as instructed, then confirm that old credentials are no longer in use. To restore service, prepare a key, device certificate, and CA chain again, then test.

## 6. Understand general Config Pack limitations

A Config Pack is an encrypted, signed `.tscfg` file. General controls in the Config Pack section differ from Import Host in Section 4.5. Do not use general-control behavior to judge dedicated host, command, source, template, or rule imports.

### 6.1 What the controls do

| Action | Current result |
|---|---|
| Export Device Cert | Shares a public certificate so a sender can make a package for this device; does not export its private key |
| Verify Only | Checks structure and the signature against the included certificate; does not establish signer trust or recipient matching |
| Import after selecting or pasting in the general dialog | This entry point cannot currently complete import |
| Import from the package list | Checks an existing device file without copying, decrypting, or applying configuration |
| Apply | Decrypts and lists configuration categories without writing their settings; may still report success |
| Export Config Pack on a Developer device | Creates and saves a package to the SD card, then offers a download after success |

> Do not rely on general Apply for fleet configuration, disaster recovery, or confirmation that settings took effect. Even if it reports success, configure and check settings on the relevant feature page.

### 6.2 Check the source and recipient

General Verify Only uses the signer certificate included in the package without checking that it was issued by a trusted authority. The signature protects encrypted content; it does not make every displayed field trustworthy. An Official label, package name, or target name cannot replace a source check.

Use asset records or an independent trusted channel to confirm the signer certificate fingerprint, recipient device certificate, and purpose. A certificate and fingerprint received in the same message are not an independent check. Stop if the source, target, or purpose is unclear.

### 6.3 Share a device certificate and inspect a package

**Provide this device's certificate:** select Export Device Cert and copy the complete PEM and displayed fingerprint. Send the public certificate to the sender, then confirm the fingerprint through another trusted channel.

**Inspect a received package:** open Import Config Pack, select or paste the file, then select Verify Only. Review signature information and confirm the source. This does not apply settings or prove that this device is the recipient.

Even after verification passes, general Import and Apply cannot be relied on to configure the device. Use Import Host for an SSH host package and supported controls on the relevant pages for other settings.

### 6.4 Export a general Config Pack from a Developer device

1. Prepare valid JSON configuration files on the SD card and obtain a verified target device certificate.
2. Select Export Config Pack and choose the files. Check that every required file has loaded. Resolve read errors rather than leaving required content out.
3. Enter a name and description, paste the recipient certificate, and generate the package.
4. Check the success message and device save path, then select Download. Confirm that the browser saved the `.tscfg` file.

This workflow saves under `/sdcard/output_config/`. If the device save fails, the current workflow reports an error and does not provide a download of the newly generated package. Do not mistake an earlier result for this attempt's success. Check the SD card and save result before deciding whether to generate again.

Export does not change source settings. Regenerate a package made for the wrong target or a replaced recipient certificate. Export success does not establish that general application on the recipient is available.

## 7. Troubleshooting and incident response

### 7.1 Common problems

| Symptom | What to do |
|---|---|
| Account Security is missing | It is shown only to root |
| Authentication or permission is denied | Check your account and the required device identity. Repeated clicks cannot bypass the requirements |
| Generation or deployment is unconfirmed | Check local records and the remote result before submitting again |
| A list cannot be read | Restore connectivity and refresh. A read failure does not mean the list is empty |
| The host fingerprint changes | Cancel and verify through a trusted channel; see Section 4.3 |
| A local host remains after revocation | Check remote revocation and local deletion separately; see Section 3.5 |
| Access still works after removing a host | Revoke the remote public key separately; local removal does not revoke access |
| A deletion check or package preview expires | Recheck and decide from the new result, not the old preview |
| A certificate is saved, but HTTPS is stopped | First confirm that firmware enables HTTPS, then check time, credentials, and startup messages |
| A client rejects the certificate | Check client trust, access names, permitted uses, and validity |
| General Apply succeeds, but settings do not change | This entry point does not write settings yet; use the relevant feature page |

### 7.2 Configuration changes or an uncertain result

**The editor says configuration has changed:** your input may still be in the window, but it has not been saved as a draft. Copy anything you need to a safe place, close and reopen the editor, read the current configuration, and then edit again. Do not put passwords or private keys in ordinary notes.

**A package preview expires:** select Check package again and review the changes. An old preview cannot be reused after credentials or configuration have changed.

**A deletion check expires:** select Review deletion impact and check current references. An operation in another window may have changed the result.

**A timeout, disconnection, or incomplete response occurs:** inspect the current configuration, key, certificate, or remote authorization first. A missing confirmation does not mean the operation never happened. Check before deciding whether to retry.

### 7.3 Suspected key or password exposure

1. Restrict access to the device and affected material. Keep records needed for investigation.
2. For an exposed SSH private key, revoke its public key on every affected server through trusted connections. Check backups and confirm that the old key no longer works.
3. Create and deploy a new RSA key under a new ID. Verify it, then delete the old key and exported copies.
4. For an exposed SSH password, change it through a trusted management connection and review sign-in records.
5. For an exposed device certificate key, replace credentials as described in Section 5.6. Work with the CA administrator on revocation and old packages.

The local host list may not cover every server that granted access. Also check server and asset records. Before sharing logs, review them for passwords, keys, or other sensitive information.

### 7.4 Current operating limits

Account for HTTP and access limitations in Chapter 1, initial deployment trust in Chapter 3, and general Config Pack limitations in Chapter 6. Hidden is not an access-control mechanism.

The reviewed build configuration does not enable NVS Encryption, Flash Encryption, or Secure Boot. It cannot establish that encryption and secure startup protect stored keys. The actual firmware and hardware security settings need separate verification. Ask the security owner to arrange isolation or a fix if these limitations are unacceptable.

## 8. Scope and glossary

### 8.1 Basis of this edition

This guide covers TianshanOS 0.6.4. Its instructions follow the upstream code and its Chinese and English interfaces reviewed on November 3, 2026. Use the reviewed implementation to judge features; a version number alone is insufficient.

Later updates do not necessarily affect this guide. If pages, steps, or results differ, check the actual interface and update notes. Document checks do not replace target-device verification of SSH access, remote authorization, HTTPS connections, restarts, or recovery.

### 8.2 Terms used in this guide

- **Public key / private key:** share the public key with the party granting access; keep the private key secret. Sign-in uses a matching pair.
- **Fingerprint:** a digest used to compare server or certificate identities. Convert different display formats before comparing.
- **CSR / CA:** a certificate signing request, and a certificate authority or its certificate.
- **CN / OU:** the name and organizational unit in a certificate. Department in the form corresponds to OU.
- **SAN:** the DNS names or IP addresses a certificate covers.
- **PEM:** certificate, request, or key text with BEGIN/END markers.
- **mTLS:** authentication in which both parties present certificates.
- **NVS:** an internal storage area for device settings and keys. Its name does not imply encryption.
