import db from "../../../../db/db.js";
const { main } = db;

const index = async (req, res, next) => {
  try {
    const datas = await main.masterUser.findMany({
      include: {
        masterRole: true,
      },
    });
    if (!datas) {
      return res.status(400).json({
        status: "error",
        message: "Data User tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Data User ditemukan",
      data: datas,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { metadata } = req.body;
    const user = req.user;
    if (!metadata) {
      return res.status(400).json({
        status: "error",
        message: "Data User tidak ditemukan",
      });
    }
    if (
      !metadata.username ||
      !metadata.email ||
      !metadata.password ||
      !metadata.roleId
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Mohon inputkan username, email, password dan roleId dengan benar",
      });
    }

    const findUser = await main.masterUser.findFirst({
      where:{
        OR:[
          {username: metadata.username},
          {email: metadata.email}
        ]
      }
    })
    if(findUser) {
      return res.status(400).json({
        status: "error",
        message: "User dengan username atau email ini sudah terdaftar",
      })
    }
    const data = await main.masterUser.create({
      data:{
        username: metadata.username,
        email: metadata.email,
        password: metadata.password,
        roleId: metadata.roleId,
        createdBy: user.username,
        updatedBy: user.username
      }
    })

    if(!data){
      return res.status(400).json({
        status: "error",
        message: "Registrasi User gagal",
      })
    }

    return res.status(200).json({
      status: "success",
      message: "Registrasi User Berhasil",
      data: data
    })
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { metadata } = req.body;
    const user = req.user;
    if (!metadata) {
      return res.status(400).json({
        status: "error",
        message: "Data User tidak ditemukan",
      });
    }
    if (
      !metadata.id ||
      !metadata.username ||
      !metadata.email ||
      !metadata.password ||
      !metadata.roleId
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Mohon inputkan username, email, password dan roleId dengan benar",
      });
    }

    const findFirst = await main.masterUser.findFirst({
      where:{
        id: parseInt(metadata.id)
      }
    });

    if(!findFirst){
      return res.status(400).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }

    

    const data = await main.masterUser.update({
      where:{
        id: parseInt(metadata.id)
      },
      data:{
        username: metadata.username,
        email: metadata.email,
        password: metadata.password,
        roleId: metadata.roleId,
        updatedBy: user.username
      }
    })

    if(!data){
      return res.status(400).json({
        status: "error",
        message: "Pengeditan User gagal",
      })
    }

    return res.status(200).json({
      status: "success",
      message: "Pengeditan User Berhasil",
      data: data
    })
  } catch (error) {
    next(error);
  }
};

const drop = async (req, res, next) => {
  try {
    const { metadata } = req.body;
    if (!metadata || !metadata.id) {
      return res.status(400).json({
        status: "error",
        message: "Data request tidak ditemukan",
      });
    }
    const findFirst = await main.masterUser.findFirst({
      where:{
        id: parseInt(metadata.id)
      }
    });

    if(!findFirst){
      return res.status(400).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }

    const data = await main.masterUser.delete({
      where:{
        id: parseInt(metadata.id)
      }
    })
    if(!data){
      return res.status(400).json({
        status: "error",
        message: "Penghapusan User gagal",
      })
    }

    return res.status(200).json({
      status: "success",
      message: "User Berhasil dihapus",
      data: data
    })
  } catch (error) {
    next(error);
  }
}

export default{
  index,
  create,
  update,
  drop,
}
