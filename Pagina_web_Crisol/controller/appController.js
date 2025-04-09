// import Slider from '../models/slider.js'
import { check, validationResult } from 'express-validator'
import Noticias from '../models/noticias.js'
import Contacto from '../models/contacto.js'
import Colaboracion from '../models/colaboraCrisol.js'
import Configuracion from '../models/configuracion.js'
import Revistas from '../models/revistas.js'



const inicio = async (req, res) => {
    const images = [
        '/img/carruesl1.jpg',
        '/img/carruesl2.jpg',
        // '/img/carruesl2.jpg',
        // '/img/carruesl2.jpg',
        // '/img/carruesl2.jpg',
        // '/img/carruesl3.jpg',
        // '/img/carruesl3.jpg',

        // Agrega más imágenes según sea necesario
    ]
    
    try {
        const formatFileSize = (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };
        // Obtener todas las revistas de la base de datos
        const revistas = await Revistas.findAll({
            order: [['createdAt', 'DESC']], // Ordenar por fecha de creación descendente
            limit: 4,
        });

        // Renderizar la vista inicio.pug y pasarle las revistas
        res.render('inicio', {
            pagina: 'Inicio',
            formatFileSize: formatFileSize,
            barra: true,
            images,
            revistas: revistas
        });
    } catch (error) {
        console.error('Error al obtener las revistas:', error);
        res.status(500).send('Error al cargar las revistas');
    }
};

const revistas = async (req, res) => {  
    try {
        // Función para formatear tamaño de archivo
        const formatFileSize = (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        // Función para formatear fecha (ejemplo: "12 mayo 2025")
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.toLocaleString('es-ES', { month: 'long' });
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        };

        // Configuración de paginación
        const page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)
        const perPage = 9; // 9 revistas por página
        const offset = (page - 1) * perPage; // Cálculo del offset

        // Obtener revistas con paginación
        const { count, rows: revistas } = await Revistas.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit: perPage,
            offset: offset
        });

        // Calcular total de páginas
        const totalPages = Math.ceil(count / perPage);

        // Renderizar la vista con los datos necesarios
        res.render('revistas', {
            pagina: 'Revistas',
            formatFileSize: formatFileSize,
            formatDate: formatDate,
            revistas: revistas,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error al obtener las revistas:', error);
        res.status(500).send('Error al cargar las revistas');
    }
};

// Añade esta función al controlador
const mostrarRevista = async (req, res) => {
    try {
        const revista = await Revistas.findByPk(req.params.id); // O el método que uses para buscar por ID
        
        if (!revista) {
            return res.status(404).render('404', { 
                mensaje: 'La revista no fue encontrada' 
            });
        }

        res.render('preview-revista', {
            pagina: `Vista previa: ${revista.titulo}`,
            revista
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la revista');
    }
};



const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'No Encontrada',
    })
}

const noticias = async (req, res) => {
    try {
        // Obtener todas las noticias desde la base de datos
        const noticias = await Noticias.findAll({
            order: [['createdAt', 'DESC']],
            limit: 9,
        });

        // Depuración: Imprime las noticias en la consola
        console.log('Noticias obtenidas de la base de datos:', noticias);

        // Verificar si no hay noticias
        if (noticias.length === 0) {
            // Renderizar la vista con un mensaje indicando que no hay noticias
            return res.render('noticias', {
                pagina: 'Noticias',
                mensaje: 'No hay noticias disponibles en este momento.',
                noticias: [], // Pasar un arreglo vacío para evitar errores en la vista
            });
        }

        // Renderizar la vista y pasar los datos
        res.render('noticias', {
            pagina: 'Noticias',
            noticias,
        });
    } catch (error) {
        console.error('Error al obtener las noticias:', error);
        res.status(500).send('Error al cargar las noticias');
    }
};
const contacto = (req, res) => {
    res.render('contacto', {
        pagina: 'Contacto',
    })
}
const quienesSomos = (req, res) => {
    res.render('quienesSomos', {
        pagina: '¿Quienes Somos?',
    })
}


// Middleware de validación reutilizable
const validarContacto = [
    check('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .trim(),
            
    check('apellidos')
        .notEmpty().withMessage('Los apellidos son obligatorios')
        .trim(),
        
    check('email')
        .notEmpty().withMessage('El email es obligatorio')
        .trim()
        .isEmail().withMessage('Debe ser un email válido'),
        
    check('confirmar_email')
        .notEmpty().withMessage('Debes confirmar tu email')
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Los emails no coinciden'),
        
    check('comentario')
        .notEmpty().withMessage('El comentario es obligatorio')
        .trim()
        .isLength({ min: 10 }).withMessage('El comentario debe tener al menos 10 caracteres')
];

const contactoRegistro = async (req, res) => {
    // Ejecutar validaciones
    await Promise.all(validarContacto.map(validation => validation.run(req)));
    
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        // Si hay errores, renderizar con los errores y datos
        return res.render('contacto', {
            pagina: 'Contacto',
            errores: errores.array(),
            datos: req.body
        });
    }

    const { nombre, apellidos, email, comentario } = req.body;

    try {
        const nuevoContacto = await Contacto.create({
            nombre,
            apellidos,
            email,
            comentario
        });

        console.log('Contacto registrado:', nuevoContacto);
        
        // Renderizar la misma vista con mensaje de éxito
        return res.render('contacto', {
            pagina: 'Contacto',
            success: 'Datos enviados correctamente gracias por ponerte en contacto con nosotros',
            datos: {} // Limpiar el formulario
        });

    } catch (error) {
        console.error('Error al registrar el contacto:', error);
        
        let mensajeError = 'Ocurrió un error al procesar tu solicitud';
        
        if (error.name === 'SequelizeValidationError') {
            mensajeError = 'Error de validación en los datos';
        } else if (error.name === 'SequelizeDatabaseError') {
            mensajeError = 'Error en la base de datos';
        }

        return res.render('contacto', {
            pagina: 'Contacto',
            errores: [{ msg: mensajeError }],
            datos: req.body
        });
    }
};

const colaboraRegistro = async (req, res) => {
    const { titulo, nombre, email, confirmar_email, categoria, contenido } = req.body;
    const img = req.file; // Cambiamos el nombre a 'img' para consistencia

    console.log('Datos recibidos:', { titulo, nombre, email, confirmar_email, categoria, contenido, img });

    // Validar que los correos coincidan
    if (email !== confirmar_email) {
        return res.status(400).json({ error: 'Los correos electrónicos no coinciden' });
    }

    try {
        // Guardar la ruta de la imagen si se subió un archivo
        const imagenPath = img ? `/img/${img.filename}` : null;

        // Crear un nuevo registro en la base de datos
        const nuevaColaboracion = await Colaboracion.create({
            titulo,
            nombre,
            email,
            categoria,
            contenido,
            imagen: imagenPath, // Usamos la ruta relativa consistente
        });

        console.log('Colaboración registrada:', nuevaColaboracion);

        // Redirigir a la vista /contacto después del éxito
        res.redirect('/contacto');
    } catch (error) {
        console.error('Error al registrar la colaboración:', error);

        // Manejo de errores específicos
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Error de validación: ' + error.errors.map(e => e.message).join(', ') });
        }

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({ error: 'Error de base de datos: ' + error.message });
        }

        res.status(500).json({ error: 'Error al registrar la colaboración' });
    }
};

const obtenerConfiguracion = async () => {
    try {
        const configuracion = await Configuracion.findOne({ where: { id: 1 } }); // Obtén la primera configuración
        return configuracion || {
            color_principal: '#FFFFFF', // Valor por defecto
            color_textoPrimario: '#000000', // Valor por defecto
            color_textoSecundario: '#666666', // Valor por defecto
        };
    } catch (error) {
        console.error('Error al obtener la configuración:', error);
        return {
            color_principal: '#FFFFFF', // Valor por defecto en caso de error
            color_textoPrimario: '#000000', // Valor por defecto en caso de error
            color_textoSecundario: '#666666', // Valor por defecto en caso de error
        };
    }
};



export {
    inicio,
    noticias,
    contacto,
    quienesSomos,
    contactoRegistro,
    colaboraRegistro,
    noEncontrado,
    obtenerConfiguracion,
    revistas,
    mostrarRevista
}


