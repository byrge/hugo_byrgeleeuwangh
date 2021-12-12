---
title: "Debug your app with a proxy"
date: 2021-01-10T21:05:59+01:00
page_id: 58272c88b063be4ea0bef5fa4df767f4
showtoc: true
tocOpen: false
pagetype: "blogpost" 
aliases: ["/debug-your-app-analytics"]
tags: ["app", "analytics", "proxy"]
keywords: ["app","proxy","debug"]
author: "Byrge Leeuwangh"
draft: false
---

# Debugging your app analytics with a proxy

Debugging your app is notoriously difficult and way more complex than the web counterpart, but there are possibilities. 

You can run local virtual devices if you have access to the source code or to install files as an IPA (iOS) or APK (Android) file. When running a local device you can use the console of XCode or Android Studio to debug your app.

At the moment you don't have access to source code or install files, your only option is to use a proxy. There are multiple proxies to choose from, but I'm using the open source "Men in the Middle" ([MITM](https://mitmproxy.org/)) proxy.

## Install MITM on iOS / MacOS
You need to install the [proxy](https://mitmproxy.org/) via the terminal, but no worries. There is also a Web Interface after installation to monitor your app traffic.

So, follow the next steps for the first time installation of the proxy:

1. Check the [proxy](https://mitmproxy.org/) documentation
2. Install via your terminal `brew install mitmproxy`. You'll need [Homebrew](https://brew.sh/) on your Mac
3. Start your proxy with the command: `mitmweb` in your terminal
4. Open your OS X settings panel and go to `sharing`
5. In `sharing` activate internet sharing and share your connection via LAN on your WiFi
6. Open `network` in your OS X settings panel and note your IP address
7. Go to your mobile device and find and connect to your shared WiFi network (Computer Name in your OS X settings panel)
8. When your mobile device is connected to your Mac shared WiFi network edit your proxy settings. For `Server` you need to add your IP address of step 6. The `port` should be `8080`
9. Now visit with your mobile device web browser to [mitm.it](https://mitm.it) and click to install the correct SSL certificate
10. After installation of your certificate you still have to enable the certificate on your iPhone. To verify go to `Settings` → `General` → `Profile` (iOS 11) and `Settings` → `General` → `Device Management` on iOS 9 and above devices
11. Next step is to turn on the toggle button to trust the mitm root certificate: `Settings` → `General` → `About` → `Certificate Trust Settings` (iOS 10 and above devices) 
12. Now you are able to open your app and you should see your requests coming from your app in the web interface of the MITM proxy

  
Find your ip address –_to use in step 8_– in your MacOS network settings:  

{{< img src="images/macos_settings-network.png" alt="macOS network settings" >}}


### Start MITM web via the terminal  

{{< img src="images/mitm-terminal.png" alt="Start MITM web via the terminal" >}}

## Install MITM on Android / MacOS
You need to install the [proxy](https://mitmproxy.org/) via the terminal, but no worries. There is also a Web Interface after installation to monitor your app traffic.

So, follow the next steps for the first time installation of the proxy:

The first [1-9] steps are identical as the steps above for iOS/ MacOS. The next steps are specific for Android:

1. After installation of your certificate you still have to enable the certificate on your Android device. Navigate to `Settings` → `WiFi`. Long press on network name and tap on Modify network
1. Now you have to change the Proxy Settings. Tap on Show Advance options and you’ll find Host Name, Port. Use the same information as we did when setting up the iPhone
1. Open your favorite browser (e.g. Chrome) on your Android device and go to the address:  mitm.it. This is similar to what we did on Safari while setting up the iPhone
1. Last step is to _Open the certificate_
1. Now you are able to open your app and you should see your requests coming from your app in the web interface of the MITM proxy

## Run your MITM proxy (after installation)
Next time when you have the need to debug your app, it's easier to start and less steps are needed:

1. Start your proxy with the command: `mitmweb` in your terminal
1. Open your OS X settings panel and go to `sharing`
1. In `sharing` activate internet sharing and share your connection via LAN on your WiFi
1. On your iPhone go to: `Settings` →  `General` →  `About` → `Certificate Trust Settings`. Under "Enable full trust for root certificates," turn __on__ trust for the 'mitmproxy' certificate
1. Go to your mobile device and connect to your shared WiFi network (Computer Name in your OS X settings panel)
1. Now you are able to open your app and you should see your requests coming from your app in the web interface of the MITM proxy

### Internet sharing on MacOS
Start your own WiFi network by enabling `Internet Sharing` on your Mac.  

{{< img src="images/macos_settings_sharing.png" alt="macOS settings sharing internet" >}}

### MITM web interface
In the MITM web interface you can **color** the requests for easier debugging. Click on the left hand on the request you want to analyze and see your (batched) request data on your right:

{{< img src="images/mitm-web.png" alt="MITM web interface" >}}

## Done testing?
When you are done with testing, don't forget to disable the certificate on your mobile device! This is important for security reasons.

* On your iPhone go to: `Settings` →  `General` →  `About` → `Certificate Trust Settings`. Under "Enable full trust for root certificates," turn off trust for the 'mitmproxy' certificate.  

{{< img src="images/ios_certificate_trust.png" alt="iOS trust the certificate" >}}

* In your terminal stop **mitmweb** with `CONTROL - C`
* Disable `Internet Sharing` on your Mac