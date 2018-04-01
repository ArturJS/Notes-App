export const withAuth = async (ctx, next) => {
    console.log('ctx.isAuthenticated()', ctx.isAuthenticated());
    return next();
};
