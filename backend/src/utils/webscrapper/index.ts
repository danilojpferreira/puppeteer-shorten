import puppeteer from "puppeteer";

const browser = async () => {
  let browser: any;
  try {
    console.log("Opening the browser......");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
  return browser;
};

const scraper = async (bInstance: any, url: string): Promise<any> => {
  console.log(bInstance);
  const page = await bInstance.newPage();
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  // Wait for the required DOM to be rendered
  await page.waitForSelector(".page_inner");
  // Get the link to all the required books
  const urls = await page.$$eval("section ol > li", (links) => {
    // Make sure the book to be scraped is in stock
    const nLinks = links.filter(
      (link) =>
        link.querySelector(".instock.availability > i").textContent !==
        "In stock"
    );
    // Extract the links from the data
    const nNlinks = nLinks.map((el) => el.querySelector("h3 > a").href);
    return nNlinks;
  });
  console.log(urls);
  return urls;
};

export const scrape = async (url: string, funct: any): Promise<string> => {
  try {
    const browserInstance = await browser();
    const data = await funct(browserInstance, url);
    await browserInstance.close();
    return data ?? "";
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
    return "";
  }
};

export const example = async () => {
  const addr = "http://books.toscrape.com";
  return scrape(addr, scraper);
};
