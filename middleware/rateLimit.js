const arrUser = [];

export default function RateLimit(req, res, next) {
  const ip = req.ip;
  let isUserIpInArr = arrUser.findIndex((user) => user.ip === ip);

  if (isUserIpInArr === -1) {
    arrUser.push({
      ip,
      dateMapSec: Math.floor(Date.now() / 1000),
      requestCount: 5
    })
  }

  if (arrUser[isUserIpInArr].dateMapSec < 10) {
    arrUser[isUserIpInArr].requestCount -= 1;
    if (arrUser[isUserIpInArr].requestCount === 0) {
      return res.status(429).send('Too many requests');
    }
  } else {
    arrUser[isUserIpInArr].dateMapSec = Math.floor(Date.now() / 1000);
    arrUser[isUserIpInArr].requestCount = 5;
  }

  next();
}

setInterval(() => arrUser.length = 0, 60000);
