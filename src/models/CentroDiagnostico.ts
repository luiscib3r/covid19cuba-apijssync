import { Schema, model, Document } from 'mongoose'

export interface ICentroDiagnostico extends Document {
    id: string
    nombre: string
    provincia: string
    dpacode_provincia: number
}

const centroDiagnosticoSchema = new Schema({
    id: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
    },
    provincia: {
        type: String,
        required: true
    },
    dpacode_provincia: {
        type: Number,
        required: true
    }
}, { timestamps: true })

export default model<ICentroDiagnostico>('CentroDiagnostico', centroDiagnosticoSchema)