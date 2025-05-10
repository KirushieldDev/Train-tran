import mongoose, {Document, Model, Schema} from "mongoose";
import {OptionID} from "@traintran/lib/options";

export interface IJourneySegment {
    departureStation: string;
    arrivalStation: string;
    departureTime: Date;
    arrivalTime: Date;
}

export interface IPassenger {
    firstName: string;
    lastName: string;
    age: number;
}

export interface ITicket {
    outbound: IJourneySegment;
    return?: IJourneySegment;
    passengers: IPassenger[];
    options: OptionID[]; // on stocke juste les IDs, on lie dynamiquement aux optionsList
    basePrice: number;
}

const JourneySegmentSchema = new Schema<IJourneySegment>(
    {
        departureStation: String,
        arrivalStation: String,
        departureTime: Date,
        arrivalTime: Date,
    },
    {_id: false},
);

const PassengerSchema = new Schema<IPassenger>(
    {
        firstName: String,
        lastName: String,
        age: Number,
    },
    {_id: false},
);

const ticketSchema = new Schema<ITicket>(
    {
        outbound: {type: JourneySegmentSchema, required: true},
        return: {type: JourneySegmentSchema},
        passengers: {type: [PassengerSchema], required: true},
        options: {type: [String], enum: Object.values(OptionID), default: []},
        basePrice: {type: Number, required: true},
    },
    {timestamps: true},
);

export interface IAccount extends Document {
    lastName: string;
    firstName: string;
    gender: string;
    mobile: string;
    email: string;
    hash: string;
    salt: string;
    tickets: ITicket[];
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date;
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
        lastLogin: {type: Date, required: true, default: new Date()},
        tickets: {type: [ticketSchema], default: []},
    },
    {timestamps: true},
);

export const Account: Model<IAccount> = mongoose.models.Account || mongoose.model("Account", accountSchema);
