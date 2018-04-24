// @flow
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { promisify } from 'util';
import uuidV4 from 'uuid/v4';
import mimeType from 'mime-types';
import db from '../../common/models';

const fsUnlinkAsync = promisify(fs.unlink);

type TGetFile = null | {|
    id: number,
    downloadStream: Readable,
    filename: string
|};

class FilesDAL {
    async getAll(userId: number): Promise<string[]> {
        const files = await db.Files.findAll({
            where: { userId }
        });

        return files.map(({ id }) => `/api/files/${id}`);
    }

    async getById(userId: number, fileId: number): Promise<TGetFile> {
        const file = await db.Files.findOne({
            where: { id: fileId, userId }
        });

        if (!file) {
            return null;
        }

        try {
            const downloadStream = fs.createReadStream(
                path.resolve(__dirname, file.downloadPath)
            );

            return {
                id: fileId,
                filename: file.name,
                downloadStream
            };
        } catch (err) {
            console.log(err); // todo: use logger

            return null;
        }
    }

    async create(userId: number, params): Promise<TGetFile> {
        const {
            uploadStream,
            meta
        }: {
            uploadStream: Readable,
            meta: {
                mimetype: string,
                filename: string
            }
        } = params;
        const { filename, mimetype } = meta;
        const fileExtension = mimeType.extension(mimetype);
        const downloadPath = `${filename}-${uuidV4()}.${fileExtension}`;
        const file = await db.Files.create({
            name: filename,
            downloadPath,
            userId
        });

        return new Promise(resolve => {
            uploadStream
                .pipe(
                    fs.createWriteStream(path.resolve(__dirname, downloadPath))
                )
                .on('finish', () => {
                    resolve({
                        id: file.id,
                        downloadPath: `/api/files/${file.id}`,
                        filename
                    });
                });
        });
    }

    async remove(userId: number, fileId: number): Promise<void> {
        const ormQuery = {
            where: {
                id: fileId,
                userId
            }
        };
        const fileToRemove = await db.Files.findOne(ormQuery);

        await fsUnlinkAsync(path.resolve(__dirname, fileToRemove.downloadPath));
        await db.Files.destroy(ormQuery);
    }
}

export default new FilesDAL();
