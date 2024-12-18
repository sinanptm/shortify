import IUser from "@/domain/entities/IUser";
import { model, Schema } from "mongoose";

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    googleId: { type: String, required: true, unique: true },
    token: String,
    profile: String
}, {
    versionKey: false
});

userSchema.index({ googleId: 1 });

const User = model("User", userSchema);
export default User;