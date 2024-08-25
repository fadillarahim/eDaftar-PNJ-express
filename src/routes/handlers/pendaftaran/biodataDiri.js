import db from "../../../../db/db.js";
const { main } = db;
import config from "../../../../config/config.js";
import axios from "axios";


const indexDetail = async (req, res, next) => {
  try {
    const {nationalIdNumber} = req.params;
    if(!nationalIdNumber){
      return res.status(400).json({
        status: "error",
        message: "Nik pendaftaran tidak ditemukan pada request",
      })
    }
    const datas = await main.masterPendaftar.findFirst({
      where:{
        nationalIdNumber: nationalIdNumber
      },
      include:{
        MasterReligion: true,
        PendaftarRekapNilaiMap: true,
      }
    })
    if(!datas){
      return res.status(200).json({
        status: "success",
        message: "User Belum melakukan pendaftaran",
        data: {
          pendaftaran: false
        }
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

const indexProvinsi = async (req, res, next) => {
  try {
    const apiUrl =
      "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json";
    const configuration = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.get(apiUrl, configuration);

    return res.status(200).json({
      status: "success",
      message: "Data Provinsi ditemukan",
      data: response.data,
    });
  } catch (error) {
    // Menangani error dari permintaan Axios
    if (error.response) {
      return res.status(400).json({
        status: "error",
        message: "Gagal mendapatkan data dari API eksternal",
        error: error.response.data,
      });
    } else if (error.request) {
      return res.status(500).json({
        status: "error",
        message: "Tidak ada respons dari API eksternal",
      });
    } else {
      // Menangani error lainnya
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan dalam memproses permintaan",
      });
    }
  }
};

const indexKabupatenKota = async (req, res, next) => {
  try {
    const { province_id } = req.params;
    if(!province_id){
      return res.status(400).json({
        status: "error",
        message: "Data provinsi tidak ditemukan",
      })
    }
    const apiUrl = `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province_id}.json`;
    const configuration = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.get(apiUrl, configuration);

    return res.status(200).json({
      status: "success",
      message: "Data Kabupaten ditemukan",
      data: response.data,
    });
  } catch (error) {
    // Menangani error dari permintaan Axios
    if (error.response) {
      return res.status(400).json({
        status: "error",
        message: "Gagal mendapatkan data dari API eksternal",
        error: error.response.data,
      });
    } else if (error.request) {
      return res.status(500).json({
        status: "error",
        message: "Tidak ada respons dari API eksternal",
      });
    } else {
      // Menangani error lainnya
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan dalam memproses permintaan",
      });
    }
  }
};

const indexKecamatan = async (req, res, next) => {
  try {
    const { regency_id } = req.params;
    if(!regency_id){
      return res.status(400).json({
        status: "error",
        message: "Data kabupaten tidak ditemukan",
      })
    }

    const apiUrl = `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regency_id}.json`;
    const configuration = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.get(apiUrl, configuration);

    return res.status(200).json({
      status: "success",
      message: "Data Kecamatan ditemukan",
      data: response.data,
    });
  } catch (error) {
    // Menangani error dari permintaan Axios
    if (error.response) {
      return res.status(400).json({
        status: "error",
        message: "Gagal mendapatkan data dari API eksternal",
        error: error.response.data,
      });
    } else if (error.request) {
      return res.status(500).json({
        status: "error",
        message: "Tidak ada respons dari API eksternal",
      });
    } else {
      // Menangani error lainnya
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan dalam memproses permintaan",
      });
    }
  }
};

const createPendaftar = async (req, res, next) => {
  try {
    const {metadata} = req.body;
    const user = req.user;
    if(!metadata){
      return res.status(400).json({
        status: "error",
        message: "Data pendaftaran tidak ditemukan pada request"
      })
    }
    const isInvalid = checkMetadataValid(metadata);
    console.log(isInvalid);
    if(isInvalid){
      return res.status(400).json({
        status: "error",
        message: "Data pendaftaran tidak valid"
      })
    }
    const checkPendaftar = await main.masterPendaftar.findFirst({
      where :{
        nationalIdNumber : metadata.nationalIdNumber
      }
    })
    if(checkPendaftar){
      return res.status(400).json({
        status: "error",
        message: "Data pendaftar sudah ada"
      })
    }

    metadata.dateOfBirth = new Date(metadata.dateOfBirth);

    const datas = await main.masterPendaftar.create({
      data:{
        createdBy: user.username,
        updatedBy: user.username,
        ...metadata,
      }
    })
    if(!datas){
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
}



const checkMetadataValid = (metadata) => {
  const isValid = !metadata.nationalIdNumber  ||
  !metadata.fullName ||
  !metadata.gender ||
  !metadata.religionId ||
  !metadata.maritalStatus ||
  !metadata.citizenship ||
  (metadata.isForeigner && (!metadata.foreignCountry || metadata.foreignCountry === "")) ||
  (metadata.bornAbroad && (!metadata.birthCountry || metadata.birthCountry === "")) ||
  (!metadata.bornAbroad && (!metadata.birthProvinceId || metadata.birthProvinceId === "" ||
  !metadata.birthCityId || metadata.birthCityId === "")) ||
  !metadata.dateOfBirth || 
  !metadata.idCardAddress ||
  !metadata.currentAddress ||
  !metadata.provinceIdAddress || metadata.provinceIdAddress === "" ||
  !metadata.cityIdAddress || metadata.cityIdAddress === "" ||
  !metadata.districtIdAddress || metadata.districtIdAddress === "" ||
  !metadata.telephoneNumber  ||
  !metadata.phoneNumber  ||
  !metadata.email ;

  return isValid;
}
  

export default { indexDetail, indexProvinsi, indexKabupatenKota, indexKecamatan, createPendaftar };
