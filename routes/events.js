const {Router} = require('express');

// const {check} = require('express-validator');
const { getEvents, storeEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validateJWT } = require('../middlewares/validate-jwt');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { isDate } = require('../helpers/isDate');
const router = Router();

router.use(validateJWT);
//Todas pasan por JWT
// obtener eventos
router.get('/', getEvents);

//crear evento
router.post('/',[
  check('title', 'El titulo es obligatorio').not().isEmpty(),
  check('start', 'La fecha es obligatoria').custom( isDate ),
  check('end', 'La fecha de finalizacion es obligatoria').custom( isDate ),
  validateFields
], storeEvent);

// Actualizar evento
router.put('/:id', updateEvent);

//Borrar evento
router.delete('/:id', deleteEvent);

module.exports = router;