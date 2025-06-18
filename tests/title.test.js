import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

let browser;
let page;

describe('example.com website loads properly', () => {
  before(async () => {
    if (!browser) {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    if (!page) {
      page = await browser.newPage();
    }
  });

  after(async () => {
    if (page) {
      await page.close();
      page = null;
    }
    if (browser) {
      await browser.close();
      browser = null;
    }
  });

  it('should load the page', async (t) => {
    await page.goto('https://example.com');
    const content = await page.content();
    assert.ok(content.includes('Example Domain'));
  });

  it('should have proper title', async (t) => {
    const title = await page.title();
    assert.strictEqual(title, 'Example Domain');
  });

  it('should have a description', async (t) => {
    const description = await page.evaluate(() => {
      const el = document.querySelector('p');
      return el ? el.innerText : '';
    });
    assert.ok(description.includes('This domain is for use in illustrative examples'));
  });

  it('should have a link', async (t) => {
    const link = await page.$eval('a', el => el.href);
    assert.strictEqual(link, 'https://www.iana.org/domains/example');
  });
});