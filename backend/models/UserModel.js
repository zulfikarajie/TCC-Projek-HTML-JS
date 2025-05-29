import {Sequelize} from "sequelize";
import db from "../database/db.js";

const {DataTypes} = Sequelize
const User = db.define(
    "users",{
        name : DataTypes.STRING,
        email : DataTypes.STRING,
        pass : DataTypes.TEXT,
        refresh_token : DataTypes.TEXT
    })

    db.sync().then(()=> console.log("user synchronized"));
    export default User 