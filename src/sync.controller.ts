import { Request, ResponseToolkit } from '@hapi/hapi'

import CentroAislamiento from './models/CentroAislamiento'

import CentroDiagnostico from './models/CentroDiagnostico'

import ResumenDia from './models/ResumenDia'

import CasoDetectado from './models/CasoDetectado'

import Status from './models/Status'

import * as crypto from "crypto"

let DATA_URI = process.env.DATA_URI || 'http://localhost:5000/data/covid19-cuba.json'

import got from 'got'

interface IData {
    centros_aislamiento: Object,
    centros_diagnostico: Object,
    casos: {
        dias: Object
    }
}

export const syncController = async (req: Request, h: ResponseToolkit) => {
    let token = process.env.STOKEN || 'secret'

    if(req.headers.stoken != token)
        return 'Unauthorized'

    const response = await got(DATA_URI)

    var data : IData = JSON.parse(response.body)

    var md5sum = crypto.createHash('md5')

    var hash = md5sum.update(JSON.stringify(data)).digest('hex')

    let status = await Status.findOne({ id: 0})

    if(status) {
        if (status.hash != hash) {

            SaveData(data)

            let new_status = { hash }

            console.log(hash)

            console.log(new_status)

            await Status.findOneAndUpdate({ id: 0 }, new_status)
        }
    }
    else {

        SaveData(data)

        let status = { id: 0, hash: hash }

        new Status(status).save()
    }

    return h.response('Sync OK')
}

const SaveData = async (data : IData) => {
    // Guardar centros de aislamiento
    let centros_aislamiento_k = Object.keys(data.centros_aislamiento)
    let centros_aislamiento = Object.values(data.centros_aislamiento)

    for (var i = 0; i < centros_aislamiento_k.length; i++) {
        try {
            var centro = centros_aislamiento[i]
            centro.id = centros_aislamiento_k[i]
            
            const c = await CentroAislamiento.findOne(
                {id: centros_aislamiento_k[i]}
            )

            if(c)
                await CentroAislamiento.findOneAndUpdate(
                    { id:  centros_aislamiento_k[i]},
                    centro
                )
            else new CentroAislamiento(centro).save()
        }
        catch(err) {
            console.error(err)
        }
    }

    // Guardar centros de diagnonstico
    let centros_diagnostico_k = Object.keys(data.centros_diagnostico)
    let centros_diagnostico = Object.values(data.centros_diagnostico)

    for (var i = 0; i < centros_diagnostico_k.length; i++) {
        try {
            var centro = centros_diagnostico[i]
            centro.id = centros_diagnostico_k[i]
            
            const c = await CentroDiagnostico.findOne(
                { id : centros_diagnostico_k[i]}
            )

            if(c)
                await CentroDiagnostico.findOneAndUpdate(
                    { id:  centros_diagnostico_k[i]},
                    centro
                )
            else
                new CentroDiagnostico(centro).save()
        }
        catch(err) {
            console.error(err)
        }
    }

    // Guardar resumen del día
    let resumen_dia_k = Object.keys(data.casos.dias)
    let resumen_dia = Object.values(data.casos.dias)

    let last_day = Number(resumen_dia_k[resumen_dia_k.length-1])

    await Status.findOneAndUpdate({id : 0}, {lastday: last_day})

    for (var i = 0; i < resumen_dia_k.length; i++) {
        try {
            var dia_json = resumen_dia[i]

            var cant_diagnosticados = 0

            try {
                cant_diagnosticados = Object.values(dia_json.diagnosticados).length
            }
            catch(err) {
                cant_diagnosticados = 0
            }

            let dia = {
                id : Number(resumen_dia_k[i]),
                fecha : dia_json.fecha,
                diagnosticados_numero: cant_diagnosticados,
                sujetos_riesgo : dia_json.sujetos_riesgo || 0,
                tests_total : dia_json.tests_total || 0,
                recuperdados_numero : dia_json.recuperdados_numero || 0,
                graves_numero : dia_json.graves_numero || 0,
                muertes_numero : dia_json.muertes_numero || 0
            }

            const d = await ResumenDia.findOne(
                { id : dia.id }
            )

            if(d)
                await ResumenDia.findOneAndUpdate(
                    { id : dia.id },
                    dia
                )
            else
                new ResumenDia(dia).save()
            
            try {
                SaveCasosDetectados(Object.values(dia_json.diagnosticados), dia.id)
            }
            catch(err) {
                console.log('No hay diagnosticados en %d', dia.id)
            }
        }
        catch(err) {
            console.error(err)
        }
    }
}

const SaveCasosDetectados = async (casos : Array<any>, dia : Number) => {
    casos.forEach(async (caso) => {
        caso.dia = dia;
        caso.edad = Number(caso.edad)

        try {
            const c = await CasoDetectado.findOne(
                { id : caso.id }
            )
    
            if(c)
                await CasoDetectado.findOneAndUpdate(
                    { id : caso.id},
                    caso
                )
            else
                new CasoDetectado(caso).save()
        }
        catch(err) {
            console.error(err)
        }        
    })
}