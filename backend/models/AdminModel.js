import {Sequelize} from "sequelize";
import db from "../database/db.js";

const {DataTypes} = Sequelize
const Admin = db.define(
    "admins",{
        name : DataTypes.STRING,
        email : DataTypes.STRING,
        pass : DataTypes.TEXT,
        refresh_token : DataTypes.TEXT
    })

    db.sync().then(()=> console.log("admin synchronized"));
    export default Admin