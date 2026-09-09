export default {
  fetch(request, env) {
    if (new URL(request.url).pathname !== '/visitor-language.js') {
      return env.ASSETS.fetch(request);
    }

    const countries = {
      zh: ['CN', 'HK', 'MO', 'TW'], ja: ['JP'], ko: ['KR'],
      es: ['ES','MX','GT','HN','SV','NI','CR','PA','CU','DO','PR','CO','VE','EC','PE','BO','CL','AR','PY','UY','GQ'],
      fr: ['FR','MC','BE','CH','LU','HT','GF','GP','MQ','MF','BL','PM','DZ','MA','TN','BJ','BF','BI','CM','CF','TD','KM','CG','CD','CI','DJ','GA','GN','MG','ML','MU','NE','RW','SN','SC','TG','RE','YT','LB','NC','PF','WF','VU']
    };
    const language = Object.keys(countries).find(lang => countries[lang].includes(request.cf?.country)) || 'en';
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
