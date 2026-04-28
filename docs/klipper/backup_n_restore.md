# Backup and Restore (manual)

Capture every piece of state that can't be trivially reinstalled:

- your printer configurations
- calibration data
- machine identity
- Klipper commit SHA so it can be restored later and match the MCU firmware

---

## Backup

### 1. System packages

```bash
dpkg --get-selections > ~/packages.txt
```

Useful as a reference if troubleshooting a restore — not required to reinstall.

---

### 2. Python (pip) modules

```bash
# KIAUH default (virtualenv):
pip freeze > ~/pip-modules.txt
```

Similar to above, exact versions of pip modules. This focuses on the user level (not virtual env) modules that may have been added manually.

---

### 3. SSH keys

```bash
cp -r ~/.ssh ~/backup/ssh
```

Useful if the Pi authenticates with GitHub (for backups) or other remote services.

---

### 4. Git identity

```bash
cp ~/.gitconfig ~/backup/gitconfig
```

Git identity for git config backups.

---

### 5. Shell history

```bash
cp ~/.bash_history ~/backup/bash_history
```

A history of bash commands.

---

### 6. Home directory listing

```bash
ls -la ~ > ~/backup/home-listing.txt
```

File/dir listing snapshot of your home directory — useful as a checklist when verifying a restore.

---

### 7. printer_data

```bash
cp -r ~/printer_data ~/backup/printer_data
```

The most critical directory:

| Path | Contents |
|---|---|
| `printer_data/config/` | All `.cfg` files — `printer.cfg`, macros, includes |
| `printer_data/database/` | Moonraker's SQLite database — Fluidd/Mainsail settings, history |
| `printer_data/gcodes/` | Uploaded gcode files |
| `printer_data/logs/` | Log files |
| `printer_data/.moonraker.uuid` | Moonraker's unique machine identifier |

---

### 8. Klipper HEAD SHA

```bash
cd ~/klipper && git rev-parse HEAD > ~/backup/klipper-sha.txt
```

The Klipper host and MCU firmware _should_ match. This SHA lets you restore the matching point in history, eliminating the need of reflashing after install.

---

## Restore

### 1. Install the base stack

Follow [Installing Klipper](installing_klipper.md) to get a fresh OS with Klipper, Moonraker, Fluidd/Mainsail, and any extras installed.

---

### 2. Stop all services

```bash
sudo systemctl stop klipper moonraker crowsnest KlipperScreen mobileraker
```

Stop everything before overwriting config and database files — writing to the Moonraker database while running risks corruption.

!!! note
    Adjust to your actual running services.

---

### 3. Pin Klipper to the backed-up SHA

```bash
cd ~/klipper
git checkout <sha-from-backup>
```

Without this, a fresh KIAUH install will be on `HEAD` — likely newer than your MCU firmware — and the version mismatch will cause a connection error at startup.

!!! tip
    To update Klipper as part of the restore, recompile and reflash the MCU firmware at the same time. See [Flashing the MCU](flashing_mcu.md).

---

### 4. Restore printer_data

```bash
rm -rf ~/printer_data/config ~/printer_data/database ~/printer_data/gcodes
cp -r ~/backup/printer_data/config ~/printer_data/config
cp -r ~/backup/printer_data/database ~/printer_data/database
cp -r ~/backup/printer_data/gcodes ~/printer_data/gcodes
```

Wipe first, then restore — merging on top of fresh-install defaults leaves stale placeholder configs mixed in.

---

### 5. Restore the Moonraker UUID

```bash
cp ~/backup/printer_data/.moonraker.uuid ~/printer_data/.moonraker.uuid
```

Do this explicitly even if you copied all of `printer_data` — verify with `cat ~/printer_data/.moonraker.uuid`.

---

### 6. Restore shell history

```bash
cat ~/backup/bash_history >> ~/.bash_history
```

---

### 7. Reboot

```bash
sudo reboot
```

Rebooting re-applies `udev` rules and resets any lingering state — cleaner than manually restarting services.
