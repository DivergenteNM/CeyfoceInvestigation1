const nodemailer = require('nodemailer');

function sendEmailCode(email, code, type) {
    var mailOptions = {
        from: "ceyfoce@gmail.com",
        to: email,
        subject: "Libres pensadores - grupo de investigación",
        html: ""
    };
    if(type==='message'){
        const htmlsend = textEmailMessage(code.email, code.affair, code.message)
        mailOptions.html = htmlsend;
    }else{
        const htmlsend = textEmailCode(code);
        mailOptions.html = htmlsend;
    }
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "ceyfoce@gmail.com",
            pass: "vypnguzpubluvxsk"
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    })
}

function textEmailCode(code) {
    return `<!DOCTYPE html>
    <html lang="en">
    <body>
        <table style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
            <tr>
                <td align="center" style="padding:0;">
                    <h2>Código de Verificación</h2>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding:0;">
                    <input style="border:1px solid black;border-radius:20px;text-align:center;padding:20px 0" id="codigo" type="text" value=${code} readonly>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
}

function textEmailMessage(email,affair,message) {
    return `<!DOCTYPE html>
    <html lang="en">
    <body>
        <table style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
            <tr>
                <td align="center" style="padding:0;">
                    <h2>Mensaje de solicitud de información - Libres pensadores</h2>
                </td>
            </tr>
            <tr>
                <td style="padding:0;margin:5px 0;">
                    Email: ${email}
                </td>
            </tr>
            <tr>
                <td style="padding:0;"margin:5px 0;>
                    Asunto: ${affair}
                </td>
            </tr>
            <tr>
                <td style="padding:0;"margin:5px 0;>
                    Mensaje: ${message}
                </td>
            </tr>
        </table>
    </body>
    </html>`;
}

module.exports = sendEmailCode;