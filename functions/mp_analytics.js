const axios = require('axios');
  
exports.handler = async (event, context) => {
    console.log('mp - started: ')
    console.log('mp - event : ', event)

    const header_value = event.headers;
    console.log('mp - header_value: ', header_value)

    const headers_cookies = event.headers.cookie || undefined;
    let cookies = headers_cookies.split(";").reduce(function(obj, str, index) {
        let strParts = str.split("=");
        if (strParts[0] && strParts[1]) { 
            obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim();
        }
        return obj;
    }, {});

    let client_id = cookies['_ga'];

    const analyticsRequestBody = new URLSearchParams();
    analyticsRequestBody.append("v", "1");
    analyticsRequestBody.append("ds", "netlify_function");

    // Set document path
    analyticsRequestBody.append("dp", event["path"])

    // enable IP anonymization, even though we're doing it here anyway
    analyticsRequestBody.append("aip", "1");

    // Override user IP (but anonymize it first)
    analyticsRequestBody.append("uip", event.headers["client-ip"])

    // GA makes us send a cid parameter, so we pick this from the cookie in the request
    let cookie_client_id = client_id;
    let split_cookie_client_id = cookie_client_id.split(".");
    let new_cookie_client_id = split_cookie_client_id[2]+"."+split_cookie_client_id[3];
    analyticsRequestBody.append("cid", new_cookie_client_id);

    // user agent
    analyticsRequestBody.append("ua", event.headers["user-agent"])

    // referer
    let user_referer = event.headers['referer'] || undefined;
    if(user_referer) {
        analyticsRequestBody.append("dr", user_referer);
    }

    // set country
    let user_country = event.headers['x-country'] || undefined;
    if(user_country) {
        analyticsRequestBody.append("geoid", user_country);
    }
    // Set user language
    let user_lang = event.headers['accept-language'];
    if(user_lang) {
        user_lang = user_lang.split(',')[0];
        analyticsRequestBody.append("ul", user_lang)
    }

    // Set event data
    analyticsRequestBody.append("tid", "UA-55505440-1")
    analyticsRequestBody.append("t", "event")
    analyticsRequestBody.append("ec", "Netlify Function")
    analyticsRequestBody.append("ea", event["path"])
    let user_platform = event.headers['sec-ch-ua-platform'];
    analyticsRequestBody.append("el", user_platform);

    // queryStringParameters
    let searchQuery = event["queryStringParameters"];
    let params = new URLSearchParams(searchQuery)
    // get Marketing (utm) parameters
    let param_gclid = params.get('gclid') || undefined;
    let param_utmSource = params.get('utm_source') || undefined;
    let param_utmMedium = params.get('utm_medium') || undefined;
    let param_utmCampaign = params.get('utm_campaign') || undefined;

    if(param_utmSource && param_utmMedium) {
        console.log('set utm params')
        analyticsRequestBody.append("cs", param_utmSource);
        analyticsRequestBody.append("cm", param_utmMedium);
    }
    if(param_utmCampaign) {
        analyticsRequestBody.append("cn", param_utmCampaign);
    }
    if(param_gclid) {
        console.log('set gclid params')
        analyticsRequestBody.append("cs", 'google');
        analyticsRequestBody.append("cm", 'cpc');
        analyticsRequestBody.append("gclid", param_gclid);
    }
    let google_organic = undefined;
    if(user_referer) {
        google_organic = user_referer.includes('google');
    }
    if(!param_gclid && google_organic) {
        console.log('set organic params')
        analyticsRequestBody.append("cs", 'google');
        analyticsRequestBody.append("cm", 'organic');
    }
    else if(!param_utmSource && !param_gclid) {
        console.log('no params > direct')
        analyticsRequestBody.append("cs", '(direct)');
        analyticsRequestBody.append("cm", '(none)');
    }

    // Send event to Google Analytics
    let ga_url = 'https://www.google-analytics.com/collect?';
    let gtm_server_url = 'https://tagging.byrgeleeuwangh.com/j/collect?';
    console.log('mp - analyticsRequestBody: ', ga_url+analyticsRequestBody.toString())

    await axios({
        method: 'post',
        url: "https://www.google-analytics.com/collect?",
        data: analyticsRequestBody.toString()
    })

    return {
        statusCode: 200,
    };
}