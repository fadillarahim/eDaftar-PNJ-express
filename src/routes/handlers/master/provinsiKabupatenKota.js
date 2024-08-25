import db from "../../../../db/db.js";
const { main } = db;

const index = async (req, res, next) => {
  try {
    const {provinsiId} = req.params;
    if(!provinsiId){
      return res.status(400).json({
        status: "error",
        message: "Id Provinsi tidak ditemukan pada URL",
      })
    }
    const datas = await main.masterProvinsi.findMany({
      where:{
        id: parseInt(provinsiId)
      },
      include:{
        MasterKabupatenKota: true,
      }
    });

    if(!datas){
      return res.status(400).json({
        status: "error",
        message: "Data Provinsi tidak ditemukan",
      })
    }

    return res.status(200).json({
      status: "success",
      message: "Data Provinsi ditemukan",
      data: datas
    })
  } catch (error) {
    next(error);
  }
}

export default {index}