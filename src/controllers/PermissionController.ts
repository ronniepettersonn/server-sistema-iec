import { connection } from "../db/connection";
import { QueryTypes } from 'sequelize'
import { v4 as uuidV4 } from 'uuid'
import { sign } from 'jsonwebtoken'
import { compare, hash, } from 'bcryptjs'


const responseModel = {
    success: false,
    data: [],
    error: [] as any
}

export const PermissionController = {
    create: async function createVisit(req: any, res: any) {
        const response = { ...responseModel }
        const { name, description } = req.body;

        const [, permission] = await connection.query(`
            SELECT * FROM permissions WHERE description = '${description}' and name = '${name}'
        `)

        const [existPermission] = permission as any

        if (existPermission) {
            return res.status(400).json({ error: 'Permission already exists' })
        }

        const [, affectRows] = await connection.query(`
             INSERT INTO permissions VALUES ('${uuidV4()}', '${name}', '${description}',  NOW())
         `)

        response.success = affectRows as any > 0

        return res.status(201).json(response)
    }

}