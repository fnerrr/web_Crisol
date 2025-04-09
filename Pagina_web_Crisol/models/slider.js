import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Revistas from '../models/revistas.js';

const Slider = db.define('sliders', {
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Ruta relativa de la imagen del slide'
    },
    revista_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'revistas', // Relación con el modelo Revistas
            key: 'id'
        }
    },
    orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Orden de visualización en el slider'
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Indica si el slide está activo'
    }
});

// Establecer la relación
Slider.belongsTo(Revistas, {
    foreignKey: 'revista_id',
    as: 'revista'
});

export default Slider;