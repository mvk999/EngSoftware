// middlewares/errorBoundary.js
export default function errorBoundary(handler) {
    return async function (req, res, next) {
        try {
            await handler(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}
