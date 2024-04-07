const { getDatabase } = require('../../db');
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: 'TEST-5458000338803725-061317-ff9aa60a871d449bb08cb9a5271345a9-358848285SEU_TOKEN_DE_ACESSO'
});

const getCollection = async () => {
  const db = await getDatabase('brainybits');
  return db.collection('transactions');
};

export const payment = async (req) => {
  const pagamento = {
    items: req.body.items,
    payer: req.body.payer,
  };

  try {
    const paymentCollection = await getCollection()
    const transactionInfo = await mercadopago.payment.create(pagamento)
    paymentCollection.insertOne(transactionInfo)
    return resp
  } catch (error) {
    throw new Error('Erro ao executar transação: ' + error.message);
  }
};