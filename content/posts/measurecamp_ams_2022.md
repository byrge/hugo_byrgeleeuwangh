---
title: "Measurecamp Amsterdam 2022"
summary: "My Measurecamp Amsterdam Presentation from last Saterday May 20th"
date: 2022-05-25T19:42:19+02:00
page_id: ee4f1264531dc80dbdf0b25ecc627564
pagetype: "blogpost"
tags: ["measurecamp", "presentation"]
keywords: ["gtm","server", "playground"]
author_email: "byrge@leeuwangh.com"
author: "Byrge Leeuwangh"
showtoc: false
tocOpen: false
draft: false
---

# Measurecamp Amsterdam 2022
Last Saterday I visited Measurecamp Amsterdam and gave my first presentation. I presented a playground for GTM Server. How to setup your local and online environment so you can test and debug with GTM Server.

## My setup
My setup exists of the following 

- [Microsoft Visual Studio Code](https://code.visualstudio.com/download/ "Microsoft Visual Studio Code Editor") 
- Javascript & Go
- [Hugo](https://gohugo.io/ "Hugo as a static site generator") as a SSG (Static Site Generator)
- Created my own middleware for analytics
- Publish my code to Github
- Enabled auto deployment to Netlify
- [Netlify](https://netlify.com "Netlify for Hugo hosting") Netlify as hosting platform
- Netlify function for server to gtm server tagging
- Netlify function for server side cookies
- [Stape.io](https://stape.io "GTM Server from Stape.io") as my GTM Server setup


I played with client to server ([Data Tag](https://stape.io/blog/sending-data-from-google-tag-manager-web-container-to-the-server-container "Data Tag from Stape.io")) and server to server ([Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1 "Measurement Protocol for Universal Analytics")). All the tools above helped me to play with GTM Server and see how things work. I tested the server to server setup and learned how to read the cookie information to sent along the mp request to GTM Server.

The Data Tag helped me to learn about how to sent the complete dataLayer object to GTM Server and be abl eto use th edata in there to sent along with other Events.

You can find the [presentation](/pdf/MeasureCamp_AMS_2022.pdf "MeasureCamp presentation") here. 

If you have any questions, let me [know](/contact "Contact Form").