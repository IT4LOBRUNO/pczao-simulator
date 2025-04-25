// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC9gNUzpIvZWzzLrM9o4nx9c9r9PFU3UBE",
  authDomain: "pczao-simulator.firebaseapp.com",
  projectId: "pczao-simulator",
  storageBucket: "pczao-simulator.appspot.com",
  messagingSenderId: "206421728344",
  appId: "1:206421728344:web:73c5d9073441d0a57c3e2d"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao Firestore
const db = firebase.firestore();