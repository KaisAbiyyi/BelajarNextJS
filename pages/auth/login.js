import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Cookies from 'next-cookies';
import ckie from 'js-cookie'
import { unauthPage } from '../../middlewares/authorizationPage';
import Link from 'next/link';

export async function getServerSideProps(ctx) {
    await unauthPage(ctx);
    return { props: {} }
}

export default function Login() {
    const [fields, setFields] = useState({
        email: '',
        password: ''
    });

    const [status, setStatus] = useState('normal');

    async function loginHandler(e) {
        e.preventDefault();

        setStatus('loading');

        const loginReq = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fields)
        });

        if (!loginReq.ok) return setStatus('error ' + loginReq.status);

        const loginRes = await loginReq.json();

        setStatus('success');

        ckie.set('token', loginRes.token);

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
            <h1>Login</h1>
            <form onSubmit={loginHandler.bind(this)}>
                <input
                    type='text'
                    name='email'
                    placeholder='Email'
                    onChange={fieldHandler.bind(this)}
                /><br />
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChange={fieldHandler.bind(this)}
                /> <br />
                <button type='submit'>Login</button>
                <div>Status: {status}</div>

                <Link href='/auth/register'><a>Register</a></Link>
            </form>
        </div>
    )
}