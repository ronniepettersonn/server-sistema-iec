import { connection } from "../db/connection";
import { v4 as uuidV4 } from 'uuid'

const responseModel = {
    success: false,
    data: [],
    error: [] as any,
    total: 0
}

function getBalance(statement: any) {
    const balance = statement.reduce((acc: any, operation: any) => {
        if (operation.type === 'credit') {
            return acc + Number(operation.amount)
        } else {
            return acc - Number(operation.amount)
        }
    }, 0)

    return balance
}

export const FinancialController = {
    deposit: async (req: any, res: any) => {
        const response = { ...responseModel }

        const { description, amount, codUser } = req.body;

        const [, data] = await connection.query(`
        SELECT amount, type FROM statement
    `)
        const statement = data as any

        const balance = getBalance(statement)

        response.total = balance + Number(amount)

        const [, affectRows] = await connection.query(`
            INSERT INTO statement VALUES('${uuidV4()}', '${description}', ${Number(amount)}, ${response.total} ,'credit', '${codUser}', NOW())
        `)

        response.success = affectRows as any > 0

        return res.status(201).json(response)

    },

    withdraw: async (req: any, res: any) => {
        const response = { ...responseModel }

        const { amount, description, codUser } = req.body

        const [, data] = await connection.query(`
        SELECT amount, type FROM statement
    `)
        const statement = data as any

        const balance = getBalance(statement)

        if (balance < Number(amount)) {
            return res.status(400).json({ error: "insufficient founds" })
        }

        response.total = balance - Number(amount)

        const [, affectRows] = await connection.query(`
            INSERT INTO statement VALUES('${uuidV4()}', '${description}', ${Number(amount)}, ${response.total}, 'debit', '${codUser}', NOW())
        `)

        response.success = affectRows as any > 0

        return res.status(201).json(response)
    },

    balance: async (req: any, res: any) => {
        const response = { ...responseModel }

        try {

            const [, data] = await connection.query(`
            SELECT * FROM statement
        `)
            const statement = data as any

            const balance = getBalance(statement)

            response.success = true

            response.data = balance
            response.total = balance

        } catch (error) {
            response.error = error
            response.success = false
        }

        return res.status(201).json(response)
    },

    statement: async (req: any, res: any) => {
        const response = { ...responseModel }

        const [, data] = await connection.query(`
        SELECT * FROM statement order by createdAt desc
    `)
        const statement = data as any

        response.data = statement
        response.success = true

        return res.status(201).json(response)
    },

    statementByMonth: async (req: any, res: any) => {
        const response = { ...responseModel }

        const day = new Date().getDate()
        const month = new Date().getMonth() + 1
        const year = new Date().getFullYear()

        const dateStart = `${year}-${month}-01 00:00:00`
        const dateEnd = `${year}-${month}-${day} 23:59:59`

        console.log(month, 'vendo o mes')

        const [, data] = await connection.query(`
        SELECT * FROM statement where createdAt BETWEEN '${dateStart}' and '${dateEnd}' order by createdAt desc
    `)
        const statement = data as any

        response.data = statement
        response.success = true

        return res.status(201).json(response)
    },
}
