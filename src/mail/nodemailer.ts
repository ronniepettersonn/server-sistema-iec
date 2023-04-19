import nodemailer from 'nodemailer'
require('dotenv/config')

export function SendEmail(to: string, subject: string, text: string) {

    const mailData = {
        from: process.env.MAIL_FROM,
        to: to,
        subject: subject,
        html: `text`
    }

    const transpoter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    })

    transpoter.sendMail(mailData, (err, info) => {
        if (err) {
            return console.log(err)
        }
        console.log('DEU CERTO!')
    })

}
