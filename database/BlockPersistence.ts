import {Schema} from "mongoose";
import mongoose from "./mongoconfig";

const bcrypt = require('bcrypt')

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
        required: true,
        enum: ["page", "bullet", "toggle", "todo"]
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

  static async updateBlock(id: any, json: any) {
    const res = Object.fromEntries(Object.entries(json).map(([key, value]) => {
      if(key != "value")
        return ['properties.'+key, value]
      else
        return [key, value]
    }));

    return  await BlockPersistence.block.updateOne(id, {$set: res})
  }

    static async addContentBlock(json: object, id: Schema.Types.ObjectId) {
      return BlockPersistence.block.findOneAndUpdate(json, {$push: {content: id}})
    }

  static async deleteBlock(json: object) {
    return BlockPersistence.block.findOneAndDelete(json,
    ).clone()
  }
}
