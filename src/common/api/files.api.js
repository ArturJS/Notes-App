import { baseApi } from './base.api';

export const filesApi = {
    async create(file) {
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

                // todo pass "progressInPercentage" to progress bar
                console.log(progressInPercentage);
            }
        });

        return {
            id: fileData.id,
            downloadPath: fileData.downloadPath,
            filename: fileData.filename
        };
    },

    async remove(id) {
        await baseApi.ajax({
            method: 'delete',
            url: `/files/${id}`
        });
    }
};
