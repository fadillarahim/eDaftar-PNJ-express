import db from "../../../db/db.js";
import jwt from "jsonwebtoken";
import config from "../../../config/config.js";
const { main } = db;

const getMe = async (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Akses ditolak, silahkan login terlebih dahulu",
      });
    }
    const secretKey = config.jwtSecret;

    // Verifikasi token
    const decoded = jwt.verify(token, secretKey);

    // Cari user berdasarkan ID yang di-decode dari token
    const user = await main.masterUser.findFirst({
      where: {
        id: decoded.id
      },
      include: {
        masterRole: {
          include: {
            RolePermissionMap: {
              include:{
                MasterPermission: true,
              }
            },
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }
    let userData = {
      id: user.id,
      username: user.username,
      nationalIdNumber: user.nationalIdNumber,
      email: user.email,
      role: user.masterRole.name,
      isAdmin: user.masterRole.isAdmin,
      permission: user.masterRole.RolePermissionMap.map((permission) => permission.MasterPermission?.name)
    };

    // Jika user ditemukan, kirim data user sebagai respon
    return res.status(200).json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    next(error);
  }
}



export default{
  getMe
}