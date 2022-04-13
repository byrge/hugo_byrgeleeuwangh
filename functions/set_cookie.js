exports.handler = async (event, context) => {
  // const location = event.queryStringParameters.location || "home";
  const headers_cookies = event.headers.cookie || undefined;
  const host_value = event.headers.host || "localhost";

  // set custom domain -- remove port number
  const current_domain = ( host_value.match(/:/g) ) ? host_value.slice( 0, host_value.indexOf(":") ) : event.headers.host
  console.log('current_domain: ',current_domain)

  // format logging
  const styles = [
    'color: black',
    'background: yellow',
    'font-size: 30px',
    'border: 1px solid red',
    'padding: 10px',
  ].join(';');

  // function create uuid
  var create_uuid = function () {
    console.log('%c%s', styles, 'function create_uuid started');

    //console.log('function create_uuid started');

    const ip_encode = new Buffer.from(event.headers['client-ip']);
    const ip_value = ip_encode.toString('base64');
    const seconds_since_epoch = Math.round(Date.now() / 1000)
    return ip_value + '-' + seconds_since_epoch;
  }

  // function create session id
  var session_id = function () {
    console.log('%c%s', styles, 'function session_id started');

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

  ///// cookie header variables
  // set Max-Age to one year
  const maxAge = 24*60*60*365;

  // set Secure Flag
  let hostname = event.headers.host;
  let secure;
  let local_host = hostname.indexOf('localhost');
  if(local_host === 0) {
    secure = `Secure`;
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
  const cookie_header_part = "; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict'";

  if(headers_cookies) {
    let cookies = headers_cookies.split(";").reduce(function(obj, str, index) {
      let strParts = str.split("=");
      if (strParts[0] && strParts[1]) { 
        obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim();
      }
      return obj;
    }, {});

    let cookieHeadersFromReq = [];
    Object.keys(cookies).forEach(key => {
      cookieHeadersFromReq.push(key + "=" + cookies[key] + "; Path=/; Domain=localhost; Max-Age=31536000; Secure; SameSite=strict");
    });
  
    var multiValueHeaders = {
      'Set-Cookie': cookieHeadersFromReq
    }
    console.log("multiValueHeaders: ", multiValueHeaders)

    
    let uuid = cookies['_uuid'];
    if(!uuid) {
      uuid = create_uuid();
      cookieHeadersFromReq.push(`_uuid=${uuid}; Path=/; Domain=localhost; Max-Age=31536000; Secure; SameSite=strict`);
      console.log("uuid created!", uuid)
    }
    let sessionId = cookies['_sessionId'];
    if(!sessionId) {
      sessionId = session_id();
      cookieHeadersFromReq.push(`_sessionId=${sessionId}; Path=/; Domain=localhost; Max-Age=31536000; Secure; SameSite=strict`);
      console.log("sessionId created!", sessionId)
    }

    // if (cookies['_ga'] && cookies['_ga_TSKQWXB2BC'] && cookies['_gac_UA-55505440-1'] && cookies['_uuid'] && cookies['_sessionId']) {
    //   // all cookies available
    //   // set cookies for _ga, _ga_TSKQWXB2BC, _gac_UA-55505440-1, uuid and sessionId
    //   // console.log('all cookies available from header')
    //   // console.log('uuid: ', cookies['_uuid'])
    //   // console.log('sessionId: ', cookies['_sessionId'])
    //   // console.log('ga: ', cookies['_ga'])
    //   // console.log('_gac_UA-55505440-1: ', cookies['_gac_UA-55505440-1'])
    //   // console.log('ga_TSKQWXB2BC: ', cookies['_ga_TSKQWXB2BC'])
    //   // set_multi_value_headers = {"Set-Cookie": [`_ga=${ga}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`_ga_TSKQWXB2BC=${ga_TSKQWXB2BC}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`_gac_UA-55505440-1=${gac}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]};
    // } 
    // else if (cookies['_ga'] && cookies['_ga_TSKQWXB2BC'] && cookies['_gac_UA-55505440-1'] && cookies['_uuid'] && cookies['_sessionId']) {
    //   // console.log('no cookies available from header')
    //   // set_multi_value_headers = {"Set-Cookie": [`_ga=${ga}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`_ga_TSKQWXB2BC=${ga_TSKQWXB2BC}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]};
    // }
    // else if ( !cookies['_uuid'] && !cookies['_sessionId']) {
    //   //  STEP 4 -- write cookies [sessionId and uuid] first time
    //   console.log('STEP 4 -- no uuid and sessionId')
    //   // set_multi_value_headers = {"Set-Cookie": [`_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`,`_sessionId=${sessionId}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict`]};    
    // }

    // write cookies
    return {
      statusCode: 200,
      body: '',
      multiValueHeaders : multiValueHeaders,
      headers: headers,
    };
  } else {
      //// no header cookies available
      //   so write cookies [sessionId and uuid] first time
      const uuid = create_uuid();
      const sessionId = session_id();
      const set_multi_value_headers = {"Set-Cookie": [`_sessionId=${sessionId}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict`, `_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]};

      return {
          statusCode: 200,
          body: '',
          multiValueHeaders : set_multi_value_headers,
          headers: headers,
        };
  }
};