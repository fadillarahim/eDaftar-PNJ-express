import db from "../../../../db/db.js";
const { main } = db;

const update = async (req, res, next) => {
  try {
    const { metadata } = req.body;
    const user = req.user;

    if (!metadata || !metadata.id) {
      return res.status(400).json({
        status: "error",
        message: "Data pendaftaran tidak ditemukan pada request",
      });
    }

    const isInvalid = checkMetadataValid(metadata);
    if (isInvalid) {
      return res.status(400).json({
        status: "error",
        message: "Data pendaftaran tidak valid",
      });
    }

    const findFirst = await main.masterPendaftar.findFirst({
      where: {
        id: parseInt(metadata.id),
      },
      include: {
        PendaftarRekapNilaiMap: true,
      },
    });
    if (!findFirst) {
      return res.status(400).json({
        status: "error",
        message: "Data pendaftar tidak ditemukan",
      });
    }

    const data = await main.masterPendaftar.update({
      where: {
        id: parseInt(metadata.id),
      },
      data: {
        fullName: metadata.fullName,
        idCardAddress: metadata.idCardAddress,
        currentAddress: metadata.currentAddress,
        gender: metadata.gender,
        religionId: metadata.religionId,
        maritalStatus: metadata.maritalStatus,
        citizenship: metadata.citizenship,
        isForeigner: metadata.isForeigner,
        foreignCountry: metadata.isForeigner === true ? metadata.foreignCountry : null,
        bornAbroad: metadata.bornAbroad,
        birthProvinceId: metadata.bornAbroad === false ? metadata.birthProvinceId : null,
        birthProvinceName: metadata.bornAbroad === false ? metadata.birthProvinceName : null,
        birthCityId: metadata.bornAbroad === false ? metadata.birthCityId : null,
        birthCityName: metadata.bornAbroad === false ? metadata.birthCityName : null,
        dateOfBirth: new Date(metadata.dateOfBirth),
        idCardAddress: metadata.idCardAddress,
        currentAddress: metadata.currentAddress,
        provinceIdAddress: metadata.provinceIdAddress,
        provinceNameAddress: metadata.provinceNameAddress,
        cityIdAddress: metadata.cityIdAddress,
        cityNameAddress: metadata.cityNameAddress,
        districtIdAddress: metadata.districtIdAddress,
        districtNameAddress: metadata.districtNameAddress,
        telephoneNumber: metadata.telephoneNumber,
        phoneNumber: metadata.phoneNumber,
        email: metadata.email,
        updatedBy: user.username,
      },
    });

    if (!data) {
      return res.status(400).json({
        status: "error",
        message: "Data Gagal Disimpan",
      });
    }

    if (findFirst.PendaftarRekapNilaiMap.length > 0) {
      const deleteFirst = await main.pendaftarRekapNilaiMap.deleteMany({
        where: {
          pendaftarId: parseInt(metadata.id),
        },
      });

      if (!deleteFirst) {
        return res.status(400).json({
          status: "error",
          message: "Penghapusan Rekap Nilai Gagal",
        });
      }
    }

    const dataRekapNilai = await main.pendaftarRekapNilaiMap.create({
      data: {
        pendaftarId: parseInt(metadata.id),
        createdBy: user.username,
        updatedBy: user.username,
        matematika: metadata.matematika,
        bahasaInggris: metadata.bahasaInggris,
        ipa: metadata.ipa,
        ips: metadata.ips,
        bahasaIndonesia: metadata.bahasaIndonesia,
        agama: metadata.agama,
      }
    })

    if (!dataRekapNilai) {
      return res.status(400).json({
        status: "error",
        message: "Data rekap nilai gagal Disimpan",
      });
    }

    const updateStatusPendaftar = await main.masterPendaftar.update({
      where: {
        id: parseInt(metadata.id),
      },
      data: {
        status: "SELESAI",
      }
    })
    if (!updateStatusPendaftar) {
      return res.status(400).json({
        status: "error",
        message: "Gagal Update Status Pendaftaran",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Data Berhasil Disimpan",
      data: data,
    })

  } catch (error) {
    next(error);
  }
};

const checkMetadataValid = (metadata) => {
  const isValid =
    !metadata.nationalIdNumber ||
    !metadata.fullName ||
    !metadata.gender ||
    !metadata.religionId ||
    !metadata.maritalStatus ||
    !metadata.citizenship ||
    (metadata.isForeigner &&
      (!metadata.foreignCountry || metadata.foreignCountry === "")) ||
    (metadata.bornAbroad &&
      (!metadata.birthCountry || metadata.birthCountry === "")) ||
    (!metadata.bornAbroad &&
      (!metadata.birthProvinceId ||
        metadata.birthProvinceId === "" ||
        !metadata.birthCityId ||
        metadata.birthCityId === "")) ||
    !metadata.dateOfBirth ||
    !metadata.idCardAddress ||
    !metadata.currentAddress ||
    !metadata.provinceIdAddress ||
    metadata.provinceIdAddress === "" ||
    !metadata.cityIdAddress ||
    metadata.cityIdAddress === "" ||
    !metadata.districtIdAddress ||
    metadata.districtIdAddress === "" ||
    !metadata.telephoneNumber ||
    !metadata.phoneNumber ||
    !metadata.email ||
    !metadata.matematika ||
    !metadata.bahasaInggris ||
    !metadata.bahasaIndonesia ||
    !metadata.ipa ||
    !metadata.ips ||
    !metadata.agama;

  return isValid;
};

export default { update };
