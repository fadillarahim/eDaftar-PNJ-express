import jwt from "jsonwebtoken";
import config from "../../../config/config.js";
import db from "../../../db/db.js";

const { main } = db;

export default async (req, res, next) => {
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
      return res.status(404).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }
    let userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      nationalIdNumber: user.nationalIdNumber,
      role: user.masterRole.name,
      isAdmin: user.masterRole.isAdmin,
      permission: user.masterRole.RolePermissionMap.map((permission) => permission.MasterPermission?.name)
    };

    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Token tidak valid",
    });
  }
};
