var express = require('express');
var router = express.Router();

const knownUsers = [
  { value: 'jzhou@rlsolutions.com', text: 'Jian Zhou'},
  { value: 'cmarciano@rlsolutions.com', text: 'Celso Marciano'},
  { value: 'achiarelli@rlsolutions.com', text: 'Anthony Chiarelli'},
  { value: 'pcorrea@rlsolutions.com', text: 'Pedro Correa'},
  { value: 'jpecile@rlsolutions.com', text: 'Jacob Pecile'}
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  const term = req.query.q;
  if (term) {
    const results = knownUsers.filter(function(u){
      return (u.text.search(new RegExp(term, "i")) >= 0);
    });
    res.json(results);
  }
  else {
    res.json(knownUsers);
  }
});

module.exports = router;
