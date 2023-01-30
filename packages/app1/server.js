import express from "express";
import { getPageData } from "./page-data-machine.js";

const PORT = 8080;

const app = express();

app.get("*", async (_req, res) => {
  const pageData = await getPageData();

  res.type("html").send(`
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <title>App 1</title>
      </head>
      
      <body>
        <h1>${pageData.title}</h1>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});
