exports.handler = async (event, context) => {
  // const location = event.queryStringParameters.location || "home";
  const cookie_value = event.headers.cookie || "no cookie";
  const host_value = event.headers.host || "localhost";
  const ip_valu = event.headers['client-ip'] || "no ip";

  console.log(`\nHere is the ip info: ${JSON.stringify(event.headers['client-ip'])}`);

  var ip_encode = new Buffer(event.headers['client-ip']);
  var ip_value = ip_encode.toString('base64');

  console.log(`\nHere is the 2nd ip info: ${ip_value}`);


  // const ip_value = event.headers['client-ip'] || "no ip";
  const current_domain = ( host_value.match(/:/g) ) ? host_value.slice( 0, host_value.indexOf(":") ) : event.headers.host

  var get_cookies = function(event) {
    var cookies = {};
    event.headers && event.headers.cookie.split(';').forEach(function(cookie) {
      var parts = cookie.match(/(.*?)=(.*)$/)
      cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies;
  };
  
  if(event.headers) {
    var cookie_ga = get_cookies(event)['_ga'];
    // if(cookie_ga) {
    //   return {
    //     statusCode: 200,
    //     headers: {
    //       "Location": "https://byrgeleeuwangh.com",
    //       "Access-Control-Expose-Headers": "Set-Cookie",
    //       "Set-Cookie": `_ga=${cookie_ga}; Path=/; Domain=${current_domain}; Max-Age=36000; HttpOnly; SameSite=strict`,
    //       "Cache-Control": "no-cache",
    //       "Content-Type": "text/html",
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //     body: `cookie _ga : ${JSON.stringify(cookie_ga)} `,
    //   };
    // }
    if(ip_value) {
      return {
        statusCode: 200,
        headers: {
          "Location": "https://byrgeleeuwangh.com",
          "Access-Control-Expose-Headers": "Set-Cookie",
          "Set-Cookie": `_ip=${ip_value}; Path=/; Domain=${current_domain}; Max-Age=36000; HttpOnly; SameSite=strict`,
          "Cache-Control": "no-cache",
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
        body: `cookie _ip : ${JSON.stringify(ip_value)} `,
      };
    }
  }
};