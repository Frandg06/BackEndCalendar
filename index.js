const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors')
require('dotenv').config();

// Crear app express
const app = express();

//DB
dbConnection();

//cors
app.use(cors())

// directorio publico 
app.use( express.static('public') )

// Lectura y parseo del body

app.use(express.json());



// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))


//Escuchar poeticiones

app.listen( process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`)
})