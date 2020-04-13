import { Schema, model, Document } from 'mongoose'

export interface IResumenDia extends Document {
    id: number
    fecha: string
    diagnosticados_numero: number
    sujetos_riesgo: number
    tests_total: number
    recuperdados_numero: number
    graves_numero: number
    muertes_numero: number
}

const resumenDiaSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    fecha: {
        type: String,
        required: true,
        unique: true
    },
    diagnosticados_numero: {
        type: Number,
    },
    sujetos_riesgo: {
        type: Number
    },
    tests_total: {
        type: Number
    },
    graves_numero: {
        type: Number
    },
    muertes_numero: {
        type: Number
    }
}, { timestamps: true })

export default model<IResumenDia>('ResumenDia', resumenDiaSchema)