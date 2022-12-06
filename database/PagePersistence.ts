import { Schema } from "mongoose";
import mongoose from "./mongoconfig";
import BlockPersistence from "./BlockPersistence";
import DashboardPersistence from "./dashboardPersistence";

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
        return await PagePersistence.page.create(json)
    }

    static async getPage(json: object) {
        return await PagePersistence.page.findOne(json)
    }

    static async getPages() {
        return await PagePersistence.page.find()
    }

    static async deletePage(json: object) {
        let page = await PagePersistence.page.findOneAndDelete(json,
        ).clone()

        for(let i = 0; i < page.content.length; i++) {
            let deleteBlock = await BlockPersistence.deleteBlock({_id: page.content[i]})
            await DashboardPersistence.incrementValue(deleteBlock.type, -1)
        }
        
        return page
    }

    static async addContentPage(json: object, id: Schema.Types.ObjectId) {
        return PagePersistence.page.updateOne(json, {$push: {content: id}})
    }
    
    static async removeContentPage(json: object, id: Schema.Types.ObjectId) {
        return PagePersistence.page.updateOne(json, {$pull: {content: id}})
    }

    static async updatePage(id: any, json: any) {
        const res = Object.fromEntries(Object.entries(json).map(([key, value]) => ['properties.'+key, value]));
        return  await PagePersistence.page.updateOne(id, {$set: res})
    }

    static async getPagesByUser(id: String) {
        return await PagePersistence.page.find({"properties.created_by": id})
    }

}