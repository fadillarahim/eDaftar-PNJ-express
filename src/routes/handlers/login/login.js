import db from "../../../../db/db.js";
import jwt from "jsonwebtoken";
import config from "../../../../config/config.js";
const { main } = db;

const userLoggedIn = async (req, res, next) => {
  try {
    const { metadataUser } = req.body;
    if (!metadataUser.email || !metadataUser.password) {
      return res.status(400).send({
        status: "error",
        message: "email dan Password tidak boleh kosong",
      });
    }
    if (
      typeof metadataUser.email !== "string" ||
      typeof metadataUser.password !== "string"
    ) {
      return res.status(400).send({
        status: "error",
        message: "Mohon inputkan email dan password dengan benar",
      });
    }
    const checkLogin = await main.masterUser.findFirst({
      where: {
        email: metadataUser.email,
        password: metadataUser.password,
      },
    });

    if (!checkLogin) {
      return res.status(400).send({
        status: "error",
        message: "User tidak ditemukan",
      });
    }
    const secretKey = config.jwtSecret;
    const token = jwt.sign(
      { id: checkLogin.id, username: checkLogin.username },
      secretKey,
      { expiresIn: "1h" }
    );

    return res.status(200).send({
      status: "success",
      message: "Login Berhasil",
      data: {
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};



export default {
  userLoggedIn,
};
