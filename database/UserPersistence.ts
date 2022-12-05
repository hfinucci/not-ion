import {Schema} from "mongoose";
import mongoose from "./mongoconfig";
import BlockPersistence from "./BlockPersistence";
import DashboardPersistence from "./dashboardPersistence";
import PagePersistence from "./PagePersistence";

const bcrypt = require('bcrypt');

export default class UserPersistence {

    static userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        pages: [String],
    });

    static user = mongoose.model("user", this.userSchema);

    static async createUser(json: any) {

        const rawPassword = json.password
        const salt = await bcrypt.genSalt();
        json.password = await bcrypt.hash(rawPassword, salt)

        return await UserPersistence.user.create(json)
    }

    static async getUserByEmail(name: string) {
        return await UserPersistence.user.findOne({email: name}).exec()
    }

    static async deleteUser(json: object) {
        let user = await UserPersistence.user.findOneAndDelete(json).clone()

        console.log("USER: ", user)
        for(let i = 0; i < user.pages.length; i++) {
            await PagePersistence.deletePage({_id: user.pages[i]})
        }

        return user
    }

    static async addPagesUser(json: object, id: Schema.Types.ObjectId) {
        return await UserPersistence.user.findOneAndUpdate(json, {$push: {pages: id}})
    }

    static async removePagesUser(json: object, id: Schema.Types.ObjectId) {
        return await UserPersistence.user.findOneAndUpdate(json, {$pull: {pages: id}})
    }
}