/**
 * @swagger
 * /api/payments/intent:
 *   post:
 *     summary: Crea un Payment Intent para procesar un pago
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Monto del pago en centavos
 *               currency:
 *                 type: string
 *                 description: Código de divisa
 *     responses:
 *       200:
 *         description: Payment Intent creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 client_secret:
 *                   type: string
 */
import express from 'express';
import paymentService from '../services/payment.service.js';

const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await paymentService.createPaymentIntent(amount, currency);
    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
