/* eslint-disable @typescript-eslint/no-unused-vars -- playwright-cli --filename invokes this entry function. */
// Run in an isolated QA browser, before navigation. Counts contain no request data.
async function installMockBrowserGuard(page) {
  const state = { externalBlocked: 0, externalObserved: 0 };
  page.__mateQaMock = state;
  const external = (address) => {
    const url = new URL(address);
    return /^https?:$/.test(url.protocol) && url.origin !== "http://localhost:3820";
  };
  await page.context().unroute("**/*");
  await page.context().route("**/*", async route => {
    if (external(route.request().url())) {
      state.externalBlocked += 1;
      await route.abort();
    } else await route.continue();
  });
  page.context().on("request", request => { if (external(request.url())) state.externalObserved += 1; });
}
