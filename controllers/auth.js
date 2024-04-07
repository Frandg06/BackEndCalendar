const {response} = require('express');
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generarJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {

  const {email, password } = req.body
  
  try {
    let user = await User.findOne({email:email})

    if(user){
      return res.status(400).json({
        ok: false,
        msg: 'Este usuario ya esxiste'
      })
    }
    
    user = new User(req.body);
    
    //Encriptar pass
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( password, salt );

    await user.save();

    // Generar JWT
    const token = await generarJWT( user.id, user.name );

  
    res.status(201).json({
      ok: true,
      uid : user.id,
      name: user.name,
      token
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg : error,
    })
  }

}

const loginUser = async(req, res = response) => {

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

      if(!user) {
        return res.status(400).json({
          ok: false,
          msg: 'El usuario no existe'
      });
    }

    //Confirmar los password
    const validatePassword = bcrypt.compareSync(password, user.password)

    if(!validatePassword) {
      return res.status(400).json({
        ok:false,
        msg: 'Las credenciales no son correctas pass'
      })
    }

    // Generar JWT
    const token = await generarJWT( user.id, user.name );

    res.status(201).json({
      ok: true,
      uid : user.id,
      name: user.name,
      token
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg : 'Revise la informacion enviada o hable con el admin',
    })
  }
}

const renewToken = async(req, res = response) => {
  const {uid, name} = req;
  const token = await generarJWT( uid, name );

  res.json({
    ok: true,
    token
  })
}


module.exports = {
  createUser,
  loginUser,
  renewToken
}