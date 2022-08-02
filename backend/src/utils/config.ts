export const mongoUri: string = process.env.MONGO_URI;
export const database: string = process.env.MONGO_DB ?? "blue_coding";
export const collection: string = process.env.MONGO_COLLECTION ?? database;
export const port: number = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 3000;
export const reservedRoutes = ["", "top"];
