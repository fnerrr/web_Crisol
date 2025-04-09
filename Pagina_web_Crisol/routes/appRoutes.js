import express from 'express'
import upload from '../config/multerConfig.js'
import { inicio, noticias, contacto, quienesSomos, contactoRegistro, colaboraRegistro, noEncontrado, revistas, mostrarRevista } from '../controller/appController.js'


const router = express.Router()

// router.get('/slider', obtenerSlides);
router.get('/inicio', inicio)
router.get('/revistas', revistas)
// En tu archivo de rutas (routes.js o similar)
router.get('/revista/:id', mostrarRevista);
router.get('/noticias', noticias)
router.get('/contacto', contacto)
router.get('/quienes-somos', quienesSomos)
router.get('/404', noEncontrado)

// Rutas POST para formularios
router.post('/contacto/registro', contactoRegistro); // Ruta para el primer formulario
router.post('/contacto/colabora', upload.single('imagen'), colaboraRegistro); // Ruta para el segundo formulario
export default router