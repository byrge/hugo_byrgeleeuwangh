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
You can see here that this is understandable and probably easy to do. The analytics tagging API will use these data attributes `data-analytics` to collect the data and send them to the event which belongs to the event mentioned in `data-analytics-eventname`.

The data attributes together with the analytics tagging API create the network request:  

```
en=page_view&epn.iso_week=51&ep.day_long=Monday&ep.theme_color=auto&ep.hugo_version=0.90.1&ep.page_type=page&ep.month_published=12&ep.year_published=2021&epn.reading_time=3&epn.words=608&ep.environment=dev&up.ga_cookie=GA1.1.415183184.1638542841&up.ga_cookie_original=GS1.1.1640008161.32.1.1640014689.0
en=view_item&pr1=idbd074fc7199790f7c06b80c1ca6f60dd~nmAnalytics%20API%20-%20basic%20setup~camiddleware~c2~vaauto~brByrge%20Leeuwangh~pr608~qt1&ep.content_group=page&epn.value=608&ep.page_type=page
``` 

for Google Analytics 4. 

Another advantage is that the (front-end) developer doesn't have to worry about things like the product impression `view`, `click`, product impressions `list name`, which are specific implementation details for Google Universal Analytics or Google Analytics 4.  
Normally for product impressions you need to build your own logic to only send those product impressions to Google Analytics when seen by the visitor (aka in viewport). The advantage of the tagging API is that this logic is done by the API and of no concern for the (front-end) developer anymore.

### Setup
The setup and implementation can be very simple versus a full blown implemention you have to do yourself. Except for the analytics knowledge to send the event with all the parameters you have to send them on the correct moment.

The analytics tagging API will help here. All the analytics knowledge is integrated as are the correct moments. You have to load the analytics tagging API script as high as possible in your `head` of the template.

### Implementation
To start your implementation you should take the next steps:  
* load the analytics tagging API script as high as possible in your `head` of the template
* create the correct data analytics attributes on your templates

#### Category Overview pages
* the event name should reflect the (I use the GA4 naming convention for e-commerce here) e-commerce event: `data-analytics-eventname="view_item_list"` for product impressions

#### Product Detail pages
* the event name should reflect the (I use the GA4 naming convention for e-commerce here) e-commerce event: `data-analytics-eventname="view_item"` for product detail views