// add the userHeader to the request body
export default function userMiddleware(req, res, next) {
  const userData = JSON.parse(req.headers['x-user']);
  req.body.userData = userData;
  next();
}
