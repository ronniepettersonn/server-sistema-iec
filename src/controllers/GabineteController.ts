import { connection } from "../db/connection";
import { QueryTypes } from 'sequelize'
import { v4 as uuidV4 } from 'uuid'

const responseModel = {
    success: false,
    data: [],
    error: []
}

export const GabineteController = {

    create: async function createVisit(req: any, res: any) {
        const response = { ...responseModel }



        const { title, date, observation, user_id, member_id } = req.body;

        const [, affectRows] = await connection.query(`
            INSERT INTO gabinete VALUES ('${uuidV4()}', '${title}','${observation}', '${date}','${user_id}','${member_id}',NOW())
        `)

        response.success = affectRows as any > 0

        try {
            const { id } = req.params
            const [, data] = await connection.query(`
            SELECT * FROM gabinete WHERE member_id = '${id}' ORDER BY createdAt DESC
            `)

            response.success = true

            const newData = data as any
            response.data = newData

        } catch (error) {
            response.success = false
        }

        return res.json(response)
    },

    get: async function getVisit(req: any, res: any) {
        const response = { ...responseModel }

        const { id } = req.params

        try {
            const [, data] = await connection.query(`
                SELECT * FROM gabinete WHERE member_id = '${id}' ORDER BY createdAt DESC
            `)

            response.success = true

            const newData = data as any
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
