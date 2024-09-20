import { Injectable } from '@nestjs/common';

@Injectable()
export class ClickService {
  async clickElementIfExists(page, selector: string): Promise<void> {
    try {
      await page.waitForSelector(selector);
      const element = await page.$(selector);
      if (element) {
        await page.click(selector);
      } else {
        console.log(`O seletor nao existe: "${selector}", pulando...`);
      }
    } catch (error) {
      console.log(`Erro timeout ao esperar o seletor: "${selector}":`, error.message);
    }
  }

  async customClick(page, selector: string): Promise<void> {
    while (true) {
      try {
        const clicked = await page.evaluate(async (sel) => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const element = document.querySelector(sel) as HTMLAnchorElement;
          if (element && element.offsetParent !== null) {
            element.scrollIntoView();
            element.click();
            return true;
          }
          return false;
        }, selector);

        if (!clicked) break;
      } catch (error) {
        console.error('Erro durante o click:', error);
        break;
      }
    }
  }
}
