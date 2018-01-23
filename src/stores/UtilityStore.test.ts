import utilityStore, { UtilityStore } from './UtilityStore';
describe('Store test', function () {

    beforeEach(function () {
        (global as any).fetch = jest.fn().mockImplementation((...args) => {
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
            if (url.toString() === '/dictionary/1/patient') {
                result = [
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
                ];
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

    });

    test('instanceof', () => {
        expect(utilityStore).toBeInstanceOf(UtilityStore);
    });

    test('initial state', () => {
        expect(utilityStore.tasks).toBe(0);
        expect(utilityStore.isBusy).toBe(false);
        expect(utilityStore.isPicklistsEmpty).toBe(true);
        expect(utilityStore.isDictionaryEmpty).toBe(true);
        expect(utilityStore.dictionary).toBeUndefined();
        expect(utilityStore.picklists).toBeUndefined();
        expect(utilityStore.usedLists).toBeDefined();
    });

    test('can fetch dictionary', async () => {
        expect(utilityStore.tasks).toBe(0);
        await utilityStore.fetchDictionary(1, 'patient');
        expect(utilityStore.dictionary).toHaveLength(1);
        expect(utilityStore.isBusy).toBe(false);
    });

    test('can fetch picklists', async () => {
        await utilityStore.fetchPicklists(['Gender']);
        expect(utilityStore.picklists).toHaveLength(1);
    });
});
