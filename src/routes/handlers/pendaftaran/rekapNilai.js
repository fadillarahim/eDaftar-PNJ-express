import db from "../../../../db/db.js";
const { main } = db;

const create = async (req, res, next) => {
  try {
    const { metadata } = req.body;
    const user = req.user;
    if (!metadata) {
      return res.status(400).json({
        status: "error",
        message: "Data Rekap Nilai pendaftaran tidak valid",
      });
    }

    const findPendaftar = await main.masterPendaftar.findFirst({
      where: {
        id: parseInt(metadata.pendaftarId),
      },
    });

    if (!findPendaftar) {
      return res.status(400).json({
        status: "error",
        message: "Data Pendaftaran tidak ditemukan",
      });
    }

    const datas = await main.pendaftarRekapNilaiMap.create({
      data: {
        ...metadata,
        createdBy: user.username,
        updatedBy: user.username,

      },
    });

    if(!datas){
      return res.status(400).json({
        status: "error",
        message: "Data Gagal Disimpan"
      })
    }
    const updatePendaftar = await main.masterPendaftar.update({
      where:{
        id: parseInt(metadata.pendaftarId)
      },
      data:{
        status: "SELESAI",
      }
    })
    if(!updatePendaftar){
      return res.status(400).json({
        status: "error",
        message: "Data Gagal Disimpan"
      })
    }
    return res.status(200).json({
      status: "success",
      message: "Data Berhasil Disimpan",
      data: datas
    });
  } catch (error) {
    next(error);
  }
};

export default { create };
