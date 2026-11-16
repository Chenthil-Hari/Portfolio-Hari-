const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const viewports = [
  { width: 320, height: 568, name: '320x568 (Mobile Small)' },
  { width: 375, height: 812, name: '375x812 (iPhone X/Mini)' },
  { width: 390, height: 844, name: '390x844 (iPhone 12/13/14)' },
  { width: 430, height: 932, name: '430x932 (iPhone Pro Max)' },
  { width: 768, height: 1024, name: '768x1024 (iPad Portrait)' },
  { width: 1024, height: 768, name: '1024x768 (iPad Landscape)' },
  { width: 1366, height: 768, name: '1366x768 (Laptop)' },
  { width: 1920, height: 1080, name: '1920x1080 (Desktop FHD)' }
];

async function main() {
  console.log('--- Starting Vite Preview Server ---');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'pipe'
  });

  server.stdout.on('data', data => console.log(`[server] ${data.toString().trim()}`));
  server.stderr.on('data', data => console.error(`[server err] ${data.toString().trim()}`));

  // Wait for server to start
  await new Promise(r => setTimeout(r, 3000));

  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage();

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const overflowData = await page.evaluate(viewportWidth => {
        const rootScrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const hasHorizontalScroll = rootScrollWidth > viewportWidth || bodyScrollWidth > viewportWidth;

        const overflowingElements = [];
        const allElements = document.querySelectorAll('*');

        for (const el of allElements) {
          // Ignore SVG inner elements
          if (el instanceof SVGElement && el.tagName !== 'svg') continue;

          const rect = el.getBoundingClientRect();
          // Check if element extends beyond the right edge of the viewport
          if (rect.right > viewportWidth + 1) {
            overflowingElements.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              classes: el.className ? (typeof el.className === 'string' ? el.className : el.className.baseVal || '') : '',
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              overflowAmount: Math.round(rect.right - viewportWidth),
              textSnippet: (el.innerText || el.textContent || '').slice(0, 50).replace(/\n/g, ' ')
            });
          }
        }

        return {
          viewportWidth,
          rootScrollWidth,
          bodyScrollWidth,
          hasHorizontalScroll,
          overflowingElements: overflowingElements.slice(0, 15) // top 15
        };
      }, vp.width);

      console.log(`\n========================================`);
      console.log(`Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`Horizontal Scroll: ${overflowData.hasHorizontalScroll ? 'YES (OVERFLOW DETECTED!)' : 'NO (PASSED)'}`);
      console.log(`Root scrollWidth: ${overflowData.rootScrollWidth}px (Viewport: ${vp.width}px)`);

      if (overflowData.overflowingElements.length > 0) {
        console.log(`Overflowing Elements (${overflowData.overflowingElements.length}):`);
        overflowData.overflowingElements.forEach((item, idx) => {
          console.log(`  [${idx + 1}] <${item.tag}> id="${item.id}" class="${item.classes.slice(0, 60)}"`);
          console.log(`      right: ${item.right}px, width: ${item.width}px (+${item.overflowAmount}px overflow)`);
          console.log(`      text: "${item.textSnippet}"`);
        });
      }
    }
  } catch (err) {
    console.error('Error during testing:', err);
  } finally {
    if (browser) await browser.close();
    server.kill();
    process.exit(0);
  }
}

main();
