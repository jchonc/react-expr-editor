import { ExpressionStore } from './ExpressionStore';
import mock, { mockApi } from '../utils/mockApi';

describe('Store test', function () {

    let store: ExpressionStore;

    beforeAll(async (done) => {
        await mock();
        done();
    });

    beforeEach(() => {
        store = new ExpressionStore();
    });

    test('instanceof', () => {
        expect(store).toBeInstanceOf(ExpressionStore);
    });

    test('initial state', () => {
        expect(store.entityName).toBeUndefined();
        expect(store.moduleId).toBeUndefined();
    });

    test('can set expression with valid json', () => {
        store.setExpression({ name: 'logic' });
        expect(store.expression).toBeDefined();
        store.setExpression({});
        expect(store.expression).toBeNull();
    });

    test('can clear expression ', () => {
        store.setExpression({ name: 'logic' });
        expect(store.expression).toBeDefined();
        store.clear();
        expect(store.expression).toBeDefined();
        store.entityName = 'patient';
        store.moduleId = 1;
        store.clear();
        expect(mockApi).toBeCalled();
    });

    test('can get meta', () => {
        store.entityName = 'patient';
        store.moduleId = 1;
        let meta = store.getMeta('11001');
        expect(meta !== null);
    });
});
