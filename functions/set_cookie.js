exports.handler = async (event, context) => {
  // const location = event.queryStringParameters.location || "home";
  const headers_cookies = event.headers.cookie || undefined;
  const host_value = event.headers.host || "localhost";

  // set custom domain -- remove port number
  const current_domain = ( host_value.match(/:/g) ) ? host_value.slice( 0, host_value.indexOf(":") ) : event.headers.host
  
  // create uuid
  var create_uuid = function () { 
    const ip_encode = new Buffer.from(event.headers['client-ip']);
    const ip_value = ip_encode.toString('base64');
    const seconds_since_epoch = Math.round(Date.now() / 1000)
    return ip_value + '-' + seconds_since_epoch;
  }
  const uuid = create_uuid();

  // create session id
  var session_id = function () {  
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-3xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  const sessionId = session_id();

  ///// cookie header variables
  // set Max-Age
  const maxAge = 24*60*60*365;

  // set Secure Flag
  let hostname = event.headers.host;
  let secure;
  let local_host = hostname.indexOf('localhost');
  if(local_host === 0) {
    secure = ``;
  } else {
    secure = `Secure`;
  }

  // set headers
  const headers = {
    "Location": "https://byrgeleeuwangh.com",
    "Access-Control-Expose-Headers": "Set-Cookie",
    "Cache-Control": "no-cache",
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };

  ///////////

  if(headers_cookies) {
    let cookies = headers_cookies.split(";").reduce(function(obj, str, index) {
      let strParts = str.split("=");
      if (strParts[0] && strParts[1]) { 
        obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); 
      }
      return obj;
    }, {});
    
    const uuid = cookies['_uuid'] || create_uuid();
    const ga = cookies['_ga'];
    const ga_TSKQWXB2BC = cookies['_ga_TSKQWXB2BC'];
    const sessionId = cookies['_sessionId'] || session_id();
    
    let cookie_list = Object.keys(cookies).map((key) => [{'name':(key), 'value':cookies[key]}]);

    let _ga = cookie_list.filter(f => f[0].name === '_ga');
    let _ga_TSKQWXB2BC = cookie_list.filter(f => f[0].name === '_ga_TSKQWXB2BC');
    let _ga_uuid = cookie_list.filter(f => f[0].name === '_uuid');
    let _ga_sessionId = cookie_list.filter(f => f[0].name === '_sessionId');
    
    //
    let count_uuid = _ga_uuid.length;
    if(count_uuid === 1) {count_uuid += 10;}

    let count_sessionId = _ga_sessionId.length;
    if(count_sessionId === 1) {count_sessionId += 20;}
    
    let count_ga = _ga.length;
    if(count_ga === 1) {count_ga += 30;}
    
    let supercount = count_uuid + count_sessionId + count_ga
    
    /* 
    ga + sessionId + uuid = 63
    ga + sessionId = 52
    ga + uuid = 42
    sessionId + uuid = 32
    ga = 31
    sessionId = 21
    uuid = 11
    */
    let set_multi_value_headers
    
    if(supercount > 60) {
      set_multi_value_headers = {"Set-Cookie": [`_ga=${ga}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`__ga_TSKQWXB2BC=${ga_TSKQWXB2BC}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]};
    } else if (supercount > 50) {
      set_multi_value_headers = {"Set-Cookie": [`_ga=${ga}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`_ga_TSKQWXB2BC=${ga_TSKQWXB2BC}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]};
    } else if (supercount > 40) {
      set_multi_value_headers = {"Set-Cookie": [`_ga=${ga}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`_ga_TSKQWXB2BC=${ga_TSKQWXB2BC}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`_sessionId=${sessionId}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict`]};
    } else if (supercount > 30) {
      set_multi_value_headers = {"Set-Cookie": [`_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`_sessionId=${sessionId}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict`]};
    } else if (supercount > 20) {
      set_multi_value_headers = {"Set-Cookie": [`_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]};
    } else if (supercount > 10) {
      set_multi_value_headers = {"Set-Cookie": [`_sessionId=${sessionId}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict`]};
    } else {
      set_multi_value_headers = {"Set-Cookie": [`_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`_sessionId=${sessionId}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict`]};
    }
    console.log('set_multi_value_headers',set_multi_value_headers)
    // write cookies
    return {
      statusCode: 200,
      body: '',
      multiValueHeaders : set_multi_value_headers,
      headers: headers,
    };
  }

  //// no header cookies available
  //   so write cookies [sessionId and uuid] first time
  const set_multi_value_headers = {"Set-Cookie": [`_sessionId=${sessionId}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict`, `_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]};

  return {
      statusCode: 200,
      body: '',
      multiValueHeaders : set_multi_value_headers,
      headers: headers,
    };

};