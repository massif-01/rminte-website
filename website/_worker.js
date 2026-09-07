export default {
  fetch(request, env) {
    if (new URL(request.url).pathname !== '/visitor-language.js') {
      return env.ASSETS.fetch(request);
    }

    const language = ['CN', 'HK', 'MO', 'TW'].includes(request.cf?.country) ? 'zh' : 'en';
    return new Response(`window.RM_DEFAULT_LANG = ${JSON.stringify(language)};`, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        // This response belongs to the current visitor, never a shared cache.
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
};
