exports.handler = async (event, context) => {
  // const location = event.queryStringParameters.location || "home";
  const headers_cookies = event.headers.cookie || undefined;
  const host_value = event.headers.host || "localhost";
  //const header_value = event.headers;
  //console.log('header_value: ', header_value)
  const header_referer_value = event.headers.referer;
  console.log('header_referer_value: ', header_referer_value)
  let searchQuery = header_referer_value.split("?");
  searchQuery = '?'+searchQuery[1];
  let params = new URLSearchParams(searchQuery);
  // get Marketing parameters
  let param_gclid = params.get('gclid');
  let param_utmSource = params.get('utm_source');
  let param_utmMedium = params.get('utm_medium');
  let param_utmCampaign = params.get('utm_campaign');
  let param_utmCampaignId = params.get('utm_id');

  const header_platform_value = event.headers['sec-ch-ua-platform'];
  console.log('header_platform_value: ', header_platform_value)
  const header_ua_value = event.headers['user-agent'];
  console.log('header_ua_value: ', header_ua_value)
  

  // set custom domain -- remove port number
  const current_domain = ( host_value.match(/:/g) ) ? host_value.slice( 0, host_value.indexOf(":") ) : event.headers.host
  console.log('current_domain: ',current_domain)

  var create_uuid = function (){
    console.log('function uuid started');
    var dt = new Date().getTime();
    const seconds_since_epoch = Math.round(Date.now() / 1000);
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    uuid = uuid+'.'+seconds_since_epoch
    return uuid;
  }


  // function create session id
  var session_id = function () {
    console.log('function session_id started');
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
  const cookie_header_part = `; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict'`;

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
      cookieHeadersFromReq.push(key + "=" + cookies[key] + cookie_header_part);
    });
    
    // check existing cookies set by me
    let uuid = cookies['_uuid'];
    let sessionId = cookies['_sessionId'];
    let gclid_first_attribution = cookies['_gclid_first_attribution'];
    let initial_referrer = cookies['_initial_referrer'];

    if(!uuid) {
      uuid = create_uuid();
      cookieHeadersFromReq.push( `_uuid=${uuid}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict` );
      console.log("uuid created!", uuid)
    }
    if(!sessionId) {
      sessionId = session_id();
      if(uuid) {
        let uuid8 = uuid.substring(0, 8);
        sessionId += '.'+uuid8;
      }
      cookieHeadersFromReq.push( `_sessionId=${sessionId}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict` );
      console.log("sessionId created!", sessionId)
    }
    //_gclid_first_attribution
    if(!gclid_first_attribution && param_gclid) {
      cookieHeadersFromReq.push( `_gclid_first_attribution=${param_gclid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict` );
      console.log("gclid cookie created!", param_gclid)
    }
    //_initial_referrer
    let cookieHeadersInitialReferer
    let utm_marketing = param_utmSource + ' / ' + param_utmMedium || undefined;
    utm_marketing = utm_marketing.toLowerCase();
    let utm_marketing_name = param_utmCampaign || undefined;
    utm_marketing_name = utm_marketing_name.toLowerCase();

    if(!initial_referrer && param_gclid) {
      cookieHeadersInitialReferer = `_initial_referrer=Paid Search; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      console.log("_initial_referrer gclid cookie created!")
    } else if(!initial_referrer && param_utmSource) {
      cookieHeadersInitialReferer = `_initial_referrer=${utm_marketing}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      console.log("_initial_referrer utm cookie created!")
    } else if(!param_utmSource && !param_gclid) {
      cookieHeadersRecentReferer = `_recent_referrer=(Direct); Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      console.log("_recent_referrer Direct cookie created!")
    }
    if(cookieHeadersInitialReferer) {
      cookieHeadersFromReq.push(cookieHeadersInitialReferer);
    }
    
    //_recent_referrer
    let cookieHeadersRecentReferer
    if(param_gclid && initial_referrer !== 'Paid Search') {
      cookieHeadersRecentReferer = `_recent_referrer=Paid Search; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      console.log("_recent_referrer gclid cookie created!")
    } else if(utm_marketing && utm_marketing !== initial_referrer) {
      cookieHeadersRecentReferer = `_recent_referrer=${utm_marketing}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      console.log("_recent_referrer utm cookie created!")
    } else if(!param_utmSource && !param_gclid) {
      cookieHeadersRecentReferer = `_recent_referrer=(Direct); Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      console.log("_recent_referrer Direct cookie created!")
    }
    if(cookieHeadersRecentReferer) {
      cookieHeadersFromReq.push(cookieHeadersRecentReferer);
    }

    //_marketing_campaign
    if(utm_marketing_name) {
      cookieHeadersRecentReferer = `_marketing_campaign=${utm_marketing_name}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      console.log("utm_marketing campaign cookie created!")
    } 

    // Set cookie headers
    var multiValueHeaders = {
      'Set-Cookie': cookieHeadersFromReq
    }
    console.log(">> multiValueHeaders: ", multiValueHeaders)

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
      console.log("uuid created!", uuid)
      const sessionId = session_id();
      if(uuid) {
        let uuid8 = uuid.substring(0, 8);
        sessionId += '.'+uuid8;
      }
      console.log("sessionId created!", sessionId)
      const set_multi_value_headers = {"Set-Cookie": [`_sessionId=${sessionId}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict`, `_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]};

      return {
          statusCode: 200,
          body: '',
          multiValueHeaders : set_multi_value_headers,
          headers: headers,
        };
  }
};