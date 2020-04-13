import { Schema, model, Document } from 'mongoose'

export interface IStatus extends Document {
    id: number
    hash: string
}

const statusSchema = new Schema({
    id: {
        type: Number,
        default: 0,
        unique: true
    },
    hash : {
        type: String
    }
}, { timestamps: true })

export default model<IStatus>('status', statusSchema)