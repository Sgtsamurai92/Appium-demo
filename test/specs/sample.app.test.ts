import { expect } from '@wdio/globals'

// WDIO runner manages the session. Ensure capabilities in wdio.conf.ts point to your APK and AVD.
describe('Android ApiDemos app', () => {
    it('should open the app and navigate to Views > Controls', async () => {
        // Wait for the app to fully load (especially on slow CI emulators)
        await driver.pause(5000)
        
        // Debug: Get current activity
        const activity = await driver.getCurrentActivity()
        console.log('Current activity:', activity)
        
        // Find Views using UiSelector (more reliable than accessibility ID)
        const views = await $('android=new UiSelector().text("Views")')
        await views.waitForDisplayed({ timeout: 20000 })
        console.log('Views element found!')
        await views.click()

        // Wait after navigation
        await driver.pause(2000)

        // Find and click Controls
        const controls = await $('android=new UiSelector().text("Controls")')
        await controls.waitForDisplayed({ timeout: 10000 })
        console.log('Controls element found!')
        await controls.click()

        // Wait for Controls screen to load
        await driver.pause(2000)

        // Verify we're on the Controls screen by finding a known element
        const darkTheme = await $('android=new UiSelector().textContains("Dark Theme")')
        await darkTheme.waitForDisplayed({ timeout: 10000 })
        await expect(darkTheme).toBeExisting()
        console.log('Test passed! Dark Theme element found on Controls screen.')
    })
})
