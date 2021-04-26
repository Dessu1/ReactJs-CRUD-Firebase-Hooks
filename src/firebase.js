import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHErV9SsBoCq11kxLKixMzRdZ_41f-p84",
  authDomain: "todo-app-372e0.firebaseapp.com",
  projectId: "todo-app-372e0",
  storageBucket: "todo-app-372e0.appspot.com",
  messagingSenderId: "290822386971",
  appId: "1:290822386971:web:ce8b19551752a54c974fbe",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export { firebase };
