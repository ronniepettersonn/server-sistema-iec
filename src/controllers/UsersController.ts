import { connection } from "../db/connection";
import { QueryTypes } from 'sequelize'
import { v4 as uuidV4 } from 'uuid'

import { hash, } from 'bcryptjs'
import { decode } from "jsonwebtoken";

const responseModel = {
    success: false,
    data: [],
    error: [] as any
}

export const UsersController = {

    create: async function createVisit(req: any, res: any) {
        const response = { ...responseModel }

        const { name, password, email, roles } = req.body;

        const [, user] = await connection.query(`
            SELECT * FROM users WHERE email = '${email}'
        `)

        const newUser = user as any

        if (newUser.length === 0) {
            const passwordHashed = await hash(password, 8)

            const idUser = uuidV4()

            const [, affectRows] = await connection.query(`
                INSERT INTO users VALUES ('${idUser}', '${name}', '${email}', '${passwordHashed}', NOW(), NULL)
            `)

            response.success = affectRows as any > 0

            roles.map(async (role: any) => {

                try {
                    const [, roles] = await connection.query(`
                SELECT * FROM roles WHERE id = '${role}'
                `)
                    const newRoles = roles as any

                    if (newRoles.length !== 0) {
                        const [, affectRows] = await connection.query(`
                        INSERT INTO users_roles VALUES ('${role}', '${idUser}')
                    `)
                    } else {
                        return res.status(401).json({ error: 'Role not found' })
                    }
                } catch (error) {
                    console.log(error)
                }
                return
            })

            return res.json(response)
        } else {
            response.success = false
            response.error = [{ error: 'Email já cadastrado' }]
        }

        return res.json(response)

    },

    update: async function getVisit(req: any, res: any) {
        const response = { ...responseModel }

        const { name, password, email, roles } = req.body;

        const { id } = req.params

        const [, user] = await connection.query(`
            SELECT * FROM users WHERE email = '${email}'
        `)

        const passwordHashed = await hash(password, 8)

        /* const idUser = uuidV4() */

        try {

            const [, affectRows] = await connection.query(`
                UPDATE users SET name = '${name}', email = '${email}', password = '${passwordHashed}', updatedAt = NOW() WHERE id = '${id}'
            `)

            response.success = true

            roles.map(async (role: any) => {
                try {
                    const [, roles] = await connection.query(`
                        SELECT * FROM roles WHERE id = '${role}'
                    `)
                    const newRoles = roles as any

                    if (newRoles.length !== 0) {
                        const [, affectRows] = await connection.query(`
                        UPDATE users_roles SET role_id = '${role}' WHERE user_id = '${id}'
                    `)
                    } else {
                        return res.status(401).json({ error: 'Role not found' })
                    }
                } catch (error) {
                    console.log(error)
                }
                return
            })

            return res.json(response)

        } catch (error) {
            response.success = false
            return res.json(response)
        }



    },

    get: async function getVisit(req: any, res: any) {
        const response = { ...responseModel }

        try {
            const [, data] = await connection.query(`
                SELECT * FROM users ORDER BY NAME desc
            `)

            response.success = true
            const newData = data as any

            response.data = newData

        } catch (error) {
            response.success = false
        }

        return res.json(response)
    },

    getById: async function getById(req: any, res: any) {
        const response = { ...responseModel }

        const { id } = req.params

        try {
            const [, data] = await connection.query(`
                SELECT * FROM users WHERE id = '${id}'
            `)

            response.success = true
            const newData = data as any

            response.data = newData

        } catch (error) {
            response.success = false
        }

        return res.json(response)
    },


    roles: async function createVisit(req: any, res: any) {
        const response = { ...responseModel }

        const authHeader = req.headers.authorization || '';

        const [, token] = authHeader?.split(" ");

        try {
            if (!token) {
                return res.status(401).json({ message: "Not authorized!" })
            }

            const payload = decode(token)

            if (!payload) {
                return res.status(401).json({ message: "Not authorized!" })
            }

            const [, user] = await connection.query(`
            SELECT R.name FROM users U INNER JOIN users_roles UR ON U.id = UR.user_id INNER JOIN roles R ON R.id = UR.role_id WHERE U.id = '${payload.sub}'
            `)

            const newUser = user as any

            const rolesMap = newUser.map((r: any) => r.name)

            const roles = rolesMap as any

            return res.status(200).json(roles)

        } catch (error) {
            return res.status(400).send()
        }
    },

    roleByUser: async function createVisit(req: any, res: any) {
        const { id } = req.params

        try {

            const [, user] = await connection.query(`
        SELECT * FROM users U INNER JOIN users_roles UR ON U.id = UR.user_id INNER JOIN roles R ON R.id = UR.role_id WHERE U.id = '${id}'
        `)

            const newUser = user as any

            const rolesMap = newUser.map((r: any) => r.name)

            const roles = rolesMap as any

            return res.status(200).json(newUser)

        } catch (error) {
            return res.status(400).send()
        }


    },

    delete: async function createVisit(req: any, res: any) {
        const response = { ...responseModel }

        const { id } = req.params

        try {
            if (!id) {
                return res.status(401).json({ message: 'Id not found!' })
            }

            const [, user] = await connection.query(`
                DELETE FROM users WHERE id = '${id}'
            `)

            response.success = true

            return res.status(200).send()

        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }

    }
}
