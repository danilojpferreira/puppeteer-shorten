/* eslint-disable no-plusplus */
import { mongoClient } from "../database";
import { collection, database, reservedRoutes } from "./config";

export const sleep = (ms: number) =>
  // eslint-disable-next-line no-promise-executor-return
  new Promise((resolve) => setTimeout(resolve, ms));

const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

const generateString = (length: number) => {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const shortener = async () => {
  const client = mongoClient;
  let findIt = false;
  let returningString = "";
  let stringSize = 1;
  while (!findIt) {
    const tryString = generateString(stringSize);
    // eslint-disable-next-line no-await-in-loop
    const exists = await client
      .db(database)
      .collection(collection)
      .findOne({ shorten: tryString });
    if (!exists && !reservedRoutes.find((i: string) => i === tryString)) {
      returningString = tryString;
      findIt = true;
    }
    stringSize++;
  }
  return returningString;
};

export const getPuppeteerPageTitle = async (
  browser: any,
  url: string
): Promise<any> => {
  const page = await browser.newPage();
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  const title = await page.mainFrame().title();
  console.log(`Page title is ${title}`);
  return title;
};
