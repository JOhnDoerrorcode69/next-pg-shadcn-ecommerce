from playwright.sync_api import sync_playwright

def verify_home_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the home page
            page.goto("http://localhost:3000")

            # Wait for key elements to load
            page.wait_for_selector('text=Bharat Krishi Mitra')
            page.wait_for_selector('text=Featured Products')

            # Take a screenshot of the top section (Hero + Navbar)
            page.screenshot(path="verification/home_hero.png")
            print("Screenshot saved to verification/home_hero.png")

            # Scroll down to see Pillars and Products
            page.evaluate("window.scrollBy(0, 800)")
            page.wait_for_timeout(1000) # Wait for potential animations
            page.screenshot(path="verification/home_pillars.png")
            print("Screenshot saved to verification/home_pillars.png")

            # Scroll further to see Products
            page.evaluate("window.scrollBy(0, 800)")
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/home_products.png")
            print("Screenshot saved to verification/home_products.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_home_page()
