var express = require('express');
var router = express.Router();

let expressions = [
  {
    id: 1,
    name: 'Logic',
    operator: 'And',
    operands: [
      {
        name: 'Compare',
        attrId: '11001',
        attrCaption: 'First Name',
        operator: 'Equal',
        operands: ['Jian']
      },
      {
        name: 'Compare',
        attrId: '11003',
        attrCaption: 'Gender',
        operator: 'NotEqual',
        operands: ['GD_MALE']
      },
      {
        name: 'Compare',
        attrId: '11004',
        attrCaption: 'Birthday',
        operator: 'Equal',
        operands: ['2011-12-12']
      }
    ]
  }
]

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.send('respond with a resource');
  res.json(expressions);
});


router.get('/:id', function (req, res, next) {
  console.log(req.params.id);
  res.json(expressions.find(x => x.id === req.params.id));

});

module.exports = router;
