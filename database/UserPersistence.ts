import {Schema} from "mongoose";
import mongoose from "./mongoconfig";

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

    static async getPasswordByEmail(name: string) {
        return await UserPersistence.user.findOne({email: name}).exec()
    }
}