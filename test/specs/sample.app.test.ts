import { expect } from '@wdio/globals'

// WDIO runner manages the session. Ensure capabilities in wdio.conf.ts point to your APK and AVD.
describe('Android ApiDemos app', () => {
    it('should open the app and navigate to Views > Controls', async () => {
        // Wait for the app to fully load (especially on slow CI emulators)
        await driver.pause(5000)
        
        // Debug: Get current activity and package
        const activity = await driver.getCurrentActivity()
        const appPackage = await driver.getCurrentPackage()
        console.log('Current package:', appPackage)
        console.log('Current activity:', activity)
        
        // Debug: Get page source to see what's actually on screen
        const pageSource = await driver.getPageSource()
        console.log('Page source length:', pageSource.length)
        console.log('Page source contains "Views":', pageSource.includes('Views'))
        console.log('Page source contains "API Demos":', pageSource.includes('API Demos'))
        
        // Find Views - try scrolling if needed
        let views
        try {
            views = await $('android=new UiSelector().text("Views")')
            if (!(await views.isDisplayed())) {
                // Try scrolling to find it
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Views")')
                views = await $('android=new UiSelector().text("Views")')
            }
        } catch (e) {
            console.log('Error finding Views:', (e as Error).message)
            throw e
        }
        
        await views.waitForDisplayed({ timeout: 10000 })
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
