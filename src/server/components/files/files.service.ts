import { Readable } from 'stream';
import { ErrorNotFound } from '~/server/common/exceptions';
import filesDAL from './files.dal';

export type TFile = {
    id: number;
    downloadPath: string;
    name: string;
    size: number;
};

type TDownloadFile = {
    name: string;
    downloadStream: Readable;
};

// todo: implement garbage collector for unused filed

class FilesService {
    // todo add validation
    async getAll(userId: number): Promise<string[]> {
        const filePaths = await filesDAL.getAll(userId);

        return filePaths;
    }

    async getById(userId: number, fileId: number): Promise<TDownloadFile> {
        const fileData = await filesDAL.getById(userId, fileId);

        if (!fileData || !fileData.downloadStream) {
            throw new ErrorNotFound(`File by id="${fileId}" not found!`);
        }

        const { name, downloadStream } = fileData;

        return {
            name,
            downloadStream
        };
    }

    async create(userId: number, { uploadStream, meta }): Promise<TFile> {
        const createdFile = await filesDAL.create(userId, {
            uploadStream,
            meta
        });

        return createdFile;
    }

    async remove(userId: number, fileId: number): Promise<void> {
        await filesDAL.remove(userId, fileId);
    }
}

export default new FilesService();
