import db from '../../../libs/db';
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { name, email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const register = await db('users').insert({
        name,
        email,
        password: passwordHash
    });

    const registeredUser = await db('users').where({ id: register }).first();

    res.status(200);
    res.json({
        message: "Berhasil Melakukan Registrasi",
        data: registeredUser
    });
}