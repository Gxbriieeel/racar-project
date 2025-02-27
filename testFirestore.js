import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

async function obtenerProductos() {
  const querySnapshot = await getDocs(collection(db, "productos"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

obtenerProductos();
