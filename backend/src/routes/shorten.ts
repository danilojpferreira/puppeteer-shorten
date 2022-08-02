import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { mongoClient } from "../database";
import { IDocument, IMongoDocument } from "../types";
import { collection, database, port } from "../utils/config";
import { getPuppeteerPageTitle, shortener } from "../utils/utils";
import { scrape } from "../utils/webscrapper";

const shortenRoutes = Router();

shortenRoutes.get("/top", async (request: Request, response: Response) => {
  try {
    const client = mongoClient;

    const getTopAccess = async (limit: number): Promise<IDocument[]> => {
      const resp = client
        .db(database)
        .collection(collection)
        .aggregate([
          {
            $sort: {
              access: -1,
            },
          },
          {
            $limit: limit,
          },
        ]);

      const arrResp = await resp.toArray();
      return arrResp as any[] as IDocument[];
    };
    const resp = await getTopAccess(100);

    if (!resp) {
      throw new Error("Error to find top access");
    }

    return response.status(200).send(resp);
  } catch (error) {
    return response.status(error.statusCode).send({ message: error });
  }
});

shortenRoutes.get("/:generic", async (request: Request, response: Response) => {
  try {
    const generic = request.url.slice(1);
    if (!generic) throw new Error("Url not present");

    const client = mongoClient;

    const path = generic;
    const resp: IMongoDocument = (await client
      .db(database)
      .collection(collection)
      .findOne({ shorten: path })) as any as IMongoDocument;

    if (!resp) {
      return response.status(404).send({ message: "url not found" });
    }

    await client
      .db(database)
      .collection(collection)
      .findOneAndUpdate(
        { _id: new ObjectId(resp._id) },
        { $set: { access: resp.access + 1 } }
      );

    const redirection = resp.original.includes("http")
      ? resp.original
      : `http://${resp.original}`;

    return response.status(200).redirect(redirection);
  } catch (error) {
    return response.status(error.statusCode).send({ message: error });
  }
});

shortenRoutes.post("/", async (request: Request, response: Response) => {
  try {
    const { url: original } = request.body;
    const existsOriginal = await mongoClient
      .db(database)
      .collection(collection)
      .findOne({ original });
    if (existsOriginal) {
      return response.status(200).send({ message: "link already exist" });
    }
    const shorten: string = await shortener();
    const title: string = await scrape(original, getPuppeteerPageTitle);
    const document: IDocument = {
      original,
      shorten,
      title,
      access: 0,
    };

    const client = mongoClient;

    const insertion = await client
      .db(database)
      .collection(collection)
      .insertOne(document);

    if (!insertion?.insertedId) {
      throw new Error("Error on insert");
    }

    return response
      .status(200)
      .send(
        `Your shorthen url is: ${request.protocol}://${request.host}${
          port === 80 || port === 443 ? "" : `:${port}`
        }/${shorten}`
      );
  } catch (error) {
    return response.status(error.statusCode).send({ message: error });
  }
});

export { shortenRoutes };
