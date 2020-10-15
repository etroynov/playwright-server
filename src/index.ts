import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { chromium, ChromiumBrowser } from "playwright";

const app = new Koa();
const router = new Router();

let browser: ChromiumBrowser;

app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

router.get("/demo", async (ctx, next) => {
  if (browser?.isConnected()) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("http://whatsmyuseragent.org/");
    const screenshot = await page.screenshot();

    ctx.type = "image/png";
    ctx.body = screenshot;
    return null;
  }

  ctx.body = "browser is not start";

  return null;
});

router.get("/healf", (ctx) => {
  ctx.body = "ok";
  return ctx;
});

router.post("/", async (ctx) => {
  if (browser?.isConnected()) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setContent(ctx.request.body?.data);
    const screenshot = await page.screenshot();

    ctx.type = "image/png";
    ctx.body = screenshot;
    return ctx;
  }

  return (ctx.body = "browser is not start");
});

async function main() {
  browser = await chromium.launch();

  app.listen(3000);
}

main();
