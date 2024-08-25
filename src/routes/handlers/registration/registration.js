import db from "../../../../db/db.js";
const { main } = db;

const registrasiAkun = async (req, res, next) => {
  try {
    const { metadataUser } = req.body;
    if (
      !metadataUser ||
      !metadataUser.nationalIdNumber ||
      !metadataUser.username ||
      !metadataUser.email ||
      !metadataUser.password
    ) {
      return res.status(400).json({
        status: "error",
        message: "Mohon inputkan username, email dan password dengan benar",
      })
    }

    const findUser = await main.masterUser.findFirst({
      where:{
        OR:[
          {username: metadataUser.username},
          {email: metadataUser.email},
          {nationalIdNumber: metadataUser.nationalIdNumber}
        ]
      }
    })
    if(findUser) {
      return res.status(400).json({
        status: "error",
        message: "User dengan username atau email atau NIK ini sudah terdaftar",
      })
    }
    const datas = await main.masterUser.create({
      data:{
        nationalIdNumber: metadataUser.nationalIdNumber,
        username: metadataUser.username,
        email: metadataUser.email,
        password: metadataUser.password,
        roleId: 2,
        createdBy: "REGISTRATION",
        updatedBy: "REGISTRATION"
      }
    })

    if(!datas){
      return res.status(400).json({
        status: "error",
        message: "Registrasi Akun gagal",
      })
    }
    return res.status(200).json({
      status: "success",
      message: "Registrasi Akun Berhasil",
      data: datas
    })
  } catch (error) {
    next(error);
  }
};

export default{
  registrasiAkun,
}
