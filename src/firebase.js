// src/firebase.js

import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  getDocs  // ← ADDED: Missing for ExamsPage.js
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbtO_W7WX8qC91kKmDF1tt-Ocup2AT6OU",
  authDomain: "trackly4.firebaseapp.com",
  projectId: "trackly4",
  storageBucket: "trackly4.firebasestorage.app",
  messagingSenderId: "62674305404",
  appId: "1:62674305404:web:cb6a0a3788613f670564f9",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  getDoc, 
  setDoc,
  getDocs, // ← ADDED: Now available for getDoc(examRef)
};
