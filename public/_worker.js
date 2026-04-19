export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.hostname !== 'classroom6x.store' || url.protocol !== 'https:') {
      url.hostname = 'classroom6x.store';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    return fetch(request);
  },
};
