class NotesApiValidator {
    async getById(ctx, next) {
        ctx
            .validateParam('id')
            .required()
            .isNumeric('Url param `id` must be a numeric value');

        return next();
    }

    // async create(ctx) {}

    // async update(ctx) {}

    // async reorder(ctx) {}

    // async remove(ctx) {}
}

export default new NotesApiValidator();
