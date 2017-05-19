#  Mobile Foundation - Ionic Mobile App

We will be going to see how to integrate MobileFirst Foundation adapters with our Ionic app.

# Guide

## Add the Android Platform

The first thing you will need to do is go to the correct folder where the app is located

  ```bash
  cd MFP8.0Wallet/hybridWalletCordova/
  ```

  Next you need to add the android platform.

  ```bash
  cordova platform add android
  ```
  
  ## Adding the MobileFirst Cordova SDK

  The MobileFirst Cordova SDK is provided as a set of Cordova plug-ins and can be installed by running:

  ```bash
  cordova plugin add cordova-plugin-mfp
  ```
  
  ## Register your app with your MobileFirst Server

  Make sure that your MFP server is running and enter the command below to register the app.

  ```bash
  mfpdev app register bluemix-server
  cordova prepare
  ```

  Open your MobileFirst Console and confirm that your app has been registered.
  
  
## Build and run the app

  Build the Android platform. You will need to do this every time you make a change in the app.

  ```bash
  cordova build
  cordova emulate android
  ```


