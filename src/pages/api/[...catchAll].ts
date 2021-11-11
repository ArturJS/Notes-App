import { NextApiRequest, NextApiResponse } from 'next';
// import httpProxyMiddleware from 'next-http-proxy-middleware';
import apiCallback from '../../server/main';


export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
    const {
        hostname,
        port,
        pathname
    } = new URL(req.url, `http://${req.headers.host}`);
    const backendPort = Number(port) + 1;
    const targetUrl = `http://${hostname}:${backendPort}${pathname}`

    console.log({
        targetUrl,
    });

    console.log(req.method)
    console.log(req.body)
    // console.log(req.headers)

    // res.status(200).json({ name: 'John Doe' })

    return apiCallback(req, res);

    // return httpProxyMiddleware(req, res, {
    //     target: targetUrl
    // });
}
