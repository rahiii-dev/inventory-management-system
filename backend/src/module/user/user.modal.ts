import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    id: string;
    fullname: string;
    email: string;
    password: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    validatePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        fullname: { type: String, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true},
        refreshToken: { type: String},
    },
    { timestamps: true } 
);

userSchema.pre<IUser>("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
