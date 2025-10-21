import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const pexec = promisify(exec)

async function isInstalled(name) {
  try {
    // Prefer JSON for reliable parsing; fall back to plain text contains
    const { stdout } = await pexec('npx appium driver list --installed --json', { windowsHide: true })
    try {
      const data = JSON.parse(stdout)
      if (Array.isArray(data)) {
        const names = data
          .map(d => (d?.name || d?.driverName || '').toString().toLowerCase())
          .filter(Boolean)
        return names.includes(name.toLowerCase())
      }
      if (data && typeof data === 'object') {
        const names = Object.keys(data).map(k => k.toLowerCase())
        return names.includes(name.toLowerCase())
      }
    } catch {
      // Non-JSON; use substring check
      return stdout.toLowerCase().includes(name.toLowerCase())
    }
  } catch {
    // If listing fails, assume not installed to attempt install
    return false
  }
  return false
}

async function ensure(name) {
  const present = await isInstalled(name)
  if (present) {
    console.log(`Appium driver '${name}' already installed; skipping`)
    return
  }
  console.log(`Installing Appium driver '${name}'...`)
  try {
    await pexec(`npx appium driver install ${name}`, { windowsHide: true })
    console.log(`Installed Appium driver '${name}'.`)
  } catch (e) {
    const msg = (e?.stdout || e?.stderr || e?.message || '').toString().toLowerCase()
    if (msg.includes('already installed')) {
      console.log(`Appium driver '${name}' already installed (reported by CLI); continuing`)
      return
    }
    console.error(e?.stdout || e?.stderr || e?.message || e)
    throw e
  }
}

try {
  await ensure('uiautomator2')
} catch (e) {
  // ensure non-zero exit only for unexpected failures
  process.exitCode = 1
}
