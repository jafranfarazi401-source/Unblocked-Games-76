export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Redirect if it's not the main domain (handling www and other mirrors)
    // OR if it's not HTTPS (ensuring secure connection)
    const isWww = url.hostname.startsWith('www.');
    const isWrongDomain = url.hostname !== "classroom6x.store";
    const isInsecure = url.protocol === "http:";

    if (isWww || isWrongDomain || isInsecure) {
      const destination = `https://classroom6x.store${url.pathname}${url.search}`;
      
      // Use 301 for SEO permanence
      return Response.redirect(destination, 301);
    }

    return fetch(request);
  }
}
