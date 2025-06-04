import { Interaction, NewInteraction } from "../../db/models/interaction.model";
import { InteractionModel } from "../../db/sequelize";

class InteractionService {
  static async findByPhone(phone: string): Promise<Interaction | null> {
    // Simulate an async operation, e.g., fetching from a database
    const item = await InteractionModel.findOne({ where: { phone } });
    if (!item) throw new Error(`Interaction not found.`);
    return item.get();
  }

  static async create(interaction: NewInteraction): Promise<Interaction> {
    interaction.createdAt = new Date();
    const item = await InteractionModel.create(interaction);
    if (!item) throw new Error(`Interaction not created.`);
    return item.get();
  }

  static async update(
    id: string,
    interaction: Partial<Interaction>,
  ): Promise<[affectedCount: number]> {
    interaction.createdAt = new Date(); // Ensure createdAt is set to current time
    const item = await InteractionModel.update(interaction, { where: { id } });
    return item;
  }

  static async destroy(id: string): Promise<void> {
    const interaction = await InteractionModel.findByPk(id);
    if (interaction) {
      await interaction.destroy();
    }
  }
}

export default InteractionService;
