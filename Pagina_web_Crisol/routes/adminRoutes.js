import express from 'express';
import protegerRuta from '../middleware/protegerRuta.js';
import {
    formularioRegistroNoticias,
    registrarNoticia,
    formularioEditarNoticias,
    actualizarNoticia,
    formularioIcono,
    actualizarIcono,
    inicio,
    verNoticias,
    cerrarSesion,
    formularioColor,
    actualizarColores,
    eliminarNoticia,
    uploadPdfController,
    formularioPDF,
    obtenerRevistaParaEditar,
    listarRevistas,
    eliminarRevista,
    mostrarContactos,
    toggleFavorito,
    eliminarContacto,
    mostrarColaboraciones,
    verColaboracionIndividual,
    toggleFavoritoColaboracion,
    eliminarColaboracion,
    crearSlide,
    mostrarFormularioCrear
} from '../controller/adminController.js';
import upload from '../config/multerConfig.js';
import { uploadFiles } from '../config/multerRevistas.js';

const router = express.Router();

router.get('/slider',protegerRuta, mostrarFormularioCrear);
router.post('/slider', protegerRuta,upload.single('imagen'), crearSlide);




router.get('/inicio', protegerRuta, inicio);
router.post('/cerrar-sesion', cerrarSesion);

router.get('/vernoticias', protegerRuta, verNoticias);

// Noticias
router.get('/registro-noticias', protegerRuta, formularioRegistroNoticias); // Para crear una nueva noticia
router.get('/registro-noticias/:id', protegerRuta, formularioRegistroNoticias); // Para editar una noticia existente
router.post('/registro-noticias', protegerRuta, upload.single('img'), registrarNoticia); // Para crear una nueva noticia
router.post('/actualizar-noticia/:id', protegerRuta, upload.single('img'), actualizarNoticia); // Para actualizar una noticia existente
// Ruta para eliminar una noticia
router.post('/eliminar-noticia/:id', protegerRuta, eliminarNoticia);
router.get('/editar-noticias', protegerRuta, formularioEditarNoticias)

// Icono y colores
router.get('/actualizar-icono', protegerRuta, formularioIcono);
router.post('/actualizar-icono', protegerRuta, upload.single('iconUpload'), actualizarIcono);

router.get('/actualizar-color', protegerRuta, formularioColor);
router.post('/actualizar-color', protegerRuta, actualizarColores);

// Ruta para subir archivos PDF
router.get('/agregar-pdf', protegerRuta, formularioPDF);
router.post(
    '/upload-pdf',
    protegerRuta,
    uploadFiles, // Usa el nuevo middleware para manejar ambos archivos
    uploadPdfController // Controlador final
);

router.get('/editar-pdf/:id', protegerRuta, obtenerRevistaParaEditar);
router.post('/editar-pdf/:id',protegerRuta,uploadFiles, uploadPdfController); // Mismo controlador pero en modo edición // Mismo middleware para subir archivos (ahora opcionales)


// router.get('/revistas', protegerRuta, listarRevistas);
router.get('/lista-revistas', protegerRuta, listarRevistas);
router.post('/eliminar-revista/:id', protegerRuta, eliminarRevista);

router.get('/contactos',protegerRuta, mostrarContactos);
// Rutas de administración para contactos
router.post('/contactos/:id/favorito', protegerRuta, toggleFavorito);
router.post('/contactos/:id/eliminar', protegerRuta, eliminarContacto);
// router.get('/ver-revistas', protegerRuta, listarRevistas)

router.get('/colaboraciones',protegerRuta, mostrarColaboraciones);
router.post('/colaboraciones/:id/favorito', protegerRuta, toggleFavoritoColaboracion);
router.post('/colaboraciones/:id/eliminar', protegerRuta,eliminarColaboracion);
// routes/colaboracionesRoutes.js
router.get('/colaboraciones/:id', verColaboracionIndividual);
export default router;