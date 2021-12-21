// Set the version of the Middleware Analytics script
 var version_middleware = window.version_middleware;
// Set the environment
var environment = (document.location.hostname === "localhost") ? "dev" : "prod";
// Set the listname
var list = _list_name;
var loc = window.location.pathname;
var second_part_listname = loc.replace(/\//g, "#");
var list_name = list + second_part_listname
var list_id = _current_week_number || _list_id;

// Avo
!function(){var t=window.inspector=window.inspector||[];t.methods=["trackSchemaFromEvent","trackSchema","setBatchSize","setBatchFlushSeconds"],t.factory=function(e){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(e),t.push(r),t}};for(var e=0;e<t.methods.length;e++){var r=t.methods[e];t[r]=t.factory(r)}t.load=function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://cdn.avo.app/inspector/inspector-v1.min.js";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)},t._scriptVersion=1}();
inspector.__API_KEY__ = "bSxiHkugGILERgAKD5vv";
inspector.__ENV__ = environment;
inspector.__VERSION__ = version_middleware;
inspector.__APP_NAME__ = "byrgeleeuwangh"; 
inspector.load();

document.addEventListener("DOMContentLoaded", function() {
    
    // theme color
    var themeColor = localStorage.getItem("pref-theme") || undefined;
    
    // performance
    function nav_timing_data() {
      // Use getEntriesByType() to just get the "navigation" events
      var perfEntries = performance.getEntriesByType("navigation");
    
      for (var i=0; i < perfEntries.length; i++) {
        var p = perfEntries[i];
        navigation_type = p.type;
        redirectCount = p.redirectCount;
      }
    }
    nav_timing_data()

    // Git info
    if (window.__data_git) {
    git_info = {
        "abbreviatedHash": window.__data_git.abbreviatedHash,
        "hash": window.__data_git.hash,
        "commitDate": window.__data_git.commitDate,
        "subject": window.__data_git.subject
      }
    }

    // push to datalayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'nav_timing_data',
      'theme_color_user': themeColor || 'auto',
      'page': {
        'navigation_type': navigation_type,
        'redirectCount': redirectCount,
        'cookies': cookieObj,
        'viewport': getViewportSize(),
        'git': git_info
      }
    })

    /////// events
    var events_array, analytics_events_arr = [];
    events_array = document.querySelectorAll('[data-analytics-event]');

    for (var i in events_array) if (events_array.hasOwnProperty(i)) {
      var data = (events_array[i].getAttribute('data-analytics-event'));
      var eventJSON = JSON.parse(data);
      analytics_events_arr.push(eventJSON);
    }

    var events = analytics_events_arr.map(item =>{
      var rItem = {};
      rItem = {
          event_name: item[0],
          event_location: item[3],
          event_url: item[4],
          event_startdate: item[1],
      };
      return rItem;
    });
    if(events && events.length) {
      dataLayer.push({
        event: 'upcoming event',
        page_path: window.location.pathname,
        events
      });
    }

    /////// blog posts
    var logging_arr = [];
    logging_arr = document.querySelectorAll('[data-analytics]');
    var analytics_blogposts = [];

    for (var i in logging_arr) if (logging_arr.hasOwnProperty(i)) {
      var data = (logging_arr[i].getAttribute('data-analytics'));
      var blogpostJSON = JSON.parse(data);
      analytics_blogposts.push(blogpostJSON);
    }

    ////////
    // function to translate GA4 to Google Universal Analytics
    var ecommerce_translation = [];
    var ecommerce = [];
    function toUniversalAnalytics(items, eventName, price) {
      impressions = items.map(items => {
          return removeEmpty({
              name: items.item_name,
              brand: items.item_brand,
              id: items.item_id,
              price: items.price,
              category: items.item_category,
              variant: items.item_category2,
              position: items.index,
              list: items.item_list_name,
              quantity: 1
          });
      });
      if(eventName === 'view_item_list') {
        return ecommerce = {
          'value': parseInt(price),
          'currencyCode': 'EUR',
          impressions,
          'items': items
        };
      }
      if(eventName === 'view_item') {
        return ecommerce = {
          'value': parseInt(price),
          'detail': {
            'products': impressions,
            'actionField': {}
          },
          'items': items
        };
      }
      if(eventName === 'select_item') {
        return ecommerce = {
          'value': parseInt(price),
          'click': {
            'products': impressions,
            'actionField': {'list': list_name}
          },
          'items': items
        };
      }
      if(eventName === 'add_to_cart') {
        return ecommerce = {
          'value': parseInt(price),
          'currencyCode': 'EUR',
          'add': {'products': impressions},
          'items': items
        };
      }
    }


    ///////
    // Observer for blog post impressions
    ///////
    var items = [];
    var analyticsData, eventName, index, offsetTop
    function analyticsEvent(analyticsData, eventName, index){
      var ecommerce_items = [];
      items = [];
      var promotions = [];
      var impressions = [];
      // var products = [];
      var promotion_data
      // var impression_data
      // var product_data
      if(eventName === 'view_promotion' || eventName === 'select_promotion') {
        ecommerce_items = removeEmpty({
          'promotion_id': analyticsData.ISOWeek,
          'promotion_name': analyticsData.name,
          'creative_name': analyticsData.publishDate + '|' + analyticsData.expiryDate,
          'creative_slot': 'top - '+offsetTop,
          'location_id': window.location.pathname,
          'index': index
        });
        promotion_data = removeEmpty({
          'name': analyticsData.name,
          'creative': window.location.pathname,
          'position': 'top - '+offsetTop,
          'id': analyticsData.ISOWeek
        })
      }
      if(eventName === 'view_item_list' || eventName === 'select_item') {
        var price = parseInt(words);
        if(analyticsData && analyticsData.tags) {
          var item_category = analyticsData.tags[0]
          var item_category2 = analyticsData.tags[1]
          var item_category3 = analyticsData.tags[2]
          var item_category4 = analyticsData.tags[3] 
        }
        ecommerce_items = removeEmpty({
            'item_id': analyticsData.page_id,
            'item_name': analyticsData.title,
            item_category,
            item_category2,
            item_category3,
            item_category4,
            'item_variant': themeColor || 'auto',
            'item_brand': analyticsData.author,
            'item_list_name': list_name,
            'item_list_id': list_id,
            price,
            'index': index || undefined
          });
      }
      if(eventName === 'view_item' || eventName === 'add_to_cart') {
        var price = parseInt(words);
        if(analyticsData && analyticsData.tags) {
          var item_category = analyticsData.tags[0]
          var item_category2 = analyticsData.tags[1]
          var item_category3 = analyticsData.tags[2]
          var item_category4 = analyticsData.tags[3] 
        }
        ecommerce_items = removeEmpty({
            'item_id': analyticsData.page_id,
            'item_name': analyticsData.title,
            'item_category': item_category,
            'item_category2': item_category2,
            'item_category3': item_category3,
            'item_category4': item_category4,
            'item_variant': themeColor || 'auto',
            'item_brand': analyticsData.author,
            price,
            'quantity': 1
          });
      }
      items.push(ecommerce_items);
      promotions.push(promotion_data);
      return items     
    }

    // Click Listener
    document.addEventListener('click', function (event) {
      if (event.target.hasAttribute('data-analytics-action')) {
          var dataset = event.target.dataset;
          var analyticsData = event.target.dataset.analytics;

          if(!analyticsData) {
            var elem = document.getElementById('analytics');
            analyticsData = elem.getAttribute('data-analytics');
          }

          analyticsData = JSON.parse(analyticsData);
          index = parseInt(event.target.dataset.analyticsListindex) +1;
          words = event.target.dataset.analyticsWords;
          eventName = event.target.dataset.analyticsEventname;
          eventAction = event.target.dataset.analyticsAction;
          eventName = 'select_item';

          analyticsEvent(analyticsData, eventName, index);
          customLog(analyticsData.event + ' click – ' + eventAction + "\ntitle : " + analyticsData.title , 'success')      
          toUniversalAnalytics(items, eventName, words)

          switch (eventAction) {
            case 'open_toc':
              var send_event = ({
                "event": eventAction,
                "url": window.location.href,
                "page_id": analyticsData.page_id,
                "page_title": analyticsData.title
              });
              break;
            default:
              var send_event = ({
                "event": eventAction,
                "url": window.location.href,
                "page_id": analyticsData.page_id,
                "test": "test",
                ecommerce,
                analyticsData
              });
            // Avo trackSchemaFromEvent
              inspector.trackSchemaFromEvent(eventAction, {
                'event': eventAction,
                "url": window.location.href,
                "page_id": analyticsData.page_id,
                "ecommerce": items
              });
          }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(send_event);
      }
    });

    // IntersectionObserver
    if ('IntersectionObserver' in window) {
      let config = {
        //root: null,
        rootMargin: '10px',
        threshold: 0.8
      };

    let observer = new IntersectionObserver(function (entries, self) {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.dataset.analytics) {
            analyticsData = JSON.parse(entry.target.dataset.analytics);
            
            customLog(analyticsData.event + ' in viewport – ' + entry.target.dataset.analyticsEventname + "\ntitle : " + analyticsData.title , 'success')
            // get offset from top 
            var article = document.getElementById('promotion') || undefined;
            if (article) {
              var rect = article.getBoundingClientRect();
              offsetTop = window.pageYOffset + rect.top - rect.height;
            }
            //
            eventName = entry.target.dataset.analyticsEventname;
            words = entry.target.dataset.analyticsWords;
            index = parseInt(entry.target.dataset.analyticsListindex) +1;
            
            analyticsEvent(analyticsData, eventName, index, offsetTop);
            toUniversalAnalytics(items, eventName, words)

            window.dataLayer = window.dataLayer || [];
            var send_event = {
              "event": entry.target.dataset.analyticsEventname,
              "event_name": "impression_"+analyticsData.event,
              "url": window.location.href,
              "page_id": analyticsData.page_id,
              ecommerce,
              analyticsData
            };
          window.dataLayer.push(send_event);

          // Avo trackSchemaFromEvent
          inspector.trackSchemaFromEvent(eventName, {
            "event": eventName,
            "url": window.location.href,
            "page_id": analyticsData.page_id,
            "ecommerce": items
          });
          self.unobserve(entry.target);
        }
      });
    }, config);

    logging_arr.forEach(content => observer.observe(content)); // watch blog posts, events and sponsors
    } 
  }, false);

////
// Custom Logging
//// emoji https://emojipedia.org/emoji/
function customLog(message, color='black') {
  var logType = 'log';
  switch (color) {
      case 'success':  
          color = 'color: green';	
          emoji = String.fromCodePoint(0x1F44F);
          break
      case 'info':     
          color = 'background: #bc5090; color: white; padding: 2px 4px; border-radius: 4px 4px 4px 4px;';
          emoji = String.fromCodePoint(0x1F44D);
          logType = 'info';
          break;
      case 'validation':     
          color = 'background: #21e5d7; color: black; padding: 2px 4px; border-radius: 4px 4px 4px 4px;';
          logType = 'info';
          break;
      case 'notification':     
          color = 'background: #eee; color: black; padding: 2px 4px; border-radius: 4px 4px 4px 4px;';
          logType = 'info';
          break;
      case 'error':   
          color = 'background: #ff6361; color: white; padding: 2px 4px; border-radius: 4px 4px 4px 4px;'; 
          logType = 'error';
          break;
      case 'warning':  
          color = 'background: #D93B38; color: white; padding: 2px 4px; border-radius: 4px 4px 4px 4px;';
          emoji = String.fromCodePoint(0x26A0);
          logType = 'warn';
          break;
      case 'productinfo':  
          color = 'background: #ffa600; color: black; padding: 2px 4px; border-radius: 4px 4px 4px 4px;';
          logType = 'info';
          break;
      case 'start':  
          color = 'background: #ffa600; color: black; padding: 2px 4px; border-radius: 4px 4px 4px 4px;';
          emoji = String.fromCodePoint(0x1F44C);
          logType = 'info';
          break;
          
      default: 
          color = color
      }

  var debug_status = localStorage.getItem('debug_status');
  if(debug_status) {
    console[logType](`${emoji}` + " " + `%c${message}`, `${color}`);
  }
}

  ////////////////////
  // Web Vitals performance
  ////////////////////
  function sendToGTM(name, delta, id) {
    dataLayer.push({
      event: 'web-vitals',
      web_vitals: name
    });
  }
  window.addEventListener('load', (event) => {
    webVitals.getCLS(sendToGTM);
    webVitals.getFID(sendToGTM);
    webVitals.getLCP(sendToGTM);
  });
