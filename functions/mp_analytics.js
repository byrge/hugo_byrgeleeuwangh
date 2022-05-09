const axios = require('axios');

exports.handler = async (event, context) => {
    var netlify_context = context.clientContext
    console.log('Netlify context <><> ', netlify_context)
    console.log('Netlify <> event < event context ><> ', event)

    const isEmpty = Object.keys(netlify_context).length === 0;
    if(!isEmpty) {
        console.log('Netlify Context isn\'t isEmpty')
        function extractNetlifySiteFromContext(context) {
            data = context.clientContext.custom.netlify
            decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"))
            console.log('decoded <><> ', decoded)
            return decoded
        }
        const parsedContext = extractNetlifySiteFromContext(context)
        console.log('parsedContext <><> ', parsedContext)
    } else {
        console.log('Netlify Context isEmpty')
    }
        
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

    // enable IP anonymization, even though we're doing it here anyway
    analyticsRequestBody.append("aip", "1");

    // Override user IP (but anonymize it first)
    let user_ipaddress = event.headers["client-ip"] || event.headers["x-nf-client-connection-ip"];
    console.log('user_ipaddress ', user_ipaddress)
    analyticsRequestBody.append("uip", user_ipaddress);

    // GA makes us send a cid parameter, so we pick this from the cookie in the request
    let cookie_client_id = client_id;
    let split_cookie_client_id = cookie_client_id.split(".");
    let new_cookie_client_id = split_cookie_client_id[2]+"."+split_cookie_client_id[3];
    analyticsRequestBody.append("cid", new_cookie_client_id);

    // user agent
    analyticsRequestBody.append("ua", event.headers["user-agent"])

    // Set document location
    let user_document_location = event.headers['referer'] || undefined;
    if(user_document_location) {
        analyticsRequestBody.append("dl", user_document_location);
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

    // Set Netlify request ID
    let netlify_request_id = event.headers["X-Nf-Request-Id"];
    if(netlify_request_id) {
        analyticsRequestBody.append("cd10", netlify_request_id);
    }

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
    if(user_document_location) {
        google_organic = user_document_location.includes('google'); // TO DO > CONTEXT
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

    // get cookies from set_cookie.js function and send as custom definition to ga
    let initial_referer = cookies['_initial_referrer']; // cd7
    let marketing_campaign = cookies['_marketing_campaign']; // cd8
    let gclid_first_attribution = cookies['_gclid_first_attribution']; // cd9
    let recent_referrer = cookies['_recent_referrer']; // cd10
    let cookiejs_version = cookies['_cookiejs_version']; // cd11
    let initial_landing_page = cookies['_initial_landing_page']; // cd12
    analyticsRequestBody.append("cd7", initial_referer);
    analyticsRequestBody.append("cd8", marketing_campaign);
    analyticsRequestBody.append("cd9", gclid_first_attribution);
    analyticsRequestBody.append("cd10", recent_referrer);
    analyticsRequestBody.append("cd11", cookiejs_version);
    analyticsRequestBody.append("cd12", initial_landing_page
    );

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