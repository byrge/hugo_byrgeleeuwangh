---
title: "Set cookies via http response - ITP solution"
summary: "How to improve the lifetime of your cookies (especially your GA cookie) with Netlify functions and Hugo. "
date: 2021-02-02T21:04:03+01:00
page_id: 3836ac895497006db5935db3dfb6ed4b
showtoc: true
tocOpen: false
pagetype: "blogpost"
tags: ["netlify", "function"]
keywords: ["data-quality","cookies"]
author: "Byrge Leeuwangh"
author_email: "byrge@leeuwangh.com"
draft: true
---

# How to secure your cookies?

## What are secure cookies?
Secure cookies are a type of HTTP cookie that have Secure attribute set, which limits the scope of the cookie to "secure" channels (where "secure" is defined by the user agent, typically web browser). When a cookie has the Secure attribute, the user agent will include the cookie in an HTTP request only if the request is transmitted over a secure channel (typically HTTPS). 

[Secure Cookies Explained](https://en.wikipedia.org/wiki/Secure_cookie "Secure Cookies WikiPedia")
## Netlify
I use functions on Netlify to read the _ga cookie, set by the Google Analytics library with document.cookie, and rewrite them to set the cookie (Netlify Function) in the HTTP response. 
### Connect your functions to Netlify
My site is hosted with Netlify. To do so, you need to configure or create your `netlify.toml` config file. In here you need to reference your functions directory. My functions are in the root, so this is my config:

```
[build]
publish = "public"
functions = "./functions"
```

And in the `head.html` template you have to add the script `<script defer src="/.netlify/functions/hello"></script>` to load the function.

### Functions
- [Functions Overview](https://docs.netlify.com/functions/overview/)
- [Functions Playground](https://functions.netlify.com/playground/)

## Hugo & Netlify Functions
First step is to create a new directoy "functions" in your root of your hugo setup. Here you can write your first functions. I used Javascript to write my function, but you are also able to use other languages as `Go` or `Typescript`.

```
exports.handler = async (event, context) => {
  const name = event.queryStringParameters.name || "World";

  return {
    statusCode: 200,
    body: `Hello, ${name}`,
  };
};
```
