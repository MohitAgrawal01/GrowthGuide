import request from "request";
import dotenv from "dotenv"
dotenv.config();

export default function getTransactionById(bankReferenceNo, callback) {
    const url = 'https://payments-tesseract.bharatpe.in/api/v1/merchant/transactions?module=PAYMENT_QR&merchantId=49074412&sDate=1710700200000&eDate=1710786599000';
    const token = process.env.BHARATPE_TOKEN;

    const options = {
        url: url,
        headers: {
            'token': token
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            return callback(error, null);
        }

        if (response.statusCode !== 200) {
            return callback(new Error(`Request failed with status code ${response.statusCode}`), null);
        }

        const data = JSON.parse(body);
        if (data.status && data.status === true && data.data && data.data.transactions) {
            const transactions = data.data.transactions.filter(transaction => transaction.bankReferenceNo === bankReferenceNo);
            callback(null, transactions);
        } else {
            callback(new Error('Failed to fetch transactions'), null);
        }
    });
}
