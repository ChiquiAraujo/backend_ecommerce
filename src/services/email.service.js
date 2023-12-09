import sgMail from '@sendgrid/mail';
import { userModel } from '../models/user.modeles.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendPasswordResetEmail = async (email, link) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM, // Use the email address or domain you verified above
    subject: 'Password Reset Request',
    text: `Click aquí para restablecer la contraseña: ${link}`,
    html: `Click aquí para restablecer la contraseña: <a href="${link}">${link}</a>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Contraseña reestablecida');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const validatePasswordResetToken = async (token) => {
  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Este link ha expirando');
  }

  return user;
};

const resetPassword = async (userId, newPassword) => {
  const user = await userModel.findById(userId);

  if (await user.comparePassword(newPassword)) {
    throw new Error('La nueva contraseña debe de ser diferente a las anteriores.');
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

export {
  sendPasswordResetEmail,
  validatePasswordResetToken,
  resetPassword
};
