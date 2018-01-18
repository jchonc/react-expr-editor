var express = require('express');
var router = express.Router();

let dictionary = [
    {
        module: 1,
        name: 'pandora',
        entities: [{
            name: 'patient',
            attributes: [{
                attrId: '11001',
                attrCaption: 'First Name',
                attrDataType: 'string',
                attrCtrlType: 'text',
                attrCtrlParams: ''
            }, {
                attrId: '11002',
                attrCaption: 'Last Name',
                attrDataType: 'string',
                attrCtrlType: 'text',
                attrCtrlParams: ''
            }, {
                attrId: '11003',
                attrCaption: 'Gender',
                attrDataType: 'string',
                attrCtrlType: 'picklist',
                attrCtrlParams: 'Gender'
            }, {
                attrId: '11004',
                attrCaption: 'Birthday',
                attrDataType: 'date',
                attrCtrlType: 'date',
                attrCtrlParams: ''
            }, {
                attrId: '11005',
                attrCaption: 'Owner',
                attrDataType: 'user',
                attrCtrlType: 'lookup',
                attrCtrlParams: 'users'
            }]
        }]
    }
]

router.get('/', function (req, res, next) {
    // res.send('respond with a resource');
    res.json(dictionary);
});

router.get('/:mid/:ename', function (req, res, next) {
    console.log(req.params.mid + '/' + req.params.ename);
    const m = dictionary.find(x => x.module == req.params.mid);
    if (m) {
        const entity = m.entities.find(e => e.name == req.params.ename);
        if (entity) {
            return res.json(entity.attributes);
        }
    }
    res.status(404);
    res.send('not found');
});

module.exports = router;
