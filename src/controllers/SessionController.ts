import { connection } from "../db/connection";
import { QueryTypes } from 'sequelize'
import { v4 as uuidV4 } from 'uuid'
import { sign } from 'jsonwebtoken'
import { compare, hash } from 'bcryptjs'

const responseModel = {
    success: false,
    data: [],
    error: [] as any
}

export const SessionController = {

    create: async function createVisit(req: any, res: any) {
        try {
        const response = { ...responseModel }

        const { password, email } = req.body;

        const [, user] = await connection.query(`
            SELECT * FROM users WHERE email = '${email}'
        `)

        const [newUser] = user as any

        
        if (!newUser) {
            response.error = [{ error: 'User not found' }]
            console.log(newUser, 'nao achou usuario')
            return res.status(400).json(response)
        }
        
        const matchPassword = await compare(password, newUser.password)
        const passwordHashed = await hash(password,8)
         console.log(passwordHashed, newUser.password, 'AQUIII')

        if (!matchPassword) {
            response.error = [{ error: 'Incorrect user or email' }]
            return res.status(400).json(response)
        }

        const [, newRoles] = await connection.query(`
            SELECT R.name FROM users U INNER JOIN users_roles UR ON U.id = UR.user_id INNER JOIN roles R ON R.id = UR.role_id WHERE U.id = '${newUser.id}'
        `)

        const rolesAny = newRoles as any

        const roles = rolesAny.map((role: any) => role.name)

        const token = sign({ roles }, 'iwdbuowiubfowiubefibeubfuwbeiuu9282398y32', {
            subject: newUser.id,
            expiresIn: '1d'
        })
        

        /*  const [, affectRows] = await connection.query(`
             INSERT INTO users VALUES ('${uuidV4()}', '${name}', '${email}', '${passwordHashed}', '${permission}', NOW(), NULL)
         `) */

        /* response.success = affectRows as any > 0 */

        return res.json({
            token,
            newUser,
            roles
        })

            } catch(error) {
        console.log(error)
        }
    }

    

}
