import mongoose, {Document, Model, Schema} from "mongoose";

export interface IAccount extends Document {
    lastName: string;
    firstName: string;
    gender: string;
    mobile: string;
    email: string;
    hash: string;
    salt: string;
    createdAt: Date;
    updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
    {
        lastName: {type: String, required: true},
        firstName: {type: String, required: true},
        gender: {type: String, required: true},
        mobile: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        hash: {type: String, required: true},
        salt: {type: String, required: true},
    },
    {timestamps: true},
);

export const Account: Model<IAccount> = mongoose.models.Account || mongoose.model("Account", accountSchema);
