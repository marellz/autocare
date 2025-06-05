import { Op } from "sequelize";
import { Interaction } from "../../db/models/interaction.model";
import { InteractionModel } from "../../db/sequelize";

export class InteractionCache {
  private static cache: Map<string, Interaction> = new Map();

  constructor() {
    // Initialize the cache if needed
    // last 3 hours

    InteractionCache.getRecentInteractions();

    // populate cache with interactions from the last 3 hours
  }

  public static get(phone: string) {
    return this.cache.get(phone);
  }

  public static set(phone: string, interaction: Interaction) {
    this.cache.set(phone, interaction);
  }

  public static async getRecentInteractions() {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const recent = await InteractionModel.findAll({
      where: {
        createdAt: {
          [Op.gt]: threeHoursAgo, // last 3 hrs
        } as any,
      },
      order: [
        ["createdAt", "DESC"],
      ],
      attributes:['Distinct', 'phone', 'phone'],
    });

    this.cache = new Map(
      recent.map((i) => {
        const interaction = i.get();
        return [interaction.phone, interaction];
      }),
    );
  }

  public static async find(phone: string) {
    // Simulate an async operation, e.g., fetching from a database
    return this.cache.get(phone);
  }
}
