const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const paymentRouter = express.Router();
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-331439273297989-040710-95a16a0cbd0a59ee613f05580f4cee37-358848285' });

paymentRouter.post('/create_preference', async (req, res) => {
  console.log('chamada')
  try {
    const { items } = req.body;
    const preferenceItems = items.map((item) => ({
      title: item.title,
      unit_price: item.unit_price,
      quantity: item.quantity,
    }));

    const preference = new Preference(client); 
    preference.create({
      body: {
        items: preferenceItems,
      }
    })
    .then((response) => {
      console.log(response);
      res.json(response);
    })
    .catch((error) => {
      console.error('Erro ao criar a preferência:', error);
      res.status(500).json({ error: 'Erro ao criar a preferência' });
    });

  } catch (err) {
    console.error('Erro ao criar a preferência:', err);
    res.status(500).json({ error: 'Erro ao criar a preferência' });
  }
});

module.exports = paymentRouter;
