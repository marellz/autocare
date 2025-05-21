import { Sequelize } from "sequelize";
export default {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  phone: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  channel: { // communication channel
    allowNull: false,
    type: Sequelize.STRING,
  },
  item: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  capturedDetails: {
    allowNull: true,
    type: Sequelize.STRING
  },
  missingDetails:{ // array of details as string
    allowNull: true,
    type: Sequelize.STRING
  },
  status: { // missing_details, pending, completed
    allowNull: false,
    type: Sequelize.STRING
  },
  fulfilled_at: {
    allowNull: true,
    type: Sequelize.DATE,
  },
};
