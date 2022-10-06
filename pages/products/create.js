import React, { useState } from 'react';
import { authPage } from '../../middlewares/authorizationPage';
import Router from 'next/router';
import Nav from '../../components/nav';

export async function getServerSideProps(ctx) {
    const { token } = await authPage(ctx);

    return {
        props: {
            token
        }
    }
}

export default function ProductCreate(props) {
    const [fields, setFields] = useState({
        name: '',
        price: '',
        description: ''
    });

    const [status, setStatus] = useState('normal');

    async function createHandler(e) {
        e.preventDefault();

        setStatus('loading');

        const { token } = props;

        const create = await fetch('/api/products/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(fields)
        });

        if (!create.ok) return setStatus('error');

        const res = await create.json();

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
            <h1>Tambah Data Product</h1>
            <form onSubmit={createHandler.bind(this)}>
                <input
                    type='text'
                    placeholder="Nama Product"
                    name="name"
                    onChange={fieldHandler.bind(this)}
                /><br />
                <input
                    type='number'
                    placeholder="Harga Product"
                    name="price"
                    onChange={fieldHandler.bind(this)}
                /><br />
                <textarea
                    name="description"
                    onChange={fieldHandler.bind(this)}
                >
                </textarea><br />
                <button type='sumbit'>
                    Tambah
                </button>
                <div>Status: {status}</div>
            </form>
        </div>
    )
}