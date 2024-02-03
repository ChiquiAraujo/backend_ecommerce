import Stripe from 'stripe';

// Inicializar Stripe 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentService = {
  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        // Puedes agregar más opciones aquí según sea necesario
      });
      return paymentIntent;
    } catch (error) {
      console.error('Error al crear el Payment Intent:', error);
      throw error;
    }
  },
};

export default paymentService;
