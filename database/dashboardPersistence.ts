import redisClient from "./redisconfig";
import { validTypes }from "../utils";


export default class DashboardPersistence {

    private static STARTING_VALUE = "0";
    private static HASH_NAME = "dashboard";

    static async incrementValue(key: string, increment: number) {
        await redisClient.hIncrBy(DashboardPersistence.HASH_NAME, key, increment)
    }

    static async getValue(key: string) {
        return await redisClient.hGet(DashboardPersistence.HASH_NAME, key, function(err: any, reply: any) {
            console.log(reply);
        });
    }

    static async getDashboard() {
        return await redisClient.hGetAll(DashboardPersistence.HASH_NAME)
    }

    static createDashboard() {
        try {
            validTypes.forEach((elem) => redisClient.hSet(DashboardPersistence.HASH_NAME, elem, DashboardPersistence.STARTING_VALUE))
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }
}