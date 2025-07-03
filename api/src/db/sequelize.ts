import { Model, Sequelize } from "sequelize";
import dbConfig from "../config/db";
import userModelDefinition, {
  type User,
  type NewUser,
} from "../db/models/user.model";
import requestModelDefinition, {
  type NewRequest,
  type Request,
} from "../db/models/request.model";
import vendorModelDefinition, {
  Vendor,
  NewVendor,
} from "../db/models/vendor.model";
import vendorRequestModelDefinition, {
  NewVendorRequest,
  VendorRequest,
} from "../db/models/vendorRequest.model";
import {
  Interaction,
  NewInteraction,
  InteractionModelDefinition,
} from "./models/interaction.model";

const { dbName, userName, password } = dbConfig;

export const sequelize = new Sequelize(dbName!, userName!, password, {
  host: process.env["DB_HOST"] || "localhost",
  dialect: "postgres",
  logging: (msg) => console.log(msg),
});

export const syncModels = async (force: boolean = false) => {
  try {
    await sequelize.sync({ force });
    console.log("Synced successfully");
  } catch (error) {
    console.error("Sync failed", error);
  }
};

(async () => {
  const retries = 5;
  const delay = 2000;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!sequelize) throw new Error("DB not defined");

      await sequelize.authenticate();
      console.log("Database connection established.");

      syncModels();

      return; // success
    } catch (error: unknown) {
      console.error(`Attempt ${attempt} failed: ${error}`);

      if (attempt === retries) {
        throw new Error("Could not connect to DB after multiple attempts.");
      }

      // wait before retrying
      await new Promise((res) => setTimeout(res, delay));
    }
  }
})();

export const UserModel = sequelize.define<Model<User, NewUser>>(
  "users",
  userModelDefinition,
  {
    tableName: "users",
    timestamps: false,
    freezeTableName: true,
  },
);

export const VendorModel = sequelize.define<Model<Vendor, NewVendor>>(
  "vendors",
  vendorModelDefinition,
  {
    tableName: "vendors",
    timestamps: false,
    freezeTableName: true,
  },
);

export const RequestModel = sequelize.define<Model<Request, NewRequest>>(
  "requests",
  requestModelDefinition,
  {
    tableName: "requests",
    timestamps: false,
    freezeTableName: true,
  },
);

export const VendorRequestModel = sequelize.define<
  Model<VendorRequest, NewVendorRequest>
>("vendor_requests", vendorRequestModelDefinition, {
  tableName: "vendor_requests",
  timestamps: false,
  freezeTableName: true,
});

export const InteractionModel = sequelize.define<
  Model<Interaction, NewInteraction>
>("interactions", InteractionModelDefinition, {
  tableName: "interactions",
  freezeTableName: true,
  timestamps: false
});

VendorModel.hasMany(VendorRequestModel);
VendorRequestModel.belongsTo(VendorModel);

RequestModel.hasMany(VendorRequestModel);
VendorRequestModel.belongsTo(RequestModel);

VendorModel.hasMany(InteractionModel);
InteractionModel.belongsTo(VendorModel);
RequestModel.hasMany(InteractionModel);
InteractionModel.belongsTo(RequestModel);
