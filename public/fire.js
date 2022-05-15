/* 
Kevin Barra Morales 
Proyecto Final Frambu 
16 de mayo de 2022
*/

// Import the functions you need from the SDKs you need
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  where,
  query,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADu5nNoZgZN5axPiUQ2jLbvPRzxpuH5is",
  authDomain: "proyecto-kevinbarra.firebaseapp.com",
  projectId: "proyecto-kevinbarra",
  storageBucket: "proyecto-kevinbarra.appspot.com",
  messagingSenderId: "908647469582",
  appId: "1:908647469582:web:f5b140b01ea835e768625f",
  measurementId: "G-K1B4D78V00",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const ordenesPendientes = query(
  collection(db, "orders"),
  where("completado", "==", false)
);

export const ordenesPendientesCantidad = getDocs(ordenesPendientes);

const ordenesCompletadas = query(
  collection(db, "orders"),
  where("completado", "==", true)
);

export const ordenesCompletadasCantidad = getDocs(ordenesCompletadas);

/**
 * Save a New order in Firestore
 * @param {string} cliente the cliente of the order
 * @param {string} cantidad the cantidad of the order
 */
export const guardar_orden = (cliente, cantidad, fecha) =>
  addDoc(collection(db, "orders"), {
    cliente,
    cantidad,
    fecha,
    completado: false,
  });

export const escuchar_ordenes = (callback) =>
  onSnapshot(ordenesPendientes, callback);

/**
 *
 * @param {string} id order ID
 */
export const delete_orden = (id) => deleteDoc(doc(db, "orders", id));

export const get_orden = (id) => getDoc(doc(db, "orders", id));

export const update_orden = (id, newFields) =>
  updateDoc(doc(db, "orders", id), newFields);

export const get_ordens = () => getDocs(collection(db, "orders"));