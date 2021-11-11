import mailer from 'nodemailer';
import config from '@config';
import logger from '@root/common/logger';

class MailerService {
    constructor() {
        this._mailUser = {
            service: config.mailer.MAIL_USER_SERVICE,
            email: config.mailer.MAIL_USER_EMAIL,
            password: config.mailer.MAIL_USER_PASSWORD
        };
    }

    async sendEmail({ receiverEmail, subject, html }) {
        const { service, email, password } = this._mailUser;
        const transporter = mailer.createTransport({
            service,
            auth: {
                user: email,
                pass: password
            }
        });
        const mailOptions = {
            from: email,
            to: [receiverEmail],
            subject,
            html
        };

        logger.info(`Sending email with auth link to ${receiverEmail}...`);

        const info = await transporter.sendMail(mailOptions);

        logger.info(`Email with auth link has been sent. More info: `, info);
    }
}

export default new MailerService();
