import { PasswordResetModel } from "../../db/sequelize";
import {
  NewPasswordReset,
  PasswordReset,
} from "../../db/models/passwordResets";
import { Op } from "sequelize";
import crypto from "crypto";
import moment from "moment";

export default {
  async findByEmail(email: string) {
    return await PasswordResetModel.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });
  },
  async create(payload: NewPasswordReset) {
    const token = await PasswordResetModel.create(payload);
    return token;
  },

  async update(id: number, update: Partial<PasswordReset>) {
    const [updated] = await PasswordResetModel.update(update, {
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });

    return updated === 1;
  },

  async verifyToken(token: string) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const attempt = await PasswordResetModel.findOne({
      where: {
        token: {
          [Op.eq]: tokenHash,
        },
        expiresAt: {
          [Op.gte]: moment().toISOString(),
        },
      },
    });

    console.log({attempt})

    return attempt;
  },

  async destroy(email: string) {
    const deleted = await PasswordResetModel.destroy({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });

    return deleted >= 1;
  },
};
