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
    body: {
      transaction_amount: req.transaction_amount,
      token: req.token,
      description: req.description,
      installments: req.installments,
      payment_method_id: req.paymentMethodId,
      issuer_id: req.issuer,
      payer: {
        email: req.email,
        identification: {
          type: req.identificationType,
          number: req.number
        }
      }
    },
    requestOptions: { idempotencyKey: '<SOME_UNIQUE_VALUE>' }
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