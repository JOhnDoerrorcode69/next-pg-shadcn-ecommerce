
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Set viewport to ensure we capture enough content
        await page.set_viewport_size({"width": 1280, "height": 1000})

        try:
            print("Navigating to All Products page...")
            response = await page.goto("http://localhost:3000/all")
            if response.status != 200:
                print(f"Failed to load page: {response.status}")
                return

            print("Waiting for content to load...")
            await page.wait_for_selector("text=All Products", timeout=10000)

            # Take a screenshot of the top part (filters and grid)
            await page.screenshot(path="all_products_top.png")
            print("Screenshot saved to all_products_top.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
