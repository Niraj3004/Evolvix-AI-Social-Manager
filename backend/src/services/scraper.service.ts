import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Add stealth plugin to bypass bot detection
puppeteer.use(StealthPlugin());

export class ScraperService {
  async getPinterestImages(query: string, count: number = 3): Promise<string[]> {
    console.log(`[ScraperService] Launching stealth browser for query: "${query}"...`);
    
    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true, // Use new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });

    try {
      const page = await browser.newPage();
      
      // Set a real user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
      console.log(`[ScraperService] Navigating to ${searchUrl}`);
      
      // Navigate and wait for network idle to ensure images load
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Scroll down a bit to trigger lazy loading
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await new Promise(r => setTimeout(r, 2000));
      
      // Extract image URLs
      const imageUrls = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images
          .map(img => img.src)
          .filter(src => src.includes('i.pinimg.com') && !src.includes('75x75_RS')); // filter out small avatars
      });

      // Filter and upgrade resolution
      const highResUrls = [...new Set(imageUrls)]
        .map(url => url.replace(/236x|474x/, '736x')) // Try to upgrade to 736x
        .slice(0, count);

      console.log(`[ScraperService] Successfully scraped ${highResUrls.length} images.`);
      return highResUrls;

    } catch (error) {
      console.error(`[ScraperService] Scraping failed:`, error);
      return [];
    } finally {
      await browser.close();
    }
  }
}

export const scraperService = new ScraperService();
