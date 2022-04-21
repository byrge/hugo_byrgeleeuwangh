exports.handler = async (event, context) => {
    console.log('mp - started: ')

    const header_value = event.headers;
    console.log('mp - header_value: ', header_value)

    let cookies = headers_cookies.split(";").reduce(function(obj, str, index) {
        let strParts = str.split("=");
        if (strParts[0] && strParts[1]) { 
            obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim();
        }
        return obj;
    }, {});

    let client_id = cookies['_ga'];
    console.log('mp - cookies client_id: ', client_id)


    const analyticsRequestBody = undefined;
    analyticsRequestBody.append("v", "1")

    // enable IP anonymization, even though we're doing it here anyway
    analyticsRequestBody.append("aip", "1")

      // GA makes us send a cid parameter, so we send a new UUID every time
  // because we don't actually want to track users across requests
  analyticsRequestBody.append("cid", client_id)

  // Override user agent
  analyticsRequestBody.append("ua", event.headers["user-agent"])

  // Override user IP (but anonymize it first)
  analyticsRequestBody.append("uip", anonymizeIP(event.headers["client-ip"]))

  // Set event data

  analyticsRequestBody.append("tid", process.env.GOOGLE_ANALYTICS_TRACKING_ID)
  analyticsRequestBody.append("t", body.type)

  for (const paramName in body.params) {
    analyticsRequestBody.append(paramName, body.params[paramName])
  }

  // Send event to Google Analytics
    console.log('mp - analyticsRequestBody: ', analyticsRequestBody)

}