import express from "express";

import login from "./handlers/login/login.js";
import registration from "./handlers/registration/registration.js";
import getMe from "./utils/getMe.js";
import getAgama from "./utils/getAgama.js";
import checkToken from "./middleware/checkToken.js";
import user from "./handlers/master/user.js";
import role from "./handlers/master/role.js";
import biodataDiri from "./handlers/pendaftaran/biodataDiri.js";
import rekapNilai from "./handlers/pendaftaran/rekapNilai.js";
import daftarPendaftar from "./handlers/pendaftaran/daftarPendaftar.js";
import detailPendaftar from "./handlers/pendaftaran/detailPendaftar.js";
const router = express.Router();

// login
router.post("/login", login.userLoggedIn);
router.post("/registrasi-akun", registration.registrasiAkun);
router.get("/user/me", checkToken, getMe.getMe);

// master
router.get("/master/user", checkToken, user.index);
router.post("/master/user", checkToken, user.create);
router.patch("/master/user", checkToken, user.update);
router.delete("/master/user", checkToken, user.drop);

router.get("/master/role", checkToken, role.index);

// pendaftaran
router.get("/pendaftaran/list-pendaftar", checkToken, daftarPendaftar.index);
router.delete("/pendaftaran/list-pendaftar", checkToken, daftarPendaftar.drop);
router.patch("/pendaftaran/list-pendaftar", checkToken, detailPendaftar.update);

router.get("/pendaftaran/provinsi", checkToken, biodataDiri.indexProvinsi);
router.get(
  "/pendaftaran/kabupaten-kota/:province_id",
  checkToken,
  biodataDiri.indexKabupatenKota
);
router.get(
  "/pendaftaran/kecamatan/:regency_id",
  checkToken,
  biodataDiri.indexKecamatan
);
router.get("/pendaftaran/agama", checkToken, getAgama.getAgama);

router.post(
  "/pendaftaran/biodata-diri/",
  checkToken,
  biodataDiri.createPendaftar
);

router.post("/pendaftaran/rekap-nilai/", checkToken, rekapNilai.create);

router.get(
  "/pendaftaran/detail/:nationalIdNumber",
  checkToken,
  biodataDiri.indexDetail
);

export default router;
