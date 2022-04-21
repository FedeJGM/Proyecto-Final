import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { email, nombre, token } = datos;

    //Enviando el Correo
    const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Reestablezca su contraseña",
        text: "Reestablezca su contraseña",
        html: `<p>Hola! ${nombre}, has solicitado reestablecer tu contraseña</p>
        <p>Haz click en el siguiente enlace, para generar una nueva contraseña:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Contraseña</a> </p>
        
        <p>Si usted no creó esta cuenta, le recomendamos ignorar este mensaje</p>
        `,
    });

    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;