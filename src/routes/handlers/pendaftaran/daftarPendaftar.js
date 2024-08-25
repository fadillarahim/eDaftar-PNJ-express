import db from "../../../../db/db.js";
const { main } = db;

const index = async (req, res, next) => {
  try {
    const datas = await main.masterPendaftar.findMany({
      include: {
        MasterReligion: true,
        PendaftarRekapNilaiMap: true,
      },
    });
    for (const data of datas) {
      if (data.PendaftarRekapNilaiMap.length > 0) {
        for (const rekapNilai of data.PendaftarRekapNilaiMap) {
          const totalNilai = parseFloat(
            (rekapNilai.matematika +
              rekapNilai.bahasaIndonesia +
              rekapNilai.bahasaInggris +
              rekapNilai.ipa +
              rekapNilai.ips +
              rekapNilai.agama) /
              6
          ).toFixed(2);
          data.totalNilai = totalNilai;
        }
      } else{
        data.totalNilai = 0
      }
    }
    // Urutkan data berdasarkan totalNilai secara descending
    datas.sort((a, b) => b.totalNilai - a.totalNilai);

    if (!datas) {
      return res.status(400).json({
        status: "error",
        message: "Data Pendaftaran tidak ditemukan",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Data Pendaftaran ditemukan",
      data: datas,
    });
  } catch (error) {
    next(error);
  }
};

const drop = async (req, res, next) => {
  try {
    const {metadata} = req.body
    if(!metadata || !metadata.id){
      return res.status(400).json({
        status: "error",
        message: "Data Pendaftar tidak ditemukan di request",
      })
    }

    const findPendaftar = await main.masterPendaftar.findFirst({
      where:{
        id: parseInt(metadata.id)
      },
      include:{
        PendaftarRekapNilaiMap: true
      }
    })

    if(!findPendaftar){
      return res.status(400).json({
        status: "error",
        message: "Data Pendaftar tidak ditemukan",
      })
    }

    if(findPendaftar.PendaftarRekapNilaiMap.length > 0){
      const deleteRekapNilai = await main.pendaftarRekapNilaiMap.deleteMany({
        where:{
          pendaftarId: parseInt(metadata.id)
        }
      })
      if(!deleteRekapNilai){
        return res.status(400).json({
          status: "error",
          message: "Penghapusan Rekap Nilai Gagal",
        })
      }
    }
    const deletePendaftar = await main.masterPendaftar.delete({
      where:{
        id: parseInt(metadata.id)
      }
    })
    if(!deletePendaftar){
      return res.status(400).json({
        status: "error",
        message: "Penghapusan Pendaftar Gagal",
      })
    }

    return res.status(200).json({
      status: "success",
      message: "Pendaftar Berhasil dihapus",
    })
  } catch (error) {
    next(error);
  }
}
export default { index, drop };
