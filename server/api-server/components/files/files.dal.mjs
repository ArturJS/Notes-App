import fs from 'fs';
import path from 'path';
import uuidV4 from 'uuid/v4';
import mimeType from 'mime-types';
import db from '../../common/models';

class FilesDAL {
    async getAll(userId) {
        const files = await db.Files.findAll({
            where: { userId }
        });

        return files.map(({ id }) => `/api/files/${id}`);
    }

    async getById(userId, fileId) {
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
                filename: file.name,
                downloadStream
            };
        } catch (err) {
            console.log(err); // todo: use logger

            return null;
        }
    }

    async create(userId, { uploadStream, meta }) {
        return new Promise(async resolve => {
            const { filename, mimetype } = meta;
            const fileExtension = mimeType.extension(mimetype);
            const downloadPath = `filename-${uuidV4()}.${fileExtension}`;
            const file = await db.Files.create({
                name: filename,
                downloadPath,
                userId
            });

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

    async remove(userId, fileId) {
        await db.Files.destroy({
            where: {
                id: fileId,
                userId
            }
        });
    }
}

export default new FilesDAL();
