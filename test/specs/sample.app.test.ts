import { expect } from '@wdio/globals'

// WDIO runner manages the session. Ensure capabilities in wdio.conf.ts point to your APK and AVD.
describe('Android ApiDemos app', () => {
    it('should open the app and navigate to Views > Controls', async () => {
        // Tap on "Views"
        const views = await $('~Views')
        await views.waitForDisplayed({ timeout: 20000 })
        await views.click()

        // Tap on "Controls"
        const controls = await $('~Controls')
        await controls.waitForDisplayed({ timeout: 10000 })
        await controls.click()

        // Simple assertion that a known element exists on Controls screen
        const darkTheme = await $('~2. Dark Theme')
        await expect(darkTheme).toBeExisting()
    })
})
