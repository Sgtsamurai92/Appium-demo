import { createWriteStream } from 'node:fs'
import { mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import https from 'node:https'

const url = process.env.APK_URL || 'https://github.com/appium/android-apidemos/releases/latest/download/ApiDemos-debug.apk'
const dest = process.env.APK_DEST || join(process.cwd(), 'apps', 'ApiDemos-debug.apk')

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = dirname(dest)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    const file = createWriteStream(dest)
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // handle redirect
        res.destroy()
        return resolve(download(res.headers.location, dest))
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${res.statusCode}`))
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve(dest)))
    }).on('error', (err) => {
      reject(err)
    })
  })
}

try {
  const out = await download(url, dest)
  console.log(`APK downloaded to: ${out}`)
} catch (e) {
  console.error('Failed to download APK:', e.message)
  process.exitCode = 1
}
