## Encrypt/Decrypt `.env` file

```bash
# Generate ssh keys
ssh-keygen -t ed25519 -C "your_email@example.com"
```
<br>

```bash
# Encrypt .env file
scripts/crypto/age.win.exe -R ~/.ssh/id_ed25519.pub .env > .env.age
```
<br>

```bash
# Decrypt .env file
scripts/crypto/age.win.exe -d -i ~/.ssh/id_ed25519 .env.age > .env
```
