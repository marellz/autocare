import { Sequelize } from "sequelize";
export default {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  dealor_in: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};
