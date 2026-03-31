export const asyncHandler = (fn) => (req, res, next, err) =>
  Promise.resolve(fn(req, res, next, err)).catch((err) => next(err));
