import expressionStore, { ExpressionStore } from './ExpressionStore';
describe('Store test', function () {
    test('instanceof', () => {
        expect(expressionStore).toBeInstanceOf(ExpressionStore);
    });

    test('initial state', () => {
        expect(expressionStore.entityName).toBeUndefined();
        expect(expressionStore.moduleId).toBeUndefined();
    });

    test('can set expression with valid json', () => {
        expressionStore.setExpression({ name: 'logic' });
        expect(expressionStore.expression).toBeDefined();

        expressionStore.setExpression({ });
        expect(expressionStore.expression).toBeNull();

    });
});
