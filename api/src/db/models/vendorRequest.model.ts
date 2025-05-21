import { Sequelize } from "sequelize";
export default {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  vendorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  requestId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  condition: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  price: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  notes: {
    type: Sequelize.STRING,
    allowNull: true,
  },
};
