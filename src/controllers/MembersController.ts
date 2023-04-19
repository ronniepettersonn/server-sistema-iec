import { connection } from "../db/connection";
import { v4 as uuidV4 } from 'uuid'

const responseModel = {
    success: false,
    data: [],
    error: [] as any
}

export const MembersController = {

    create: async function createVisit(req: any, res: any) {
        const response = { ...responseModel }

        const {
            name,
            tel,
            cpf,
            email,
            address,
            address_number,
            address_complement,
            date_born,
            date_member,
            neighborhood,
            city,
            cep,
            uf,
            gender,
            marital
        } = req.body;

        let success = false

        try {

            const [, data] = await connection.query(`
                SELECT cpf, email FROM members WHERE cpf = '${cpf}' or email = '${email}'
            `)

            const newData = data as any

            console.log(newData, 'fora do if')

            if (newData.length === 0) {
                const [, affectRows] = await connection.query(`
                        INSERT INTO members VALUES ('${uuidV4()}', '${name}','${tel}', '${cpf}','${email}','${address}','${address_number}','${address_complement}',
                        '${date_born}','${date_member}','${neighborhood}','${city}','${cep}','${uf}','${gender}', '${marital}', 1, NOW(), NULL)
                        `)
                success = affectRows as any > 0
            } else {
                response.success = false
                const messageError = [{ message: 'E-mail ou CPF já cadastrados' }]
                response.error = messageError
            }




        } catch (error) {
            console.log(error)
        }

        response.success = success

        return res.json(response)
    },

    update: async function updateMember(req: any, res: any) {
        const response = { ...responseModel }

        const { id } = req.params

        const {
            name,
            tel,
            cpf,
            email,
            address,
            address_number,
            address_complement,
            date_born,
            date_member,
            neighborhood,
            city,
            cep,
            uf,
            gender,
            marital,
            isMember
        } = req.body;


        const [, affectRows] = await connection.query(`
            UPDATE members SET  isMember = ${isMember}, name = '${name}', tel = '${tel}', cpf = '${cpf}', email = '${email}', address = '${address}', address_number = '${address_number}', address_complement = '${address_complement}', date_born = '${date_born}', date_member = '${date_member}', neighborhood = '${neighborhood}', city = '${city}', cep = '${cep}', uf = '${uf}', gender = '${gender}', marital = '${marital}', updatedAt = NOW()
            WHERE id = '${id}'

        `)

        response.success = true

        return res.json(response)
    },

    get: async function getVisit(req: any, res: any) {
        const response = { ...responseModel }

        try {
            const [, data] = await connection.query(`
                SELECT * FROM members ORDER BY NAME
            `)

            response.success = true

            function FormatDate(date: string) {
                const Time = new Date(date).getTime() + (1000 * 60 * 60 * 24)
                const newDate = Intl.DateTimeFormat('pt-BR').format(Time)

                return newDate
            }

            const newData = (data as any).map((data: any) => {
                return {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    cpf: data.cpf,
                    isMember: data.isMember,
                    date_member: /* Intl.DateTimeFormat('pt-BR').format(data.date_member) */FormatDate(data.date_member)
                }
            })

            response.data = newData

        } catch (error) {
            response.success = false
        }

        return res.json(response)
    },

    getByDate: async function getByDate(req: any, res: any) {
        const response = { ...responseModel }

        try {
            const [, data] = await connection.query(`
                SELECT * FROM members ORDER BY DATE_MEMBER
            `)

            response.success = true

            function FormatDate(date: string) {
                const Time = new Date(date).getTime() + (1000 * 60 * 60 * 24)
                const newDate = Intl.DateTimeFormat('pt-BR').format(Time)

                return newDate
            }

            const newData = (data as any).map((data: any) => {
                return {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    date_member: /* Intl.DateTimeFormat('pt-BR').format(data.date_member) */FormatDate(data.date_member)
                }
            })

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
                SELECT * FROM members WHERE id = '${id}' ORDER BY ID desc
            `)

            response.success = true

            function FormatDate(date: string) {
                const Time = new Date(date).getTime() + (1000 * 60 * 60 * 24)
                const newDate = Intl.DateTimeFormat('pt-BR').format(Time)

                return newDate
            }

            const newData = (data as any).map((data: any) => {
                return {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    tel: data.tel,
                    cpf: data.cpf,
                    address: data.address,
                    address_number: data.address_number,
                    address_complement: data.address_complement,
                    date_born: data.date_born,
                    neighborhood: data.neighborhood,
                    city: data.city,
                    cep: data.cep,
                    uf: data.uf,
                    gender: data.gender,
                    marital: data.marital,
                    isMember: data.isMember,
                    date_member: /* Intl.DateTimeFormat('pt-BR').format(data.date_member) */data.date_member
                }
            })

            response.data = newData

        } catch (error) {
            response.success = false
        }

        return res.json(response)
    },

    delete: async function Delete(req: any, res: any) {
        const response = { ...responseModel }

        const { id } = req.params

        try {
            const [, affectRows] = await connection.query(`
                DELETE FROM members WHERE id = '${id}'
            `)

            response.success = affectRows as any > 0

        } catch (error) {
            response.success = false
            response.error = error
        }

        return res.json(response)
    },

    search: async function getVisit(req: any, res: any) {
        const response = { ...responseModel }

        const { name } = req.body;

        console.log(name, 'VENDO O NAME')

        try {
            const [, data] = await connection.query(`
                SELECT * FROM members WHERE name like '%${name}%'
            `)

            response.success = true

            function FormatDate(date: string) {
                const Time = new Date(date).getTime() + (1000 * 60 * 60 * 24)
                const newDate = Intl.DateTimeFormat('pt-BR').format(Time)

                return newDate
            }

            const newData = (data as any).map((data: any) => {
                return {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    isMember: data.isMember,
                    date_member: /* Intl.DateTimeFormat('pt-BR').format(data.date_member) */FormatDate(data.date_member)
                }
            })

            response.data = newData

        } catch (error) {
            response.success = false
        }

        return res.json(response)
    },
}
