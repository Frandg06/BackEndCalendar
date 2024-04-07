const {response} = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) =>{

  //x-token

  const token = req.header('x-token');

  if(!token){
    return res.status(401),json({
      ok:false,
      msg: 'No hay token en la peticion',
    })
  }

  try {
    
    const {uid, name }= jwt.verify(
      token,
      process.env.JWT_TOKEN
    )

    req.uid = uid;
    req.name = name;

  } catch (error) {
    return res.status(401),json({
      ok:false,
      msg: 'Token no valido',
    })
  }

  next();


}

module.exports ={
  validateJWT
}