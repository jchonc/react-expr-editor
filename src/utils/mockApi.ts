export const mockApi = jest.fn().mockImplementation((...args) => {
    let [url] = args;
    let result: any;
    if (url.toString() === '/picklists') {
        result = [{
            listName: 'Gender',
            items: [
                { value: 'GD_MALE', label: 'Male', description: 'Gentleman' },
                { value: 'GD_FEMALE', label: 'Female', description: 'Lady' }
            ]
        }];
    }
    else if (url.toString() === '/dictionary/1/patient') {
        result = [{
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
        }, {
            attrId: '11006',
            attrCaption: 'Age',
            attrDataType: 'number',
            attrCtrlType: 'number',
            attrCtrlParams: ''
        }];
    }
    else if (url.startsWith('/lookups/users')) {
        const knownUsers = [
            { value: 'jzhou@rlsolutions.com', text: 'Jian Zhou' },
            { value: 'cmarciano@rlsolutions.com', text: 'Celso Marciano' },
            { value: 'achiarelli@rlsolutions.com', text: 'Anthony Chiarelli' },
            { value: 'pcorrea@rlsolutions.com', text: 'Pedro Correa' },
            { value: 'jpecile@rlsolutions.com', text: 'Jacob Pecile' }
        ];
        const matches = url.match(/\/lookups\/users?q=([^=]*)/);
        if (matches && matches.length && matches.length === 2) {
            const term = matches[1];
            result = knownUsers.filter(function (u: any) {
                return (u.text.search(new RegExp(term, 'i')) >= 0);
            });
        }
        else {
            result = knownUsers;
        }
    }

    var p = new Promise((resolve, reject) => {
        resolve({
            ok: true,
            Id: '123',
            json: function () {
                return result;
            }
        });
    });

    return p;
});

export default function () {
    (global as any).fetch = mockApi;
}
