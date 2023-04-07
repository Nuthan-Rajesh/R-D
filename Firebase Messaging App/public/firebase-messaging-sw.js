importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBs8JGVIvvcH-Zs1ErWzHf72baJG2Al2UE",
  authDomain: "signal-3aeeb.firebaseapp.com",
  projectId: "signal-3aeeb",
  storageBucket: "signal-3aeeb.appspot.com",
  messagingSenderId: "667035288100",
  appId: "1:667035288100:web:94254d1ab7ff074f0f4eb1",
  measurementId: "G-Q3Q22RNX9B"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
