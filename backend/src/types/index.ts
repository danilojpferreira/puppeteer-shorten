export interface IDocument {
  shorten: string;
  original: string;
  access: number;
  title: string;
}

export interface IMongoDocument extends IDocument {
  _id: string;
}
