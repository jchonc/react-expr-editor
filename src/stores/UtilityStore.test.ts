import utilityStore, { UtilityStore } from './UtilityStore';
describe('Store test', function () {
    test('instanceof', () => {
        expect(utilityStore).toBeInstanceOf(UtilityStore);
    });

    test('initial state', () => {
        expect(utilityStore.tasks).toBe(0);
        expect(utilityStore.isBusy).toBe(false);
        expect(utilityStore.isEmpty).toBe(true);
    });
});
