<h1 align="center">
	Puppeter shorten chalenge
</h1>

<p align="center">
  A simple BE (Node.js with express) and DB (MongoDB) usign puppeteer to shorten url.
</p>


# Tasks:
[ x ] Post to shorten url
[ x ] Save title in mongodb collection
[ x ] GET to redirect from shorten to original
[ x ] Increase the number each access
[ x ] GET to get 100 more accessed url

# Endpoints:

## POST: /

create a new enpoint with required body:
```json
{
  "url": "string"
}
```
## GET: /<SHORTEN_URL>
Redirect you for a the website relative to this shortner

## GET: /top
Get the top 100 most accessed websites


# How to run:

You can just use `docker-compose up` on the root of the directory or start the backend with `npm i && npm run start` and run a `mongodb` aside.