import db from "../../../../db/db.js";
const { main } = db;

const index = async (req, res, next) => {
  try {
    const data = await main.masterRole.findMany({
      include: {
        RolePermissionMap: {
          include: {
            MasterPermission: true
          }
        }
      }
    });

    if (!data) {
      return res.status(400).json({
        status: "error",
        message: "Data Role tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Data Role ditemukan",
      data: data,
    })
  } catch (error) {
    next(error);
  }
}

export default { index }