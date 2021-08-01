import firebase from 'firebase'
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyC0d4O2zfYgqE5sjF_k7AxrQPbkFmwzbr4",
    authDomain: "jh-timeline.firebaseapp.com",
    projectId: "jh-timeline",
    storageBucket: "jh-timeline.appspot.com",
    messagingSenderId: "743619172964",
    appId: "1:743619172964:web:1db5f9aa110d4ea0055d71",
    measurementId: "G-2XF5W3X886"
  };
  firebase.initializeApp(firebaseConfig);
export default firebase
