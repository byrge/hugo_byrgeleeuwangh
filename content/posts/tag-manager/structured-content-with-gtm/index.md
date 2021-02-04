---
title: "Structured Content With Google Tag Manager"
summary: "Adding structured data can be done in many different ways. One of them is by using Google Tag Manager. The advantage of structured data is to enrich your SERP Results. This article is about how to implement structured data, **ld+json**, using the Tag Manager and how to test your structured data."
date: 2021-01-14T19:53:06+01:00
page_id: 32dce2beb3aaccd0a783c8aaf4ab7781
showtoc: true
tocOpen: false
tags: ["seo", "gtm", "ld+json", "structured-content"]
keywords: ["gtm","ld+json", "google tag manager"]
author: "Byrge Leeuwangh"
draft: false
---

## How to implement structured data with Google Tag Manager

Adding structured data can be done in many different ways. One of them is by using Google Tag Manager. The advantage of structured data is to enrich your SERP Results. This article is about how to implement structured data, **ld+json**, using the Tag Manager and how to test your structured data.

The article will show you how to do this. I'll walk you through the next steps:

1. Find the structured markup you need
2. Before adding the markup to a Custom HTML tag in Google Tag Manager you can start with creating the correct markup in Google's structured test tool → see `step 5`. In the [tool](https://search.google.com/structured-data/testing-tool) click `NEW TEST` → `CODE SNIPPET` → paste your markup → `RUN SNIPPET`. Now you're able to tweak your markup and validate
3. After validation add the markup to the Tag Manager in a Custom HTML tag. Now you can preview your Tag Manager container to see and test the structured data on your page
4. Reload your page and copy the html block by right- click on the concerning ld+json script: `Copy` → `Copy outerHTML`
5. Test your strucured data in [Google's structured test tool](https://search.google.com/structured-data/testing-tool) to see if you have no errors
6. Check your structured data in [Google Search Console](https://search.google.com/search-console)

### Find your structured data snippet

There is a lot of information online available about structured data. From *introductions* to *Codelabs* and *pre-made markup*. Have a look at the links underneath:

* [Google: Follow the structured data guidelines](https://developers.google.com/search/docs/guides/sd-policies)
* [Google: Intro to structured data](https://developers.google.com/search/docs/guides/intro-structured-data)
* [Google: Structured Data Codelab](https://codelabs.developers.google.com/codelabs/structured-data/index.html)
* A tool intended for SEO’s and webmasters seeking [pre-made and validated JSON-LD markup](https://jsonld.com/)


### Test & implement your structured markup

Before adding the markup to GTM, you can validate your strucured data snippet in [Google's structured test tool](https://search.google.com/structured-data/testing-tool). In the tool click `NEW TEST` → `CODE SNIPPET` → paste your markup → `RUN SNIPPET`.  
{{< img src="images/test-your-structured-data.png" alt="test your structured data" >}}


Check if your markup is correct and there are no warnings or errors:     

{{< img src="images/test-your-structured-data-2.png" alt="check your structured data" >}}


Now you're able to tweak your markup and validate. When you're done and your markup fit your needs and has no validation errors anymore it's time to add the markup to your GTM container. Paste your markup in the variable `data` (*) in the code underneath.  

```
<script>
(function() {
  var data = {
	…
  };
  var script = document.createElement("script");
  script.type = "application/ld+json";
  script.innerHTML = JSON.stringify(data);
  document.head.appendChild(script);
})();
</script>
```

*(\*) between the curly brackets and remove the …*

Instead of copy and paste your markup in the above snippet, you can also paste your markup in the [online converter](https://saijogeorge.com/json-ld-schema-generator/tag-manager-fix/) to have a GTM ready version of your ld+json structured data snippet.

Afterwards add a new `Custom HTML` Tag in GTM and paste the complete snippet including the `<script> (function() { …`.

### Create dynamic values for your structured data
Now you can decide what data in your markup can be dynamically retrieved from the dataLayer or from other `variables` on your page. Some markup needs to be dynamically set, like product id's on product detail pages for example.  

E.g.: you can retrieve the `meta description` of your page by adding a new variable to your GTM container. For the variable choose `Page Elements` → `DOM Element` and set the variable according to the following:

* Name: VAR Meta Description
* Type: CSS selector
* Element Selector: meta[name='description']
* Attribute Name: content

{{< img src="images/structured_data_meta_tag_description.png" alt="gtm css selector variable" >}}

After adding variables to your GTM container and tweaking your markup to make use of dynamic page data you can preview your change(s) in GTM.  

When your preview modus is ready visit your webpage and check if the newly added `Custom HTML` Tag has been fired. When fired you should see the `ld+json` script within the `Developer Tools` `Elements` tab.  

Here copy the script (see screenshot) and paste this in [Google's structured test tool](https://search.google.com/structured-data/testing-tool) to see if everything is correct and validated.
 
{{< img src="images/structured_data_copy_outerhtml.png" alt="copy your ld+json" >}}


When your preview is correct and validated your next step is to publish your container and annotate Google Analytics. Now you have to wait till Google Search Console 'sees' your changes (or go to Google Search Console and [request (re)indexing your page](https://support.google.com/webmasters/answer/9012289?hl=en)).

### Check your structured data in Search Console
Check in [Google Search Console](https://search.google.com/search-console) how your structured data is interpreted by Google and see if you have any errors or warnings. Here is an example for product structured data:    

{{< img src="images/search-console.png" alt="check search console" >}}


Checkout these [videos](https://www.youtube.com/watch?v=ONr5Z7VhNFI) for more information about how Search Console works.


__