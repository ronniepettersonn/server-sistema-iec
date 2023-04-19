import { connection } from "../db/connection";
import { QueryTypes } from 'sequelize'
import { v4 as uuidV4 } from 'uuid'

import nodemailer from 'nodemailer'
import { SendEmail } from "../mail/nodemailer";

const responseModel = {
    success: false,
    data: [],
    error: []
}

export const VisitController = {

    create: async function createVisit(req: any, res: any) {
        const response = { ...responseModel }


        const { name, tel } = req.body;

        const [, affectRows] = await connection.query(`
            INSERT INTO visit VALUES ('${uuidV4()}', '${name}','${tel}', NULL,NOW())
        `)

        response.success = affectRows as any > 0

        SendEmail('petterson28@hotmail.com', 'teste', 'TESTESTTESTESTESTES')

        return res.json(response)
    },

    get: async function getVisit(req: any, res: any) {
        const response = { ...responseModel }

        try {
            const [, data] = await connection.query(`
                SELECT * FROM visit ORDER BY ID desc
            `)

            response.success = true
            const newData = (data as any).map((data: any) => {
                return {
                    id: data.id,
                    name: data.name,
                    tel: data.tel,
                    contacted: data.contacted,
                    createdAt: Intl.DateTimeFormat('pt-BR').format(new Date(data.createdAt))
                }
            })

            response.data = newData

        } catch (error) {
            response.success = false
        }

        return res.json(response)
    },

    contacted: async function handleContacted(req: any, res: any) {
        const response = { ...responseModel }

        const { id } = req.params

        const {
            contacted
        } = req.body;

        const newContacted = contacted === true ? 1 : 0

        const [, affectRows] = await connection.query(`
            UPDATE visit SET contacted = ${newContacted}
            WHERE id = '${id}'

        `)

        response.success = affectRows as any > 0

        return res.json(response)
    },



}
