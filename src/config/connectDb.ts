import logger from "@/utils/logger";
import { connect } from "mongoose";
import { MONGO_URI } from "./env";

const connectDb = async()=>{
    try {
        await connect(MONGO_URI);
    } catch (error) {
        logger.error(error);
        process.exit(1)
    }
}

export default connectDb;