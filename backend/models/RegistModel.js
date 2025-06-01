import {Sequelize } from "sequelize";
import db from "../database/db.js";
import User from "./UserModel.js";
import Event from "./EventModel.js";
import Admin from "./AdminModel.js";

const {DataTypes} = Sequelize
const Registration = db.define('registrations', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event,
      key: 'id'
    }
  },
   status: {
    type: DataTypes.STRING, // or ENUM if you want to restrict values
    allowNull: false,
    defaultValue: 'registered'
  }
}, {
  tableName: 'registrations',
  timestamps: true,
  createdAt: 'registered_at',
  updatedAt: false
});

User.belongsToMany(Event, {
  through: Registration,
  foreignKey: 'user_id',

});
Event.belongsToMany(User, {
  through: Registration,
  foreignKey: 'event_id',

});

// ✅ Ini penting agar Registration bisa include User/Event langsung
Registration.belongsTo(User, { foreignKey: 'user_id' });
Registration.belongsTo(Event, { foreignKey: 'event_id' });

db.sync().then(()=>console.log("regist synchronized"))
export default Registration