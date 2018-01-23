import expressionStore, { ExpressionStore } from './ExpressionStore';
describe('Store test', function () {
    test('instanceof', () => {
        expect(expressionStore).toBeInstanceOf(ExpressionStore);
    });

    test('initial state', () => {
        expect(expressionStore.entityName).toBeUndefined();
        expect(expressionStore.moduleId).toBeUndefined();
        expect(expressionStore.expression).toBeUndefined();
    });
});
