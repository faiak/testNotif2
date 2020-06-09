/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import firebase, { Notification } from 'react-native-firebase'
var PushNotification = require("react-native-push-notification");
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



type Props = {};
export default class App extends Component<Props> {

  componentDidMount = async () => {
    console.log("testtt");


    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });


    const fcmToken = await firebase.messaging().getToken();
    console.log(fcmToken)
    if (fcmToken) {
      // user has a device token
    } else {
      // user doesn't have a device token yet
    }

    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log("USER ALREADY HAVE PERMISSION")
      // user has permissions
    } else {
      // user doesn't have permission
      console.log("USER DONT HAVE PERMISSION")
      try {
        console.log("TRY TO REQUEST PERMISSION")
        await firebase.messaging().requestPermission();
        // User has authorised
      } catch (error) {
        // User has rejected permissions
      }
    }

    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      console.log("MENERIMA NOTIF", notification)
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });


    const channel = new firebase.notifications.Android.Channel(
      'channelId',
      'Channel Name',
      firebase.notifications.Android.Importance.Max
    ).setDescription('A natural description of the channel');
    firebase.notifications().android.createChannel(channel);


    this.removeNotificationListener = firebase.notifications().onNotification((notification: Notification) => {

      const localNotification = new firebase.notifications.Notification({
        sound: 'default',
        show_in_foreground: true,
      })
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body)
        .setData(notification.data)
        .android.setChannelId('channelId') // e.g. the id you chose above
        // .android.setSmallIcon('ic_stat_notification') // create this icon in Android Studio
        .android.setColor('#000000') // you can set a color here
        .android.setPriority(firebase.notifications.Android.Priority.High);

      firebase.notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));

      // const ntf = new firebase.notifications.Notification()
      //   .setNotificationId('notificationId')
      //   .setTitle('My notification title')
      //   .setBody('My notification body')
      //   .setData({
      //     key1: 'value1',
      //     key2: 'value2',
      //   });

      // ntf
      //   .android.setChannelId('channelId')
      //   .android.setSmallIcon('ic_launcher');

      // ntf
      //   .ios.setBadge(2);

      // firebase.notifications().displayNotification(ntf);

      console.log("MENERIMA NOTIF 222 ", notification)

      // Process your notification as required
    });

  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
