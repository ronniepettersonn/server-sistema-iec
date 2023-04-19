import express from 'express'
import { FinancialController } from './controllers/FinancialController'
import { MembersController } from './controllers/MembersController'
import { PermissionController } from './controllers/PermissionController'
import { RoleController } from './controllers/RoleController'
import { SessionController } from './controllers/SessionController'
import { UsersController } from './controllers/UsersController'
import { VisitController } from './controllers/VisitController'

import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = file.originalname.split('.')[1];

        // Cria um código randômico que será o nome do arquivo
        const novoNomeArquivo = require('crypto')
            .randomBytes(64)
            .toString('hex');

        // Indica o novo nome do arquivo:
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
    }
});

const upload = multer({ storage })

import { is } from './middlewares/permission'
import { GabineteController } from './controllers/GabineteController'
import { ScheduleController } from './controllers/ScheduleController'

export const routes = express.Router()

routes.post('/visit', VisitController.create)
routes.get('/visit/list', VisitController.get)
routes.put('/visit/contacted/:id', VisitController.contacted)

routes.post('/members', MembersController.create)
routes.put('/members/:id', MembersController.update)
routes.delete('/members/:id', MembersController.delete)
routes.get('/members/list', MembersController.get)
routes.post('/members/search', MembersController.search)
routes.get('/members/list/date', MembersController.getByDate)

routes.get('/members/:id', MembersController.getById)

routes.post('/deposit', is(['ROLE_ADMIN']), FinancialController.deposit)
routes.post('/withdraw', is(['ROLE_ADMIN']), FinancialController.withdraw)
routes.get('/balance', is(['ROLE_ADMIN']), FinancialController.balance)
routes.get('/statement', is(['ROLE_ADMIN']), FinancialController.statement)
routes.get('/statement/month', is(['ROLE_ADMIN']), FinancialController.statementByMonth)

routes.post('/users', is(['ROLE_ADMIN']), UsersController.create)

routes.get('/users', UsersController.get)
routes.delete('/users/:id', UsersController.delete)
routes.get('/users/:id', UsersController.getById)
routes.put('/users/:id', UsersController.update)

routes.get('/users/roles', UsersController.roles)
routes.get('/users/roles/:id', UsersController.roleByUser)

routes.post('/session', SessionController.create)

routes.post('/permissions', PermissionController.create)
routes.post('/roles', RoleController.create)
routes.get('/roles', RoleController.get)

routes.post('/gabinete/:id', GabineteController.create)
routes.get('/gabinete/:id', GabineteController.get)

routes.post('/schedule/pregacao', ScheduleController.pregacao)
routes.get('/schedule/pregacao', ScheduleController.getPregacao)





