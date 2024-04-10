const express = require('express');

const paymentRouter = express.Router();
mercadopago.configure({
  access_token: 'APP_USR-331439273297989-040710-95a16a0cbd0a59ee613f05580f4cee37-358848285',
});

paymentRouter.post('/create_preference', async (req, res) => {
  try {
    const { items } = req.body;
    const preferenceItems = items.map((item) => ({
      title: item.title,
      unit_price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
    }));

    const preference = await mercadopago.preferences.create({
      items: preferenceItems,
    });

    res.json({ preferenceId: preference.body.id });
  } catch (err) {
    console.error('Erro ao criar a preferência:', err);
    res.status(500).json({ error: 'Erro ao criar a preferência' });
  }
});

module.exports = paymentRouter;