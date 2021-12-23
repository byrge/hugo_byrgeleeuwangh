---
title: "Analytics API - what about it"
summary: "Why should you create your own or make use of an existing analytics tagging API? And what do I mean by an analytics tagging API?"
date: 2021-12-20T15:17:58+01:00
page_id: bd074fc7199790f7c06b80c1ca6f60dd
pagetype: "blogpost"
tags: ["middleware", ""]
keywords: ["javascript","setup", ""]
showtoc: true
tocOpen: false
author_email: "byrge@leeuwangh.com"
author: "Byrge Leeuwangh"
draft: true

---

# Analytics tagging API
Why should you create your own or make use of an existing analytics tagging API? And what do I mean by an analytics tagging API?

## Why an analytics tagging API?
You could implement all web tagging for Google Analytics (or a similar analytics product) hard coded in your front-end, but that means that when you need to make changes you have to check all your existing code for these tags. 

The moment you have more teams responsilble for the front-end code you'll probably land on some backlogs before changes are on production. 

By creating your own – or make use of an existing analytics tagging API you're able to create your own functions or use existing functions available in the API.  

In this post I describe how I creasted my own analytics tagging API and how you can make use of the tagging logic.


### Advantages
What are some advantages of creating your own analytics tagging API? To name some:
* less time maintenance of tagging logic because coding is in one place (API)
* easier implementation, which results in less time needed for adding tagging and improved data quality
* the analytics tagging API will have all logic needed for correct tagging in one place which results in the above improvements
* the analytics tagging API will results in better - and consistent tagging to deliver the above improvements


> Example: say you want to make changes to how you define your list name for product impressions (aka `view_item_list` or `impressions`). Without your own analytics tagging API you need to ask all teams (responsible for the web front-end code) to implement the new logic to create the new list name. Now with the analytics tagging API you can make changes in here to reflect the entire website.

> Another example: You want to start with the implementation of Google Analytics 4 on your website. For now it's dual tagging, so you need to keep Universal Analytics as well. You could use Google Tag Manager, but say you want also the dataLayer to reflect the changes…   
With the analytics tagging API you could create a new function which *translates* the current Enhanced Ecommerce functionality to the new GA4 data model before pushing the event(s) to the `dataLayer`. 


## Setup and implementation
How does this analytics tagging API work? I use data attributes to get the interesting data I need from my page in my API. By using data attributes I can *collect* these on the right moments, think `click` or in `viewport` for example.

I decorate my pages with data attributes which hold the information needed for `page_view`, `view_item` and all other interesting events to send e-commerce data to Google Analytics.  

Most of the times the (front-end) developer is already collecting the important data to show the product price, brand name and so on and so forth on the page. Instead of asking the (front-end) developer to create the tagging logic on their own they can set the important data in a data attribute.

> Example of my site. I do some e-commerce tracking on my blog for learning purposes of my own and to create the tagging API. Here is an example of a blog post and the corresponding `view_item` event for GA4:

```
<div data-analytics="{'author':'Byrge Leeuwangh','author_email':'byrge@leeuwangh.com','date':'2021-12-20T15:17:58+01:00','draft':true,'event':'blogpost','iscjklanguage':false,'keywords':['javascript','setup',''],'lastmod':'2021-12-20T15:17:58+01:00','page_id':'bd074fc7199790f7c06b80c1ca6f60dd','pagetype':'blogpost','publishdate':'2021-12-20T15:17:58+01:00','showtoc':true,'summary':'How to improve the lifetime of your cookies (especially your GA cookie) with Netlify functions and Hugo. ','tags':['middleware',''],'title':'Analytics API - basic setup','tocopen':false}" data-analytics-id="bd074fc7199790f7c06b80c1ca6f60dd" data-analytics-words="541" data-analytics-eventname="view_item"></div>
```
You can see here that this is understandable and probably easy to do. The analytics tagging API will use these data attributes `data-analytics` to collect the data and send them to the event which belongs to the event mentioned in `event_name` in the data attribute.

The data attributes together with the analytics tagging API create the following network request:  
### Google Analytics 4
A *pageview* and including product detail view (`view_item`)

```
en=page_view&epn.iso_week=51&ep.day_long=Monday&ep.theme_color=auto&ep.hugo_version=0.90.1&ep.page_type=page&ep.month_published=12&ep.year_published=2021&epn.reading_time=3&epn.words=608&ep.environment=dev&up.ga_cookie=GA1.1.415183184.1638542841&up.ga_cookie_original=GS1.1.1640008161.32.1.1640014689.0
en=view_item&pr1=idbd074fc7199790f7c06b80c1ca6f60dd~nmAnalytics%20API%20-%20basic%20setup~camiddleware~c2~vaauto~brByrge%20Leeuwangh~pr608~qt1&ep.content_group=page&epn.value=608&ep.page_type=page
``` 
### Google Universal Analytics
A product detail view (`view_item`)

Another advantage is that the (front-end) developer doesn't have to worry about things like the product impression `view`, `click`, product impressions `list name`, which are specific implementation details for Google Universal Analytics or Google Analytics 4.  
Normally for product impressions you need to build your own logic to only send those product impressions to Google Analytics when seen by the visitor (aka in viewport). The advantage of the tagging API is that this logic is done by the API and of no concern for the (front-end) developer anymore.

### Setup
The setup and implementation can be very simple versus a full blown implemention you have to do yourself. Except for the analytics knowledge to send the event with all the parameters you have to send them on the correct moment.

The analytics tagging API will help here. All the analytics knowledge is integrated as are the correct moments. You have to load the analytics tagging API script as high as possible in your `head` of the template.

### Implementation
To start your implementation you should take the next steps:  
* load the analytics tagging API script as high as possible in your `head` of the template
* create the correct data analytics attributes on your templates

#### Category Overview pages or Product Lists
A category overview page is a page with an overview of multiple products, for example a page which shows all `women > clothing > jeans` products (1).

A product list can be for example a list of products on your homepage or view cart page to boost sales. 

*(1) Here we want to send impressions of products seen by the visitor of your website. The challenge is to only send the impressions of the products seen by our visitor and not send all the product impressions at once.*

* the event name should reflect the (I use the GA4 naming convention for e-commerce here) e-commerce event: `"view_item_list"` in the data attribute `data-analytics` for product impressions
* the event action should reflect the (I use the GA4 naming convention for e-commerce here) e-commerce event: `"select_item"` in the data attribute `data-analytics` for product impression clicks

The following parameters are mandatory in the data attribute `data-analytics`:

| parameter name  | type | description |  required |
| ----- | ----- | ----- | ----- |
| `product_id`   | string  | the sku or id of the product on the product detail page| yes |
| `product_name` | string  | the name of the product on the product detail page| yes |
| `product_price` | number  | the price of the product on the product detail page| yes |
| `list_name` | string  | the name of the product list on a page | yes |
| `position` | number  | the position of the product in the list | yes |
| `event_name` | string  | the name of the event = `"view_item_list"` | yes |
| `event_action` | string  | the name of the event = `"select_item"` | yes |

The following parameters are optional:

| parameter name  | type | description |  required |
| ----- | ----- | ----- | ----- |
| `product_brand` | string  | the brand of the product on the product detail page| no, but desired |
| `product_category` | string  | the category of the product on the product detail page| no, but desired |
| `product_variant` | string  | the variant of the product on the product detail page| no |
| `product_in_stock` | boolean  | is the product in stock on the product detail page| no (*) |
##### Documentation
* Documentation for [Measuring Product Impressions](https://developers.google.com/analytics/devguides/collection/ua/gtm/enhanced-ecommerce#product-impressions) in Google Universal Analytics

#### Product Impression Click
A product impression click is a click on one of the product impressions of the product list. The product impression click will result in a landing on a product detail page.

* Nothing extra is needed for the implementation

The following parameters are mandatory in the data attribute `data-analytics`, but is already set in the `"view-items-list"` data attribute:

| parameter name  | type | description |  required |
| ----- | ----- | ----- | ----- |
| `product_id`   | string  | the sku or id of the product on the product detail page| yes |
| `product_name` | string  | the name of the product on the product detail page| yes |
| `product_price` | number  | the price of the product on the product detail page| yes |
| `list_name` | string  | the name of the product list on a page | yes |
| `position` | number  | the position of the product in the list | yes |
| `event_name` | string  | the name of the event = `"view_item_list"` | yes |
| `event_action` | string  | the name of the event = `"select_item"` | yes |

The following parameters are optional:

| parameter name  | type | description |  required |
| ----- | ----- | ----- | ----- |
| `product_brand` | string  | the brand of the product on the product detail page| no, but desired |
| `product_category` | string  | the category of the product on the product detail page| no, but desired |
| `product_variant` | string  | the variant of the product on the product detail page| no |
| `product_in_stock` | boolean  | is the product in stock on the product detail page| no (*) |

##### Documentation
* Documentation for [Measuring Product Clicks](https://developers.google.com/analytics/devguides/collection/ua/gtm/enhanced-ecommerce#product-clicks) in Google Universal Analytics
#### Product Detail pages
A product detail page is a page which describes the product as well as displays product images and has the possibility to add the product to the cart.

* the event name should reflect the e-commerce event: `"view_item"` in the data attribute `data-analytics-eventname` for product detail views.  
* add the data attribute `data-analytics` with all your product details as follows in a `<div></div>` html tag for example:

``` html
<div id='analytics' data-analytics="{"product_id":"123456789","product_name":"middleware beta","product_variant":"version 0.9","product_category":analytics,"product_brand":"seolytics","product_price":99.50,"product_in_stock": true, "product_ratings_avg": 4.5}"</div>
```

The following parameters are mandatory in the data attribute `data-analytics`:

| parameter name  | type | description |  required |
| ----- | ----- | ----- | ----- |
| `product_id`   | string  | the sku or id of the product on the product detail page| yes |
| `product_name` | string  | the name of the product on the product detail page| yes |
| `product_price` | number  | the price of the product on the product detail page| yes |

The following parameters are optional:

| parameter name  | type | description |  required |
| ----- | ----- | ----- | ----- |
| `product_brand` | string  | the brand of the product on the product detail page| no, but desired |
| `product_category` | string  | the category of the product on the product detail page| no, but desired |
| `product_variant` | string  | the variant of the product on the product detail page| no |
| `product_in_stock` | boolean  | is the product in stock on the product detail page| no (*) |

##### Documentation
* Documentation for [Measuring Views of Product Details](https://developers.google.com/analytics/devguides/collection/ua/gtm/enhanced-ecommerce#details) in Google Universal Analytics
#### Notes
(*) Parameters like `product_in_stock` are product scoped parameters and can be interesting to have as data available in reporting in Google Analytics.