import { DataTypes } from "sequelize";
import db from "../config/db.js";


const Articulo = db.define('articulos',{
    Titulo:{
        type: DataTypes.STRING,
        allowNull: false 
    },
    contenido:{
        type: DataTypes.TEXT,
        allowNull: false 
    },
    categoria:{
        type: DataTypes.TEXT,
        allowNull: false 
    },
    img:{
        type: DataTypes.TEXT,
        allowNull: false 
    },
});

export default Articulo