import db from '../../../../libs/db';
import authorization from '../../../../middlewares/authorization';

export default async function handler(req, res) {
    if (req.method !== "PUT") return res.status(405).end();

    const auth = await authorization(req, res);

    const { id } = req.query;
    const { name, price, description } = req.body;

    const update = await db("products").where({ id }).update({
        name, price, description
    });

    const data = await db("products").where({ id }).first();

    res.status(201);
    res.json({
        message: "Berhasil Update Produk",
        data: data
    });
}