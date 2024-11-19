require('dotenv').config(); // Cargar variables de entorno

const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');

class Email {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, // Servidor SMTP
            port: parseInt(process.env.EMAIL_PORT, 10), // Puerto SMTP
            secure: process.env.EMAIL_PORT === '465', // Usar SSL si el puerto es 465
            auth: {
                user: process.env.EMAIL_USER, // Usuario
                pass: process.env.EMAIL_PASS, // Contraseña
            },
        });
    }

    // Método para cargar plantillas
    loadTemplate(templatePath, variables) {
        const template = fs.readFileSync(templatePath, 'utf8');
        const compiledTemplate = handlebars.compile(template);
        return compiledTemplate(variables);
    }

    // Método para enviar correo
    async sendMail(to, subject, templatePath, variables, attachmentPath = null) {
        try {
            const htmlContent = this.loadTemplate(templatePath, variables);

            const mailOptions = {
                from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`, // Quien envía
                to, // Destinatario
                subject, // Asunto
                html: htmlContent, // Cuerpo del correo en HTML
            };

            if (attachmentPath) {
                mailOptions.attachments = [
                    {
                        path: attachmentPath,
                    },
                ];
            }

            await this.transporter.sendMail(mailOptions);
            console.log('Correo enviado correctamente');
            return 1; // Éxito
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return 0; // Error
        }
    }
}

module.exports = Email;
