import db from '../../../libs/db';
import authorization from '../../../middlewares/authorization';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const auth = await authorization(req, res);
    
    const { name, price, description } = req.body;

    const create = await db('products').insert({
        name,
        price,
        description
    });

    const createdData = await db('products').where('id', create).first();

    res.status(201);
    res.json({
        message: 'Berhasil Menambahkan Data Product',
        data: createdData
    });
} 