export default async function restaurantMiddleware(req, res, next) {
  const { role } = req.body.userData;

  if (role === 'restaurant') {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}
