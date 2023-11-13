const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { jwtSign } = require("../jwt/jwtAuth");

const attemptRegister = async (req, res) => {
  console.log('attemptRegister');
  const existingUser = await prisma.users.findUnique({
    where: {
      username: req.body.username,
    },
  });

  if (!existingUser) {
    // register
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await prisma.users.create({
      data: {
        username: req.body.username,
        passhash: hashedPass,
        userid: uuidv4(),
      },
      select: {
        id: true,
        username: true,
        userid: true,
      },
    });

    jwtSign(
      {
        username: req.body.username,
        id: newUserQuery.id,
        userid: newUserQuery.userid,
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
    res.json({ loggedIn: false, status: 'Username taken' });
  }
};

module.exports = attemptRegister;
