---
title: "Set cookies via http response - ITP solution"
summary: "How to improve the lifetime of your cookies (especially your GA cookie) with Netlify functions and Hugo. "
date: 2021-02-02T21:04:03+01:00
page_id: 3836ac895497006db5935db3dfb6ed4b
showtoc: true
tocOpen: false
pagetype: "blogpost"
tags: ["netlify-function"]
keywords: ["data-quality","cookies"]
author: "Byrge Leeuwangh"
author_email: "byrge@leeuwangh.com"
draft: false
---

# How to secure your cookies?

## What are secure cookies?
Secure cookies are a type of HTTP cookie that have Secure attribute set, which limits the scope of the cookie to "secure" channels (where "secure" is defined by the user agent, typically web browser). When a cookie has the Secure attribute, the user agent will include the cookie in an HTTP request only if the request is transmitted over a secure channel (typically HTTPS). 


[Secure Cookies Explained](https://en.wikipedia.org/wiki/Secure_cookie "Secure Cookies WikiPedia")
