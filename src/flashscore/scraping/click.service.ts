import { Injectable } from '@nestjs/common';

@Injectable()
export class ClickService {
  async clickElementIfExists(page, selector: string): Promise<void> {
    try {
      await page.waitForSelector(selector);
      const element = await page.$(selector);
      if (element) {
        console.log(`Clicking on element with selector: "${selector}"`);
        await page.click(selector);
      } else {
        console.log(`Element with selector "${selector}" not found, skipping...`);
      }
    } catch (error) {
      console.log(`Error or timeout while waiting for element "${selector}":`, error.message);
    }
  }

  async customClick(page, selector: string): Promise<void> {
    while (true) {
      try {
        const clicked = await page.evaluate(async (sel) => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const element = document.querySelector(sel) as HTMLAnchorElement;
          if (element && element.offsetParent !== null) {
            console.log(`Clicking on "${sel}"...`);
            element.scrollIntoView();
            element.click();
            return true;
          }
          return false;
        }, selector);

        if (!clicked) break;
      } catch (error) {
        console.error('Error during scrolling and clicking:', error);
        break;
      }
    }
  }
}
