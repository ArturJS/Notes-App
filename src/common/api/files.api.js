import { baseApi } from './base.api';

export const filesApi = {
    async create(file, params = {}) {
        const formData = new FormData();

        formData.append('files', file);

        const { data: fileData } = await baseApi.ajax({
            method: 'post',
            url: '/files',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData,
            onUploadProgress: ({ total, loaded }) => {
                const progressInPercentage = 100 * loaded / total;

                if (typeof params.onUploadProgress === 'function') {
                    params.onUploadProgress(progressInPercentage);
                }

                // todo pass "progressInPercentage" to progress bar
                // eslint-disable-next-line no-console
                console.log(progressInPercentage);
            },
            provideCancel: params.provideCancel
        });

        if (!fileData) {
            return null;
        }

        return {
            id: fileData.id,
            downloadPath: fileData.downloadPath,
            name: fileData.filename,
            size: fileData.size
        };
    },

    async remove(id) {
        await baseApi.ajax({
            method: 'delete',
            url: `/files/${id}`
        });
    }
};
