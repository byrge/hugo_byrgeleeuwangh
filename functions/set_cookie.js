exports.handler = async (event, context) => {
  const headers_cookies = event.headers.cookie || undefined;
  const host_value = event.headers.host || "localhost";
  const event_referer = event.headers['referer'];
  const url = new URL(event_referer);
  const params = new URLSearchParams(url.search);

  // get Marketing parameters
  let param_gclid = params.get('gclid');
  let param_dclid = params.get('dclid');
  let param_msclkid = params.get('msclkid');
  let param_fbclid = params.get('fbclid');
  let param_utmSource = params.get('utm_source');
  let param_utmMedium = params.get('utm_medium');
  let param_utmCampaign = params.get('utm_campaign');
  let param_utmCampaignId = params.get('utm_id');

  // set variables
  let cookieHeadersInitialReferer
  let cookieHeadersRecentReferer
  let cookieHeadersMarketingCampaignName

  const header_platform_value = event.headers['sec-ch-ua-platform'];
  //const header_ua_value = event.headers['user-agent'];

  // set custom domain -- remove port number
  const current_domain = ( host_value.match(/:/g) ) ? host_value.slice( 0, host_value.indexOf(":") ) : event.headers.host

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
  const cookie_header_part = `; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
  const cookie_header_part_session = `; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict`;

  if(headers_cookies) {
    let cookies = headers_cookies.split(";").reduce(function(obj, str, index) {
      let strParts = str.split("=");
      if (strParts[0] && strParts[1]) { 
        obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim();
      }
      return obj;
    }, {});

    let cookieHeadersFromReq = [];
    // Object.keys(cookies).forEach(key => {
    //   if(key === '_sessionId') {
    //     cookieHeadersFromReq.push(key + "=" + cookies[key] + cookie_header_part_session);
    //   } else {
    //     cookieHeadersFromReq.push(key + "=" + cookies[key] + cookie_header_part);
    //   }
    // });

    // Function to create new cookie headers
    let cookie_to_set
    function create_cookie_to_set(cookievalue) {
      if(cookie_to_set) {
        cookie_to_set += '; ';
        cookie_to_set += cookievalue;
      } else {
        cookie_to_set = cookievalue;
      }
      debugFunction('create_cookie_to_set: ', cookievalue)
    }

    // Function for debug. Set cookie `cookie_debug` with value to true
    function debugFunction(text, param) {
      let cookie_debug = cookies['cookie_debug'];
      const debug_text = '<> cookie_debug info <><> ';
      if(cookie_debug) {
        if(param) {
          console.log(debug_text, text, param)
        } else {
          console.log(debug_text, text)
        }
      }  
    }
    
    debugFunction('qsp params',params)

    // check existing cookies set by me
    let uuid = cookies['_uuid'];
    let sessionId = cookies['_sessionId'];
    let gclid_first_attribution = cookies['_gclid_first_attribution'];
    let initial_referrer = cookies['_initial_referrer'];
    let initial_landing_page = cookies['_initial_landing_page'];

    let cookieHeaders = [];
    if(!uuid) {
      uuid = create_uuid();
      cookieHeaders.push( `_uuid=${uuid}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict` );
      create_cookie_to_set(`_uuid=${uuid}`);
    }
    if(!sessionId) {
      sessionId = session_id();
      if(uuid) {
        let uuid8 = uuid.substring(0, 8);
        sessionId += '.'+uuid8;
      }
      cookieHeaders.push( `_sessionId=${sessionId}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict` );
      create_cookie_to_set(`_sessionId=${sessionId}`);
    }
    //_gclid_first_attribution
    if(!gclid_first_attribution && param_gclid) {
      cookieHeaders.push( `_gclid_first_attribution=${param_gclid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict` );
      create_cookie_to_set(`_gclid_first_attribution=${param_gclid}`);
    }
    // marketing settings
    let utm_marketing = undefined;
    let utm_marketing_name = undefined;

    if(param_utmSource) {
      utm_marketing = param_utmSource + ' / ' + param_utmMedium;
      if(utm_marketing){
        utm_marketing = utm_marketing.toLowerCase();
      }
      utm_marketing_name = param_utmCampaign;
      if(utm_marketing_name){
        utm_marketing_name = utm_marketing_name.toLowerCase();
        debugFunction('utm_marketing set to ', utm_marketing);
      }
    }
  
    // _initial_landing_page
    if(!initial_landing_page) {
      initial_landing_page = event_referer;
      cookieHeadersInitialLandingpage = `_initial_landing_page=${initial_landing_page}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      cookieHeaders.push(cookieHeadersInitialLandingpage);
      create_cookie_to_set(`_initial_landing_page=${initial_landing_page}`);
    } else {
      debugFunction('no initial_landing_page set because already available')
    }

    //_initial_referrer
    if(initial_referrer) {
      debugFunction('no initital referrer set because already available');
    } else {
      if(param_gclid || param_dclid || param_msclkid || param_fbclid) {
        cookieHeadersInitialReferer = `_initial_referrer=Paid Search; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
        create_cookie_to_set(`_initial_referrer=Paid Search`);
      } else if(param_utmSource) {
        cookieHeadersInitialReferer = `_initial_referrer=${utm_marketing}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
        create_cookie_to_set(`_initial_referrer=${utm_marketing}`);
      } else if(!param_utmSource && !param_gclid) {
        cookieHeadersInitialReferer = `_initial_referrer=(Direct); Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
        create_cookie_to_set(`_initial_referrer=(Direct)`);
      }
      if(cookieHeadersInitialReferer) {
        cookieHeaders.push(cookieHeadersInitialReferer);
      }
      debugFunction(`_initial_referrer cookieHeadersFromReq`, cookieHeadersFromReq);
    }

    //_recent_referrer
    if(param_gclid || param_dclid || param_msclkid || param_fbclid) {
      cookieHeadersRecentReferer = `_recent_referrer=Paid Search; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      create_cookie_to_set(`_recent_referrer=Paid Search`);
    } else if(param_utmSource) {
      cookieHeadersRecentReferer = `_recent_referrer=${utm_marketing}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      create_cookie_to_set(`_recent_referrer=${utm_marketing}`);
    } else if(!param_utmSource && (!param_gclid || !param_dclid || !param_msclkid || !param_fbclid)) {
      cookieHeadersRecentReferer = `_recent_referrer=(Direct); Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      create_cookie_to_set(`_recent_referrer=(Direct)`);
    }
    if(cookieHeadersRecentReferer) {
      cookieHeaders.push(cookieHeadersRecentReferer);
    }

    //_marketing_campaign
    if(param_utmCampaign) {
      cookieHeadersMarketingCampaignName = `_marketing_campaign=${utm_marketing_name}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
      create_cookie_to_set(`_marketing_campaign=${utm_marketing_name}`);
    } 
    if(cookieHeadersMarketingCampaignName) {
      cookieHeaders.push(cookieHeadersMarketingCampaignName);
    }

    // Set cookie with version number for cookie.js
    let cookie_js_version = 0.98;
    let cookieHeadersVersionNumber = undefined;
    cookieHeadersVersionNumber = `_cookiejs_version=${cookie_js_version}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`;
    cookieHeaders.push(cookieHeadersVersionNumber);
    create_cookie_to_set(`_cookiejs_version=${cookie_js_version}`);

    debugFunction('cookie_to_set <>>> ', cookie_to_set); // <<<<<<<<<<<<<<<<

    // Combine new and existing cookies
    //// cookies in request coming in
    debugFunction('cookieHeadersFromReq', cookieHeadersFromReq)
    //// new cookies set
    debugFunction('cookieHeaders New', cookieHeaders)

    let cookie_to_set_obj = cookie_to_set.split(";").reduce(function(obj, str, index) {
      let strParts = str.split("=");
      if (strParts[0] && strParts[1]) { 
        obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim();
        }
      return obj;
    }, {});
    let mergeObj = {...cookies ,...cookie_to_set_obj};

    Object.keys(mergeObj).forEach(key => {
      if(key === '_sessionId') {
        cookieHeadersFromReq.push(key + "=" + mergeObj[key] + cookie_header_part_session);
      } else {
        cookieHeadersFromReq.push(key + "=" + mergeObj[key] + cookie_header_part);
      }
    });

    // Set cookie headers
    var multiValueHeaders = {
      'Set-Cookie': cookieHeadersFromReq
    }
    debugFunction("Set-Cookie multiValueHeaders: ", multiValueHeaders)

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
      debugFunction("uuid created!", uuid)
      let sessionId = session_id();
      if(uuid) {
        let uuid8 = uuid.substring(0, 8);
        sessionId += '.'+uuid8;
      }
      debugFunction("sessionId created!", sessionId)
      const set_multi_value_headers = {"Set-Cookie": [`_sessionId=${sessionId}; Path=/; Domain=${current_domain}; ${secure}; SameSite=strict`, `_uuid=${uuid}; Path=/; Domain=${current_domain}; Max-Age=${maxAge}; ${secure}; SameSite=strict`]};

      return {
          statusCode: 200,
          body: '',
          multiValueHeaders : set_multi_value_headers,
          headers: headers,
        };
  }
};