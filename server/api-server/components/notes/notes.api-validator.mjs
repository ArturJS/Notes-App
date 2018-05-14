import joi from 'joi';
import { createApiValidator } from '../../common/utils/validation.utils';
import { REORDERING_TYPES } from './notes.enums';

const reorderingTypes = Object.values(REORDERING_TYPES);
const noteEssentialSchema = {
    title: joi.string().required(),
    description: joi.string().required(),
    files: joi
        .array()
        .items(
            joi.object({
                id: joi.number().required(),
                downloadPath: joi.string().required(),
                name: joi.string().required()
            })
        )
        .required()
};

class NotesApiValidator {
    getById = createApiValidator([
        {
            path: 'params',
            schema: joi
                .object({
                    id: joi.number().required()
                })
                .required()
        }
    ]);

    create = createApiValidator([
        {
            path: 'request.body',
            schema: joi.object(noteEssentialSchema).required()
        }
    ]);

    update = createApiValidator([
        {
            path: 'request.body',
            schema: joi
                .object({
                    id: joi.number().required(),
                    ...noteEssentialSchema
                })
                .required()
        }
    ]);

    reorder = createApiValidator([
        {
            path: 'request.body',
            schema: joi
                .object({
                    userId: joi.number().required(),
                    noteId: joi.number().required(),
                    reorderingType: joi
                        .string()
                        .allow(reorderingTypes)
                        .required(),
                    anchorNoteId: joi.number().required()
                })
                .required()
        }
    ]);

    remove = createApiValidator([
        {
            path: 'params',
            schema: joi
                .object({
                    id: joi.number().required()
                })
                .required()
        }
    ]);
}

export default new NotesApiValidator();
