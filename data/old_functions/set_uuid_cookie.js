exports.handler = async (event, context) => {
  const host_value = event.headers.host || "localhost";
   // remove port number
  const current_domain = ( host_value.match(/:/g) ) ? host_value.slice( 0, host_value.indexOf(":") ) : event.headers.host

  const ip_encode = new Buffer.from(event.headers['client-ip']);
  const ip_value = ip_encode.toString('base64');

  const secondsSinceEpoch = Math.round(Date.now() / 1000)
  const uuid = ip_value + '-' + secondsSinceEpoch;
 
  const get_cookies = function(event) {
    var cookies = {};
    event.headers && event.headers.cookie.split(';').forEach(function(cookie) {
      var parts = cookie.match(/(.*?)=(.*)$/)
      cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies;
  };
  const cookie_uuid = get_cookies(event)['_uuid'];

  if(event.headers && event.headers['client-ip'] && !cookie_uuid) {
    if(ip_value) {
      return {
        statusCode: 200,
        headers: {
          "Location": "https://byrgeleeuwangh.com",
          "Access-Control-Expose-Headers": "Set-Cookie",
          "Set-Cookie": `_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=36000; Secure; SameSite=strict`,
          "Cache-Control": "no-cache",
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
        body: `cookie _uuid : ${JSON.stringify(uuid)} `,
      };
    }
  } else { 
    return {
      statusCode: 200,
    }
  }
};