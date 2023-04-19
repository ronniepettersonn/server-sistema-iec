import { connection } from "../db/connection";
import { QueryTypes } from 'sequelize'
import { v4 as uuidV4 } from 'uuid'

const responseModel = {
    success: false,
    data: [],
    error: []
}

export const ScheduleController = {

    pregacao: async function pregacao(req: any, res: any) {
        const response = { ...responseModel }

        const { name_minister, name_dirigent, date, category, userId } = req.body;

        function FormatDate(date: string) {
            /* const Time = new Date(date).getTime() + (1000 * 60 * 60 * 24) */
            const newDate = Intl.DateTimeFormat('pt-BR', {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }).format(new Date(date))

            return newDate
        }

        const Time = new Date(date).getTime()

        const newDate = FormatDate(date)

        const title = `Culto - ${newDate}`

        const id = uuidV4()

        const [, affectRows] = await connection.query(`
            INSERT INTO schedule VALUES ('${id}', '${title}',NULL, NULL,NULL,'${name_minister}', '${name_dirigent}','${category}', '${Time}','${userId}',NOW())
        `)

        response.success = affectRows as any > 0

        return res.json(response)
    },

    getPregacao: async function getVisit(req: any, res: any) {
        const response = { ...responseModel }

        function FormatDate(date: number) {
            /* const Time = new Date(date).getTime() + (1000 * 60 * 60 * 24) */
            const newDate = Intl.DateTimeFormat('pt-BR', {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }).format(new Date(date))

            return newDate
        }

        try {

            const date = new Date().getTime()

            const [, data] = await connection.query(`
                SELECT * FROM schedule WHERE category = 'PREGAÇÃO' AND date >= '${date}' ORDER BY date asc
            `)

            response.success = true
            const newData = (data as any).map((i: any) => {
                return {
                    id: i.id,
                    minister: i.minister,
                    dirigent: i.dirigent,
                    date: Number(i.date),
                    userId: i.user_id,
                    title: i.title,
                    category: i.category
                }
            })

            response.data = newData

        } catch (error) {
            response.success = false
        }

        return res.json(response)
    },

    gabinete: async function gabinete(req: any, res: any) {
        const response = { ...responseModel }

        const { name_minister, name_dirigent, date, category, userId } = req.body;

        function FormatDate(date: string) {
            /* const Time = new Date(date).getTime() + (1000 * 60 * 60 * 24) */
            const newDate = Intl.DateTimeFormat('pt-BR', {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }).format(new Date(date))

            return newDate
        }

        const Time = new Date(date).getTime()

        const newDate = FormatDate(date)

        const title = `Culto - ${newDate}`

        const id = uuidV4()

        const [, affectRows] = await connection.query(`
            INSERT INTO gabinete VALUES ('${id}', '${title}',NULL, NULL,NULL,'${name_minister}', '${name_dirigent}','${category}', '${Time}','${userId}',NOW())
        `)

        response.success = affectRows as any > 0

        return res.json(response)
    },



}
