exports.handler = async (event, context) => {
  // const location = event.queryStringParameters.location || "home";
  const cookie_value = event.headers.cookie || "no cookie";
  const host_value = event.headers.host || "localhost";
  // remove port number
  const current_domain = ( host_value.match(/:/g) ) ? host_value.slice( 0, host_value.indexOf(":") ) : event.headers.host

  console.log('current_domain ', current_domain)

  const get_cookies = function(event) {
    var cookies = {};
    event.headers && event.headers.cookie.split(';').forEach(function(cookie) {
      var parts = cookie.match(/(.*?)=(.*)$/)
      cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies;
  };
  
  if(event.headers.cookie) {
  const cookie_ga = get_cookies(event)['_ga'];
    if(cookie_ga) {
      return {
        statusCode: 200,
        headers: {
          "Location": "https://byrgeleeuwangh.com",
          "Access-Control-Expose-Headers": "Set-Cookie",
          "Set-Cookie": `_ga=${cookie_ga}; Path=/; Domain=${current_domain}; Max-Age=36000; Secure; SameSite=strict`,
          "Cache-Control": "no-cache",
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
        body: `cookie _ga : ${JSON.stringify(cookie_ga)}`,
      };
    }
  }
};