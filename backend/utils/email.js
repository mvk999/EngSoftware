// utils/email.js
import nodemailer from "nodemailer";
import { AppError } from "./error.js";

function criarTransporter() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("❌ EMAIL_USER ou EMAIL_PASS não configurados.");
        throw new AppError("Configuração de e-mail ausente no servidor.", 500);
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

export async function enviarEmailResetSenha(email, link) {
    try {
        const transporter = criarTransporter();

        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #1a73e8;">Redefinição de Senha</h2>
                <p>Você solicitou a redefinição da sua senha na <strong>Vought Tech</strong>.</p>

                <p>Clique abaixo para redefinir sua senha:</p>
                <a href="${link}"
                   style="display:inline-block; padding:12px 20px; background-color:#1a73e8; color:white; text-decoration:none; border-radius:8px;">
                    Redefinir Senha
                </a>

                <p style="margin-top:20px;">Ou copie este link:</p>
                <p>${link}</p>

                <p style="margin-top:30px; font-size:12px; color:#777;">
                    Caso você não tenha solicitado, ignore este e-mail.
                </p>
            </div>
        `;

        await transporter.sendMail({
            from: `Vought Tech <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Redefinição de Senha",
            html: htmlTemplate
        });

        console.log(`📨 Email de reset enviado para: ${email}`);

    } catch (err) {
        console.error("❌ Erro ao enviar e-mail:", err);
        throw new AppError("Falha ao enviar e-mail.", 500);
    }
}
