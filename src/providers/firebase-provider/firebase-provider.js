import firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyC6LDuww70ztN7YfscpvEHrkJteSdvPco8',
    authDomain: 'angulartodo-561d2.firebaseapp.com',
    databaseURL: 'https://angulartodo-561d2.firebaseio.com',
    storageBucket: 'gs://angulartodo-561d2.appspot.com/',
    messagingSenderId: '956700524818'
};

const googleProvider = new firebase.auth.GoogleAuthProvider();
const firebaseProvider = {
    app: firebase.initializeApp(config),
    auth: firebase.auth(),
    database: firebase.database(),
    storage: firebase.storage(),
    getCurrentUserData: () =>
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}`),
    isLoggedIn: () => !!firebase.auth().currentUser,
    login: () => firebase.auth().signInWithPopup(googleProvider),
    logout: () => firebase.auth().signOut()
};

export default firebaseProvider;
