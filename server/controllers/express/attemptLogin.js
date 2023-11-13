const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSign } = require("../jwt/jwtAuth");
require("dotenv").config();

const attemptLogin = async (req, res) => {
  const potentialLogin = await prisma.users.findUnique({
    where: {
      username: req.body.username,
    },
    select: {
      id: true,
      username: true,
      passhash: true,
      userid: true,
    },
  });

  if (potentialLogin) {
    const isSamePass = await bcrypt.compare(
      req.body.password,
      potentialLogin.passhash
    );
    if (isSamePass) {
      jwtSign(
        {
          username: req.body.username,
          id: potentialLogin.id,
          userid: potentialLogin.userid,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )
        .then(token => {
          res.json({ loggedIn: true, token });
        })
        .catch(err => {
          console.log(err);
          res.json({ loggedIn: false, status: 'Try again later' });
        });
    } else {
      res.json({ loggedIn: false, status: 'Wrong username or password!' });
      console.log('wrong pass');
    }
  } else {
    console.log('not good');
    res.json({ loggedIn: false, status: 'Wrong username or password!' });
  }
};

module.exports = attemptLogin;
