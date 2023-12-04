import { Express } from 'express';

const sgMail = require('@sendgrid/mail');
const apiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(apiKey);

const sendPurchaseConfirmationEmail = async (to, items) => {
  const subject = 'Confirmación de compra';
  const text = `Tu compra ha sido confirmada. Detalles: ${items.map(item => item.name).join(', ')}`;
  const html = `<strong>${text}</strong>`;

  const msg = {
    to, 
    from: process.env.EMAIL_FROM, 
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    logger.info('Email enviado correctamente.');
  } catch (error) {
    logger.error('Error enviando email de confirmación de compra:', error);
    throw new Error('Error al enviar el email de confirmación de compra.');
  }
};

module.exports = { sendPurchaseConfirmationEmail }