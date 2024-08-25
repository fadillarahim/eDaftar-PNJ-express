import db from "../../../../db/db.js";
const { main } = db;

const index = async (req, res, next) => {
  try {
    const datas = await main.masterPendaftar.findMany({
      include:{
        MasterReligion: true,
        PendaftarRekapNilaiMap: true,
      }
    })
    if(!datas){
      return res.status(400).json({
        status: "error",
        message: "Data Pendaftaran tidak ditemukan",
      })
    }
    return res.status(200).json({
      status: "success",
      message: "Data Pendaftaran ditemukan",
      data: datas
    })
  } catch (error) {
    next(error);
  }
}

export default { index }