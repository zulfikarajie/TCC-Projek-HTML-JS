import { Sequelize } from "sequelize";
import db from "../database/db.js";
import Admin from "./AdminModel.js";

const {DataTypes} = Sequelize
const Event = db.define(
    "events",{
        title : DataTypes.STRING,
        description : DataTypes.TEXT,
        location : DataTypes.STRING,
        date : DataTypes.DATEONLY,
        quota: DataTypes.INTEGER,
        img_url: DataTypes.STRING,
        created_by : {
            type: DataTypes.INTEGER,
            references:{
                model: Admin,
                key: 'id'
            }
        },
    })
Admin.hasMany(Event,{foreignKey:'created_by'})
Event.belongsTo(Admin, {foreignKey:'created_by'})

db.sync().then(()=>console.log("events synchronized"))
export default Event