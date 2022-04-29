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

    // Set event data
    analyticsRequestBody.append("tid", "UA-55505440-1")
    analyticsRequestBody.append("t", "event")
    analyticsRequestBody.append("ec", "netlify")
    analyticsRequestBody.append("ea", "function")
    analyticsRequestBody.append("el", event["path"])

    // Set user language
    let user_lang = event.headers['accept-language'];
    user_lang = user_lang.split(',')[0];
    analyticsRequestBody.append("ul", user_lang)

    console.log('queryStringParameters >>>> ', event["queryStringParameters"]);
    

    //for (const paramName in body.params) {
    //  analyticsRequestBody.append(paramName, body.params[paramName])
    //}

    // Send event to Google Analytics
    let ga_url = 'https://www.google-analytics.com/collect?';
    let gtm_server_url = 'https://tagging.byrgeleeuwangh.com/j/collect?';
    console.log('mp - analyticsRequestBody: ', gtm_server_url+analyticsRequestBody.toString())

    await axios({
        method: 'post',
        url: "https://www.google-analytics.com/collect?",
        data: analyticsRequestBody.toString()
    })

    return {
        statusCode: 200,
    };
}