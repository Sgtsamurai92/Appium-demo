import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const pexec = promisify(exec)

async function isInstalled(name) {
  try {
    const { stdout } = await pexec('npx appium driver list --installed', { windowsHide: true })
    return new RegExp(`(^|\n)${name}(\n|\r|$)`, 'i').test(stdout) || stdout.toLowerCase().includes(name.toLowerCase())
  } catch (e) {
    // If listing fails, assume not installed to attempt install
    return false
  }
}

async function ensure(name) {
  const present = await isInstalled(name)
  if (present) {
    console.log(`Appium driver '${name}' already installed; skipping`)
    return
  }
  console.log(`Installing Appium driver '${name}'...`)
  await pexec(`npx appium driver install ${name}`, { windowsHide: true })
  console.log(`Installed Appium driver '${name}'.`)
}

try {
  await ensure('uiautomator2')
} catch (e) {
  console.error(e?.stdout || e?.message || e)
  process.exitCode = 1
}
