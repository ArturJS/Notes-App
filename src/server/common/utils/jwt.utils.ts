import jwt from 'jsonwebtoken';
import config from '~/server/common/config';

const { AUTH_SESSION_SECRET } = config.auth;

export const sign = async payload =>
    new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            AUTH_SESSION_SECRET,
            { expiresIn: '1h' },
            (err, encoded) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(encoded);
            }
        );
    });

export const verify = async token =>
    new Promise((resolve, reject) => {
        jwt.verify(token, AUTH_SESSION_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(decoded);
        });
    });
