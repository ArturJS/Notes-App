require([
  'firebase'
], function(firebase) {
  'use strict';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC6LDuww70ztN7YfscpvEHrkJteSdvPco8",
    authDomain: "angulartodo-561d2.firebaseapp.com",
    databaseURL: "https://angulartodo-561d2.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "956700524818"
  };
  firebase.initializeApp(config);
});
