exports.handler = async (event, context) => {
  // const location = event.queryStringParameters.location || "home";
  const cookie_value = event.headers.cookie || "no cookie";
  const host_value = event.headers.host || "localhost";

  // remove port number
  const current_domain = ( host_value.match(/:/g) ) ? host_value.slice( 0, host_value.indexOf(":") ) : event.headers.host
  
  // create uuid
  const ip_encode = new Buffer.from(event.headers['client-ip']);
  const ip_value = ip_encode.toString('base64');
  const secondsSinceEpoch = Math.round(Date.now() / 1000)
  const uuid = ip_value + '-' + secondsSinceEpoch;

  // cookie function
  const get_cookies = function(event) {
    var cookies = {};
    console.log('cookie function')
    event.headers && event.headers.cookie.split(';').forEach(function(cookie) {
      var parts = cookie.match(/(.*?)=(.*)$/)
      cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies;
  };
  
  // Write cookies
      
      // set Max-Age
      const maxAge = 24*60*60*365;

      // set Secure Flag
      const secure = `Secure`;

  if(event.headers.cookie) {
    
    // check cookie values
    const cookie_uuid = get_cookies(event)['_uuid'];
    const cookie_ga = get_cookies(event)['_ga'];

    if(!cookie_ga && !cookie_uuid) {
      return {
        statusCode: 200,
        multiValueHeaders : {"Set-Cookie": [`_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`, `_ga=${cookie_ga}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]},
        headers: {
          "Location": "https://byrgeleeuwangh.com",
          "Access-Control-Expose-Headers": "Set-Cookie",
          "Cache-Control": "no-cache",
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
        body: `cookie _ga : ${JSON.stringify(cookie_ga)}`,
      };
    }
    if(cookie_ga && !cookie_uuid) {
      return {
        statusCode: 200,
        multiValueHeaders : {"Set-Cookie": [`_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]},
        headers: {
          "Location": "https://byrgeleeuwangh.com",
          "Access-Control-Expose-Headers": "Set-Cookie",
          "Cache-Control": "no-cache",
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
        body: `cookie _ga : ${JSON.stringify(cookie_ga)}`,
      };
    }
    if(!cookie_ga && cookie_uuid) {
      return {
        statusCode: 200,
        body: `no cookies set`,
      };
    }
    if(cookie_ga && cookie_uuid) {
      return {
        statusCode: 200,
        multiValueHeaders : {"Set-Cookie": [`_ga=${cookie_ga}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`, `_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]},
        headers: {
          "Location": "https://byrgeleeuwangh.com",
          "Access-Control-Expose-Headers": "Set-Cookie",
          "Cache-Control": "no-cache",
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
        body: `cookie _ga : ${JSON.stringify(cookie_ga)}`,
      };
    } 
  } else {
      return {
        statusCode: 200,
        multiValueHeaders : {"Set-Cookie": [`_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]},
        headers: {
          "Location": "https://byrgeleeuwangh.com",
          "Access-Control-Expose-Headers": "Set-Cookie",
          "Cache-Control": "no-cache",
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
        body: `uuid : ${JSON.stringify(uuid)}`,
      };
  }
};