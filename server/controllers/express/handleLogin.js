require("dotenv").config();
const { jwtVerify, getJwt } = require('../jwt/jwtAuth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleLogin = async (req, res) => {
  const token = getJwt(req);

  if (!token) {
    res.json({ loggedIn: false });
    return;
  }

  try {
    const decoded = await jwtVerify(token, process.env.JWT_SECRET);
    const potentialUser = await prisma.users.findUnique({
      where: {
        username: decoded.username,
      },
      select: {
        username: true,
      },
    });

    if (!potentialUser) {
      res.json({ loggedIn: false, token: null });
      return;
    }

    res.json({ loggedIn: true, token });
  } catch (error) {
    res.json({ loggedIn: false });
  }
};

module.exports = handleLogin;
