import React, { useState } from 'react';
import { authPage } from '../../../middlewares/authorizationPage';
import Router from 'next/router'
import Nav from '../../../components/nav';

export async function getServerSideProps(ctx) {
    const { token } = await authPage(ctx);

    const { id } = ctx.query;

    const productReq = await fetch('http://localhost:3000/api/products/' + id, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    const res = await productReq.json()

    return {
        props: {
            token,
            product: res.data
        }
    }
}

export default function ProductEdit(props) {
    const { product } = props
    const [fields, setFields] = useState({
        name: product.name,
        price: product.price,
        description: product.description
    });


    const [status, setStatus] = useState('normal');

    async function updateHandler(e) {
        e.preventDefault();

        setStatus('loading');

        const { token } = props;

        const update = await fetch('/api/products/update/' + product.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(fields)
        });

        if (!update.ok) return setStatus('error' + update.status);

        const res = await update.json();

        setStatus('success');

        Router.push('/products');
    }

    function fieldHandler(e) {
        const name = e.target.getAttribute('name');
        setFields({
            ...fields,
            [name]: e.target.value
        })
    }

    return (
        <div>
            <Nav />
            <h1>Update Data Product</h1>
            <form onSubmit={updateHandler.bind(this)}>
                <input
                    type='text'
                    placeholder="Nama Product"
                    name="name"
                    defaultValue={product.name}
                    onChange={fieldHandler.bind(this)}
                /><br />
                <input
                    type='number'
                    placeholder="Harga Product"
                    name="price"
                    defaultValue={product.price}
                    onChange={fieldHandler.bind(this)}
                /><br />
                <textarea
                    name="description"
                    onChange={fieldHandler.bind(this)}
                    cols='30'
                    rows='5'
                    defaultValue={product.description}
                >
                </textarea><br />
                <button type='sumbit'>
                    Update
                </button>
                <div>Status: {status}</div>
            </form>
        </div>
    )
}