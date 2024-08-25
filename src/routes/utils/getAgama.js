import db from "../../../db/db.js";


const { main } = db;


const getAgama = async (req, res, next) => {
  try {
    const datas = await main.masterReligion.findMany();
    if(!datas){
      return res.status(400).json({
        status: "error",
        message: "Data Agama tidak ditemukan",
      })
    }
    return res.status(200).json({
      status: "success",
      message: "Data Agama ditemukan",
      data: datas
    })
  } catch (error) {
    next(error);
  }
}

export default { getAgama }