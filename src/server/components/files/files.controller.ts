import _ from 'lodash';
import asyncBusboy from 'async-busboy';
import logger from '~/server/common/logger';
import filesService, { TFile } from './files.service';

const getUserId = ctx => _.get(ctx, 'session.passport.user.id');
const uploadFile = async ctx => {
    const userId = getUserId(ctx);
    const uploadOnlyFirstFile = _.once(async ({ file, filename, mimetype }) => {
        const createdFile = await filesService.create(userId, {
            uploadStream: file,
            meta: {
                filename,
                mimetype
            }
        });

        return createdFile;
    });

    return new Promise<TFile>(async resolve => {
        const busboyData = await asyncBusboy(ctx.req, {
            onFile: async (fieldName, file, filename, encoding, mimetype) => {
                const createdFile = await uploadOnlyFirstFile({
                    file,
                    filename,
                    mimetype
                });

                resolve(createdFile);
            }
        });

        logger.info(`busboyData ${busboyData}`);
    });
};

class FilesController {
    async getAll(ctx) {
        const userId = getUserId(ctx);
        const filePaths = await filesService.getAll(userId);

        ctx.body = filePaths;
    }

    async getById(ctx) {
        const userId = getUserId(ctx);
        const fileId = +ctx.params.id;
        const { filename, downloadStream } = await filesService.getById(
            userId,
            fileId
        );

        ctx.set({
            'Content-Type': 'application/force-download',
            'Content-disposition': `attachment; filename=${encodeURIComponent(
                filename
            )}`
        });
        ctx.body = downloadStream;
    }

    async create(ctx) {
        const createdFile = await uploadFile(ctx);

        ctx.body = {
            id: createdFile.id,
            downloadPath: createdFile.downloadPath,
            filename: createdFile.filename,
            size: createdFile.size
        };
    }

    async remove(ctx) {
        const fileId = +ctx.params.id;
        const userId = getUserId(ctx);

        await filesService.remove(userId, fileId);

        ctx.body = 0;
    }
}

export default new FilesController();
