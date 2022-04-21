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
    console.log('mp - cookies client_id: ', client_id);


    const analyticsRequestBody = new URLSearchParams();
    analyticsRequestBody.append("v", "1");
    analyticsRequestBody.append("ds", "netlify_function");

    // Set document path
    analyticsRequestBody.append("dp", event["path"])

    // enable IP anonymization, even though we're doing it here anyway
    analyticsRequestBody.append("aip", "1");

    // Override user IP (but anonymize it first)
    analyticsRequestBody.append("uip", event.headers["client-ip"])

      // GA makes us send a cid parameter, so we send a new UUID every time
    // because we don't actually want to track users across requests
    analyticsRequestBody.append("cid", client_id);

    // Override user agent
    analyticsRequestBody.append("ua", event.headers["user-agent"])

    // Set event data
    analyticsRequestBody.append("tid", "UA-55505440-1")
    analyticsRequestBody.append("t", "event")
    analyticsRequestBody.append("ec", "netlify")
    analyticsRequestBody.append("ea", "function")
    analyticsRequestBody.append("el", event["path"])

    //for (const paramName in body.params) {
    //  analyticsRequestBody.append(paramName, body.params[paramName])
    //}

  // Send event to Google Analytics
    let ga_url = 'https://www.google-analytics.com/collect?';
    console.log('mp - analyticsRequestBody: ', ga_url+analyticsRequestBody.toString())

    await axios.post(
        "https://www.google-analytics.com/collect?",
        analyticsRequestBody.toString()
      )

    return {
        statusCode: 200,
    };

}