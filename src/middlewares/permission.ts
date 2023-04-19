import { NextFunction, Request } from "express";
import { decode } from "jsonwebtoken"
import { connection } from "../db/connection";

async function decoder(request: any) {
    const authHeader = request.headers.authorization

    try {
        const [, token] = authHeader?.split(' ')

        const payload = decode(token)

        const [, user] = await connection.query(`
        SELECT * FROM users U INNER JOIN users_roles UR ON U.id = UR.user_id INNER JOIN roles R ON R.id = UR.role_id WHERE U.id = '${payload?.sub}'
    `)

        return user
    } catch (error) {
        console.log(error)
    }

    return

}

function is(role: String[]) {
    const roleAuthorized = async (req: Request, res: any, next: NextFunction) => {
        const user = await decoder(req)

        const newUser = user as any

        const userRoles = newUser.map((role: any) => role.name)

        const existsRoles = userRoles?.some((r: any) => role.includes(r))

        if (existsRoles) {
            return next()
        }

        res.status(401).json({ message: "Not authorized" })
    }

    return roleAuthorized
}

export { is }