import { MongoClient } from "mongodb";
import { collection, database, mongoUri } from "../utils/config";

export const mongoClient = new MongoClient(mongoUri);

try {
  if (!mongoClient.db(database)) {
    mongoClient
      .db(database)
      .createCollection(collection)
      .then((coll) => {
        try {
          coll.createIndexes([
            {
              key: { shorten: 1 },
              unique: true,
            },
            {
              key: { original: 1 },
              unique: true,
            },
          ]);
        } catch (error) {
          throw new Error(error);
        }
      });
  }
} catch (error) {
  console.log(error);
}
