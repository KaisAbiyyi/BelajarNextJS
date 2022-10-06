import db from '../../../libs/db';
import authorization from '../../../middlewares/authorization';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const auth = await authorization(req, res);

    const { id } = req.query;

    const data = await db('products').where({ id }).first();

    if (!data) return res.status(404).end

    res.status(200);
    res.json({
        message: "Product",
        data: data
    })
}