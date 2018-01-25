var express = require('express');
var router = express.Router();

const knownPickLists = [{
    listName: 'Gender',
    items: [
        { value: 'GD_MALE', label: 'Male', description: 'Gentleman' },
        { value: 'GD_FEMALE', label: 'Female', description: 'Lady' },
        { value: 'GD_LONG', label: 'This is a reaaaaaaaaaaally long option', description: 'long' }
    ]
}];

router.get('/', function (req, res, next) {
    // res.send('respond with a resource');
    res.json(knownPickLists);
});

router.post('/', function (req, res, next) {
    let listNames = req.body;
    const results = knownPickLists.filter(function (list) {
        return listNames.indexOf(list.listName) >= 0;
    });
    res.json(results);
});

router.get('/:listName', function (req, res, next) {
    console.log(req.params.listName);
    const m = knownPickLists.find(x => x.listName == req.params.listName);
    if (m) {
        return res.json(m);
    }
    res.status(404);
    res.send('not found');
});

module.exports = router;
