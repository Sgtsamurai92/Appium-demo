import { expect } from '@wdio/globals'

// WDIO runner manages the session. Ensure capabilities in wdio.conf.ts point to your APK and AVD.
describe('Android ApiDemos app', () => {
    it('should open the app and navigate to Views > Controls', async () => {
        // Wait for the app to fully load (especially on slow CI emulators)
        await driver.pause(5000)
        
        // Debug: Get current activity and package
        const activity = await driver.getCurrentActivity()
        const appPackage = await driver.getCurrentPackage()
        console.log('=== DEBUG INFO ===')
        console.log('Current package:', appPackage)
        console.log('Current activity:', activity)
        
        // Debug: Get page source to see what's actually on screen
        const pageSource = await driver.getPageSource()
        console.log('Page source length:', pageSource.length, 'characters')
        console.log('Page source contains "Views":', pageSource.includes('Views'))
        console.log('Page source contains "API Demos":', pageSource.includes('API Demos'))
        console.log('Page source contains "ApiDemos":', pageSource.includes('ApiDemos'))
        
        // If Views isn't in page source at all, the app likely crashed or is on wrong screen
        if (!pageSource.includes('Views')) {
            console.error('CRITICAL: "Views" text not found in page source!')
            console.log('First 500 chars of page source:', pageSource.substring(0, 500))
        }
        
        // Find Views - try multiple strategies
        let views
        try {
            // Strategy 1: Direct text search
            views = await $('android=new UiSelector().text("Views")')
            const isDisplayed = await views.isDisplayed()
            console.log('Views element found by text, displayed:', isDisplayed)
            
            if (!isDisplayed) {
                // Strategy 2: Try scrolling
                console.log('Attempting to scroll to Views...')
                try {
                    await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Views")')
                    console.log('Scroll command executed')
                } catch (scrollError) {
                    console.log('Scroll failed:', (scrollError as Error).message)
                }
                views = await $('android=new UiSelector().text("Views")')
            }
        } catch (e) {
            console.error('Error finding Views element:', (e as Error).message)
            // Last resort: try to find ANY element to prove app is responsive
            const anyElement = await $('android.widget.TextView')
            const anyText = await anyElement.getText()
            console.log('Found a TextView with text:', anyText)
            throw new Error(`Could not find Views element. App may have crashed or is on wrong screen. Current activity: ${activity}`)
        }
        
        await views.waitForDisplayed({ timeout: 10000 })
        console.log('✓ Views element is displayed!')
        await views.click()
        console.log('✓ Clicked Views')

        // Wait after navigation
        await driver.pause(2000)

        // Find and click Controls
        const controls = await $('android=new UiSelector().text("Controls")')
        await controls.waitForDisplayed({ timeout: 10000 })
        console.log('✓ Controls element found!')
        await controls.click()
        console.log('✓ Clicked Controls')

        // Wait for Controls screen to load
        await driver.pause(2000)

        // Verify we're on the Controls screen by finding a known element
        const darkTheme = await $('android=new UiSelector().textContains("Dark Theme")')
        await darkTheme.waitForDisplayed({ timeout: 10000 })
        await expect(darkTheme).toBeExisting()
        console.log('✓ Test passed! Dark Theme element found on Controls screen.')
    })
})
