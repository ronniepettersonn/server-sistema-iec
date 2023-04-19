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

export const RoleController = {
    create: async function createVisit(req: any, res: any) {
        const response = { ...responseModel }
        const { name, description, permissions } = req.body;

        const [, role] = await connection.query(`
            SELECT * FROM roles WHERE description = '${description}' and name = '${name}'
        `)

        const [existRole] = role as any

        if (existRole) {
            return res.status(400).json({ error: 'Role already exists' })
        }

        const idRole = uuidV4()

        const [, affectRows] = await connection.query(`
            INSERT INTO roles VALUES ('${idRole}', '${name}', '${description}',  NOW())
        `)

        response.success = affectRows as any > 0

        /* permissions.map(async (permission: any) => {

            const [, permissions] = await connection.query(`
            SELECT * FROM permissions WHERE id = '${permission}'
        `)
            const newPermissions = permissions as any

            if (newPermissions.length !== 0) {
                const [, affectRows] = await connection.query(`
                    INSERT INTO permissions_roles VALUES ('${idRole}', '${permission}')
                `)
            } else {
                return res.status(401).json({ error: 'Permission not found' })
            }

            return
        }) */

        return res.status(201).json(response)
    },

    get: async function getVisit(req: any, res: any) {
        const response = { ...responseModel }

        try {
            const [, data] = await connection.query(`
                SELECT * FROM roles ORDER BY ID desc
            `)

            console.group(data, 'rota get users')

            response.success = true
            const newData = data as any

            response.data = newData

        } catch (error) {
            response.success = false
        }

        return res.json(response)
    },

}