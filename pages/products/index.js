import React, { useState } from 'react';
import { authPage } from "../../middlewares/authorizationPage"
import Router from 'next/router';
import Nav from '../../components/nav';

export async function getServerSideProps(ctx) {
    const { token } = await authPage(ctx)

    const postReq = await fetch('http://localhost:3000/api/products', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const products = await postReq.json();

    return {
        props: {
            token,
            products: products.data
        }
    }
}

export default function ProductIndex(props) {
    const [products, setProducts] = useState(props.products);

    async function deleteHandler(id, e) {
        e.preventDefault();

        const { token } = props;

        const ask = confirm('Apakah Yakin Akan Hapus Data Ini');

        if (ask) {

            const deleteProduct = await fetch('/api/products/delete/' + id, {
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            const res = await deleteProduct.json();

            const productsFiltered = products.filter(product => {
                return product.id !== id && product
            });

            setProducts(productsFiltered);
        }
    }
    function editHandler(id) {
        Router.push('/products/edit/' + id);
    }
    return (
        <div>
            <Nav/>
            <h1>Products</h1>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <span>{product.price}</span>
                    <p>{product.description}</p>
                    <div>
                        <button onClick={editHandler.bind(this, product.id)}>Edit</button>
                        <button onClick={deleteHandler.bind(this, product.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    )
}