export default {
  async fetch(request) {
    const url = new URL(request.url);

    // force only non-www
    if (url.hostname !== "classroom6x.store") {
      return Response.redirect(
        "https://classroom6x.store" + url.pathname + url.search,
        301
      );
    }

    return fetch(request);
  }
}
