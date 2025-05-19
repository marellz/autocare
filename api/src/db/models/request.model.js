import { Sequelize } from "sequelize";
export default {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  phone: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  item: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  // payment: {
  //   allowNull: false,
  //   type: Sequelize.STRING,
  // },
  fulfilled_at: {
    allowNull: true,
    type: Sequelize.DATE,
  },
};
