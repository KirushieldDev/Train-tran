import mongoose, {Document, Model, Schema} from "mongoose";
import {OptionID} from "@traintran/lib/options";

export interface IOption extends Document {
    _id: mongoose.Types.ObjectId;
    id: OptionID;
    name: string;
    description: string;
    price: number;
    iconName: string;
    isActive: boolean;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
}

const optionSchema = new Schema<IOption>(
    {
        id: {type: String, required: true, unique: true, enum: Object.values(OptionID)},
        name: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        iconName: {type: String, required: true},
        isActive: {type: Boolean, required: true, default: true},
    },
    {timestamps: true},
);

export const Option: Model<IOption> = mongoose.models.Option || mongoose.model("Option", optionSchema);
