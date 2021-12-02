import { NextApiRequest, NextApiResponse } from 'next';
import apiCallback from '../../server/main';

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
    return apiCallback(req, res);
}

export const config = {
    api: {
        bodyParser: false
    }
};
