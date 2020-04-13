import { Schema, model, Document } from 'mongoose'

export interface IStatus extends Document {
    id: number
    hash: string,
    lastday: number
}

const statusSchema = new Schema({
    id: {
        type: Number,
        default: 0,
        unique: true
    },
    hash : {
        type: String
    },
    lastday: {
        type: Number
    }
}, { timestamps: true })

export default model<IStatus>('status', statusSchema)