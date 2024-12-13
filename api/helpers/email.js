// Cargar variables de entorno desde un archivo .env
const properties = require('./properties');
const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');

class Email {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: properties.EMAIL_HOST, // Servidor SMTP
            port: parseInt(properties.EMAIL_PORT, 10), // Puerto SMTP
            secure: properties.EMAIL_PORT === '465', // Usar SSL si el puerto es 465
            auth: {
                user: properties.EMAIL_USER, // Usuario
                pass: properties.EMAIL_PASS, // Contraseña
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
                from: `"${properties.EMAIL_FROM_NAME}" <${properties.EMAIL_FROM_ADDRESS}>`, // Quien envía
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
            console.log(`Correo enviado correctamente a ${to}`);
            return 1; // Éxito
        } catch (error) {
            console.error(`Error al enviar el correo a ${to}:`, error);
            return 0; // Error
        }
    }

    // Método para enviar múltiples correos
    async sendMultipleMails(emailList) {
        let successCount = 0; // Contador de envíos exitosos
        let errorCount = 0; // Contador de errores

        for (const email of emailList) {
            const { to, subject, templatePath, variables, attachmentPath } = email;

            try {
                const result = await this.sendMail(to, subject, templatePath, variables, attachmentPath);
                if (result === 1) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                console.error(`Error al procesar el envío a ${to}:`, error);
                errorCount++;
            }
        }

        console.log(`Proceso finalizado: ${successCount} correos enviados, ${errorCount} errores.`);
        return { successCount, errorCount }; // Retornar resultados
    }
}

module.exports = Email;
