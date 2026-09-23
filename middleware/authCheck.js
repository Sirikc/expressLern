export default function authCheck(req, res, next) {
  if ('Authorization' in req.headers) {
    next();
  }
  return res.status(401).json({ error: 'header Authorization not found' });
}
