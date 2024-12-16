import IUser from "@/domain/entities/IUser";
import { model, Schema } from "mongoose";

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    token: { type: String }
},{
    versionKey:false
});

const User = model("User", userSchema);
export default User;