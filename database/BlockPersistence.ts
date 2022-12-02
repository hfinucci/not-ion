import { Schema } from "mongoose";
import mongoose from "./mongoconfig";

export default class BlockPersistence {
  // Schema
  static blockSchema = new mongoose.Schema({
    type: {
      type: String,
      required: true,
    },
    properties: {
      type_face: {
        type: [String],
        default: []
      },
      color: {
        type: String,
        default: "default",
        enum: ["default", "grey", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"]
      },
      highlight: {
        type: String,
        default: "default",
        enum: ["default", "grey", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"]
      },
      icon: String,
      checked: Boolean,
      caption: String,
      align: {
        type: String,
        default: "center",
      },
    },
    content: [String],
    value: String,
    parent: {
      id: {
            type: Schema.Types.ObjectId,
            required: true
          },
      type: {
        type: String,
        required: true
      }
    }
  });

  // Models
  static block = mongoose.model("block", this.blockSchema);

  static async createBlock(json: object) {
    return await BlockPersistence.block.create(json)
  }

  static async getBlock(json: object) {
    return await BlockPersistence.block.findOne(json).exec()
  }

  static async deleteBlock(json: object) {
    return BlockPersistence.block.findOneAndDelete(json,
    ).clone()
  }
}
