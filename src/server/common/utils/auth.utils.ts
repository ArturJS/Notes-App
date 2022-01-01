import {
    randomBytes,
    pbkdf2Sync,
    createCipheriv,
    createDecipheriv
} from 'crypto';
import config from '~/server/common/config';

type StringLike =
    | string
    | Buffer
    | Uint8Array
    | Int8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | DataView;
type Digest =
    | 'blake2b512'
    | 'blake2s256'
    | 'md4'
    | 'md5'
    | 'md5-sha1'
    | 'mdc2'
    | 'ripemd160'
    | 'sha1'
    | 'sha224'
    | 'sha256'
    | 'sha3-224'
    | 'sha3-256'
    | 'sha3-384'
    | 'sha3-512'
    | 'sha384'
    | 'sha512'
    | 'sha512-224'
    | 'sha512-256'
    | 'sm3'
    | 'whirlpool';

interface DeriveKeyOpts {
    salt?: StringLike;
    iterations?: number;
    digest?: Digest;
}

const KEYLEN = 256 / 8; // Because we use aes-256-gcm

class StringCrypto {
    static defaultDeriveKeyOpts: DeriveKeyOpts = {
        salt: 's41t',
        iterations: 1,
        digest: 'sha512'
    };

    private _deriveKeyOptions: DeriveKeyOpts;

    constructor(options?: DeriveKeyOpts) {
        if (options) {
            this._deriveKeyOptions = options;
        }
    }

    deriveKey = (password: StringLike, options?: DeriveKeyOpts) => {
        const { salt, iterations, digest } = Object.assign(
            {},
            StringCrypto.defaultDeriveKeyOpts,
            options
        );

        return pbkdf2Sync(password, salt, iterations, KEYLEN, digest);
    };

    encryptString = (str: StringLike, password: StringLike): string => {
        const derivedKey = this.deriveKey(password, this._deriveKeyOptions);
        const randomInitVector = randomBytes(16);
        const aesCBC = createCipheriv(
            'aes-256-gcm',
            derivedKey,
            randomInitVector
        );
        let encryptedBase64 = aesCBC.update(str.toString(), 'utf8', 'base64');
        encryptedBase64 += aesCBC.final('base64');

        const encryptedHex = Buffer.from(encryptedBase64).toString('hex');
        const initVectorHex = randomInitVector.toString('hex');

        return `${initVectorHex}:${encryptedHex}`;
    };

    decryptString = (
        encryptedStr: StringLike,
        password: StringLike
    ): string => {
        const derivedKey = this.deriveKey(password, this._deriveKeyOptions);
        const encryptedParts: string[] = encryptedStr.toString().split(':');

        if (encryptedParts.length !== 2) {
            throw new Error(
                `Incorrect format for encrypted string: ${encryptedStr}`
            );
        }

        const [initVectorHex, encryptedHex] = encryptedParts;
        const randomInitVector = Buffer.from(initVectorHex, 'hex');
        const encryptedBase64 = Buffer.from(encryptedHex, 'hex').toString();
        const aesCBC = createDecipheriv(
            'aes-256-gcm',
            derivedKey,
            randomInitVector
        );
        let decrypted = aesCBC.update(encryptedBase64, 'base64');

        return decrypted.toString();
    };
}

const stringCrypto = new StringCrypto();

const { AUTH_SESSION_SECRET } = config.auth;

function addHour(date) {
    let result = new Date(date);
    result.setTime(date.getTime() + 1 * 60 * 60 * 1000);
    return result;
}

export const sign = <T extends unknown>(payload: T): string =>
    stringCrypto.encryptString(
        JSON.stringify({
            payload,
            expiresIn: addHour(new Date()).toUTCString()
        }),
        AUTH_SESSION_SECRET
    );

export const verify = <T extends unknown>(token: string): T => {
    const { payload, expiresIn } = JSON.parse(
        stringCrypto.decryptString(token, AUTH_SESSION_SECRET)
    );

    if (new Date(expiresIn).getTime() < new Date().getTime()) {
        throw new Error('Auth link has expired!');
    }

    return payload;
};
