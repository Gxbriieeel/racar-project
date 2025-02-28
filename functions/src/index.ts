import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// ========================FUNCIONES DE PRODUCTOS===============================

// 🔹 Función para obtener todos los productos
export const getAllProducts = onRequest(async (req, res): Promise<void> => {
  try {
    const productsSnapshot = await db.collection("productos").get();

    if (productsSnapshot.empty) {
      res.status(200).json([]);
      return;
    }

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error obteniendo todos los productos:", error);
    res.status(500).json({error: "Error al obtener productos"});
  }
});

// 🔹 Función para obtener productos por nombre
export const getProductsByName = onRequest(async (req, res): Promise<void> => {
  try {
    const productName = req.query.name as string;
    if (!productName) {
      res.status(400).json({error: "Falta el nombre del producto"});
      return;
    }

    const productsSnapshot = await db.collection("productos")
      .where("nombre", "==", productName)
      .get();

    if (productsSnapshot.empty) {
      res.status(404).json({error: "No se encontraron productos con ese nombre"});
      return;
    }

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error obteniendo productos por nombre:", error);
    res.status(500).json({error: "Error al obtener productos"});
  }
});

// 🔹 Función para obtener un producto por ID
export const getProduct = onRequest(async (req, res): Promise<void> => {
  try {
    const productId = req.query.id as string;
    if (!productId) {
      res.status(400).json({error: "Falta el ID del producto"});
      return;
    }

    const productDoc = await db.collection("productos").doc(productId).get();
    if (!productDoc.exists) {
      res.status(404).json({error: "Producto no encontrado"});
      return;
    }

    res.status(200).json({id: productDoc.id, ...productDoc.data()});
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    res.status(500).json({error: "Error al obtener producto"});
  }
});

// 🔹 Función para obtener productos por marca (FILTRO)
export const getProductsByBrand = onRequest(async (req, res): Promise<void> => {
  try {
    const brandSlug = req.query.brand as string;
    if (!brandSlug) {
      res.status(400).json({error: "Falta el slug de la marca"});
      return;
    }

    // Buscar el documento en la colección marca por el slug
    const brandSnapshot = await db.collection("marca")
      .where("slug", "==", brandSlug)
      .get();

    if (brandSnapshot.empty) {
      res.status(404).json({error: "Marca no encontrada"});
      return;
    }

    // Obtener la referencia del primer documento encontrado
    const brandRef = brandSnapshot.docs[0].ref;

    // Buscar productos que tengan esta referencia en marca
    const productsSnapshot = await db.collection("productos")
      .where("marca", "==", brandRef)
      .get();

    if (productsSnapshot.empty) {
      res.status(404).json({error: "No se encontraron productos de esta marca"});
      return;
    }

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error obteniendo productos por marca:", error);
    res.status(500).json({error: "Error al obtener productos"});
  }
});


// 🔹 Función para obtener productos por modelo (FILTRO)
export const getProductsByModel = onRequest(async (req, res): Promise<void> => {
  try {
    const modelSlug = req.query.model as string;
    if (!modelSlug) {
      res.status(400).json({error: "Falta el slug del modelo"});
      return;
    }

    // Buscar el documento en la colección modelo por el slug
    const modelSnapshot = await db.collection("modelo")
      .where("slug", "==", modelSlug)
      .get();

    if (modelSnapshot.empty) {
      res.status(404).json({error: "Modelo no encontrado"});
      return;
    }

    // Obtener la referencia del primer documento encontrado
    const modelRef = modelSnapshot.docs[0].ref;

    // Buscar productos que tengan esta referencia en modelo
    const productsSnapshot = await db.collection("productos")
      .where("modelo", "==", modelRef)
      .get();

    if (productsSnapshot.empty) {
      res.status(404).json({error: "No se encontraron productos de este modelo"});
      return;
    }

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error obteniendo productos por modelo:", error);
    res.status(500).json({error: "Error al obtener productos"});
  }
});

// 🔹 Función para obtener productos por tipo de producto (USANDO "SLUG")
export const getProductsByType = onRequest(async (req, res): Promise<void> => {
  try {
    const tipoProductoSlug = req.query.tipo as string;
    if (!tipoProductoSlug) {
      res.status(400).json({error: "Falta el slug del tipo de producto"});
      return;
    }

    // Buscar el documento en la colección tipo_producto por el slug
    const tipoProductoSnapshot = await db.collection("tipo_producto")
      .where("slug", "==", tipoProductoSlug)
      .get();

    if (tipoProductoSnapshot.empty) {
      res.status(404).json({error: "Tipo de producto no encontrado"});
      return;
    }

    // Obtener la referencia del primer documento encontrado
    const tipoProductoRef = tipoProductoSnapshot.docs[0].ref; // ✅ Usar la referencia directa

    // Buscar productos que tengan esta referencia en tipoProducto
    const productsSnapshot = await db.collection("productos")
      .where("tipoProducto", "==", tipoProductoRef) // ✅ Comparar como referencia
      .get();

    if (productsSnapshot.empty) {
      res.status(404).json({error: "No se encontraron productos de este tipo"});
      return;
    }

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error obteniendo productos por tipo de producto:", error);
    res.status(500).json({error: "Error al obtener productos"});
  }
});


// =========================FUNCIÓN COMENTARIOS=============================

// 🔹 Función para registrar comentarios de usuarios
export const addComment = onRequest(async (req, res): Promise<void> => {
  try {
    const {nombreUsuario, apellidoUsuario, correoUsuario, comentario} = req.body;

    // 🔹 Validaciones básicas
    if (!nombreUsuario || !apellidoUsuario || !correoUsuario || !comentario) {
      res.status(400).json({error: "Todos los campos son obligatorios"});
      return;
    }

    // 🔹 Agregar el comentario a Firestore con un timestamp
    const newComment = {
      nombreUsuario,
      apellidoUsuario,
      correoUsuario,
      comentario,
      fecha: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("comentarios").add(newComment);

    res.status(200).json({message: "Comentario agregado correctamente"});
  } catch (error) {
    console.error("Error agregando comentario:", error);
    res.status(500).json({error: "Error al agregar el comentario"});
  }
});

// 🔹 Función para obtener todos los comentarios
export const getAllComments = onRequest(async (req, res): Promise<void> => {
  try {
    const commentsSnapshot = await db
      .collection("comentarios")
      .orderBy("fecha", "desc") // 🔹 Ordenar por fecha (más recientes primero)
      .get();

    if (commentsSnapshot.empty) {
      res.status(200).json([]);
      return;
    }

    const comments = commentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error obteniendo comentarios:", error);
    res.status(500).json({error: "Error al obtener comentarios"});
  }
});


// Tengo más opciones, baby, tú no eres la única
// Ahora hay más mujeres y eso es gracias a la música
// Dice que a lo de nosotros le dió muerte súbita
// Es a otra mujer a la que se lo voy a lubricar
// Se van hasta tus amigas también
// Puedes decir que por otra te cambié
// La lista de la' baby' la agrandé
// Nos separamos como Wisin y Yandel
// Aunque de vez en cuando quiere volver
// Encontré otra mujer a responder
// Y cuando quieras prender, o te quieras perder
// A los lugares donde has visto por internet
// Tú me buscas o te busco
// Y los deseos te los cumplo
// Ella usó el love machine como si fuera un columpio
// Te hablo claro, de vez en cuando, por ti pregunto
// Pero si no apareces, a una puta se lo unto


