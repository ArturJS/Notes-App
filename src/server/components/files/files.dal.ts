import { Readable } from 'stream';
import uuidV4 from 'uuid/v4';
import mimeType from 'mime-types';
import createStreamMeter from 'stream-meter';
import axios from 'axios';
import config from '~/server/common/config';
import db from '~/server/common/models';
import logger from '~/server/common/logger';
import { ErrorFileUpload, ErrorAccessDenied } from '../../common/exceptions';

type TGetFile = null | {
    id: number;
    downloadStream: Readable;
    name: string;
};

type TCreateFile = null | {
    id: number;
    downloadPath: string;
    name: string;
    size: number;
};

const { DROPBOX_TOKEN } = config.dropbox;

class FilesDAL {
    async getAll(userId: number): Promise<string[]> {
        const files = await db.files.findMany({
            where: { userId }
        });

        return files.map(({ id }) => `/api/files/${id}`);
    }

    async getById(userId: number, fileId: number): Promise<TGetFile> {
        const file = await db.files.findUnique({
            where: { id: fileId }
        });

        if (!file) {
            return null;
        }

        try {
            const { data: downloadStream } = await axios({
                method: 'POST',
                url: 'https://content.dropboxapi.com/2/files/download',
                headers: {
                    Authorization: `Bearer ${DROPBOX_TOKEN}`,
                    'Content-Type': 'text/plain',
                    'Dropbox-API-Arg': JSON.stringify({
                        path: `/users-files/${encodeURIComponent(
                            file.downloadPath
                        )}`
                    })
                },
                responseType: 'stream'
            });

            return {
                id: fileId,
                name: file.name,
                downloadStream
            };
        } catch (err) {
            logger.error(
                [
                    `Exception in FilesDAL.getById(${userId}, ${fileId})`,
                    err
                ].join('')
            );

            return null;
        }
    }

    async create(userId: number, params): Promise<TCreateFile> {
        const {
            uploadStream,
            meta
        }: {
            uploadStream: Readable;
            meta: {
                mimetype: string;
                filename: string;
            };
        } = params;
        const { filename, mimetype } = meta;
        const fileExtension = mimeType.extension(mimetype);
        const downloadPath = `${filename}-${uuidV4()}.${fileExtension}`;
        const streamMeter = createStreamMeter();

        try {
            await axios({
                method: 'POST',
                url: 'https://content.dropboxapi.com/2/files/upload',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    Authorization: `Bearer ${DROPBOX_TOKEN}`,
                    'Dropbox-API-Arg': JSON.stringify({
                        path: `/users-files/${encodeURIComponent(
                            downloadPath
                        )}`,
                        mode: 'add',
                        autorename: true,
                        mute: false,
                        strict_conflict: false
                    })
                },
                data: uploadStream.pipe(streamMeter)
            });
        } catch (error) {
            logger.error(
                [
                    `Exception in FilesDAL.create(${userId}, ${filename}). `,
                    error.response.data
                ].join('')
            );

            throw new ErrorFileUpload(error.response.data);
        }

        const size = streamMeter.bytes as number;

        const file = await db.files.create({
            data: {
                name: filename,
                downloadPath,
                userId,
                size
            }
        });

        return {
            id: file.id,
            downloadPath: `/api/files/${file.id}`,
            name: filename,
            size
        };
    }

    async remove(userId: number, fileId: number): Promise<void> {
        const ormQuery = {
            where: {
                id: fileId
            }
        };
        const fileToRemove = await db.files.findUnique(ormQuery);

        if (!fileToRemove) return;

        if (fileToRemove.userId !== userId) {
            throw new ErrorAccessDenied([
                `The user with userId=${userId} `,
                `does not have access to the file with id=${fileToRemove.id}`
            ]);
        }

        try {
            await axios({
                method: 'POST',
                url: 'https://api.dropboxapi.com/2/files/delete_v2',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${DROPBOX_TOKEN}`
                },
                data: {
                    path: `/users-files/${encodeURIComponent(
                        fileToRemove.downloadPath
                    )}`
                }
            });
        } catch (err) {
            logger.error(
                [
                    `Exception in FilesDAL.remove(${userId}, ${fileId})`,
                    err
                ].join('')
            );
        }

        await db.files.delete(ormQuery);
    }
}

export default new FilesDAL();
