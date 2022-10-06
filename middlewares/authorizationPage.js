import Cookies from 'next-cookies'

export function unauthPage(ctx) {
    return new Promise(resolve => {
        const cookies = Cookies(ctx)

        if (cookies.token)
            return ctx.res.writeHead(302, {
                Location: '/products'
            }).end();

        return resolve('unauthorized');
    });
}
export function authPage(ctx) {
    return new Promise(resolve => {
        const cookies = Cookies(ctx)

        if (!cookies.token)
            return ctx.res.writeHead(302, {
                Location: '/auth/login'
            }).end();

        return resolve({
            token: cookies.token
        });
    });
} 