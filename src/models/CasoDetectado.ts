import { Schema, model, Document } from 'mongoose'

export interface ICasoDetectado extends Document {
    id: string
    pais: string
    edad: number
    sexo: string
    arribo_a_cuba_foco: string
    consulta_medico: string
    municipio_detección: string
    provincia_detección: string
    dpacode_municipio_deteccion: number
    dpacode_provincia_deteccion: number
    contagio: string
    contacto_focal: number
    centro_aislamiento: string
    centro_diagnostico: string
    posible_procedencia_contagio: Array<string>
    info: string
    provincias_visitadas: Array<string>
    dpacode_provincias_visitadas: Array<number>
    dia: Number
}

const casoDetectadoSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    pais: { type: String },
    edad: { type: Number },
    sexo: { type: String },
    arribo_a_cuba_foco: { type: String },
    consulta_medico: { type: String },
    municipio_detección: { type: String },
    provincia_detección: { type: String },
    dpacode_municipio_deteccion: { type: Number },
    dpacode_provincia_deteccion: { type: Number },
    contagio: { type: String },
    contacto_focal: { type: Number },
    centro_aislamiento: { type: String },
    centro_diagnostico: { type: String },
    posible_procedencia_contagio: { type : [String] },
    info: { type: String },
    provincias_visitadas: { type: [String] },
    dpacode_provincias_visitadas: { type: [Number] },
    dia: { type: Number }
}, { timestamps: true })

export default model<ICasoDetectado>('CasoDetectado', casoDetectadoSchema)