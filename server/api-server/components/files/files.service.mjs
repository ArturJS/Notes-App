// @flow
import { Readable } from 'stream';
import { ErrorNotFound } from '../../common/exceptions';
import filesDAL from './files.dal';

type TFile = {|
    id: number,
    downloadPath: string,
    filename: string
|};

type TDownloadFile = {|
    filename: string,
    downloadStream: Readable
|};

// todo: implement garbage collector for unused filed

class FilesService {
    // todo add validation
    async getAll(userId: number): Promise<string[]> {
        const filePaths: string[] = await filesDAL.getAll(userId);

        return filePaths;
    }

    async getById(userId: number, fileId: number): Promise<TDownloadFile> {
        const { filename, downloadStream } = await filesDAL.getById(
            userId,
            fileId
        );

        if (!downloadStream) {
            throw new ErrorNotFound(`File by id="${fileId}" not found!`);
        }

        return {
            filename,
            downloadStream
        };
    }

    async create(userId: number, { uploadStream, meta }): Promise<TFile> {
        const createdFile = await filesDAL.create(userId, {
            uploadStream,
            meta: {
                filename: meta.filename,
                mimetype: meta.mimetype
            }
        });

        return createdFile;
    }

    async remove(userId: number, fileId: number): Promise<void> {
        await filesDAL.remove(userId, fileId);
    }
}

export default new FilesService();
