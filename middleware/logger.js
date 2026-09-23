export default function logger(req, res, next) {

  console.log({
    method: req.method,
    url: req.url,
    date: new Date()
  });

  next();

}
