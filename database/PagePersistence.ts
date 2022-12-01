import { Schema } from "mongoose";
import mongoose from "./mongoconfig";

export default class PagePersistence {
    // Schema
    static pageSchema = new mongoose.Schema({
        type: {
            type: String,
            required: true,
        },
        properties: {
            title: {
                type: String,
                required: true
            },
            icon: {
                type: String
            },
            created: {
                type: Date,
                default: Date.now
            },
            created_by: {
                type: Schema.Types.ObjectId,
                required: true
            }
        },
        content: {
            type: [Schema.Types.ObjectId],
            default: []
        }
    })

    // Models
    static page = mongoose.model("page", this.pageSchema)

    static async createPage(json: object) {
        console.log("en el create")
        return await PagePersistence.page.create(json)
    }

    static async getPage(json: object) {
        return await PagePersistence.page.findOne(json)
    }

    static async deletePage(json: object) {
        return PagePersistence.page.findOneAndDelete(json,
        ).clone()
    }
}