import utilityStore, { UtilityStore } from './UtilityStore';
import mockUtilityApi from '../utils/mockApi';

describe('Utility Store Test', function () {

    beforeAll( async (done) => {
        mockUtilityApi();
        done();
    });

    test('instanceof', () => {
        expect(utilityStore).toBeInstanceOf(UtilityStore);
    });

    test('initial state', () => {
        expect(utilityStore.tasks).toBe(0);
        expect(utilityStore.isBusy).toBe(false);
        expect(utilityStore.isPicklistsEmpty).toBe(true);
        expect(utilityStore.isDictionaryEmpty).toBe(true);
        expect(utilityStore.dictionary).toBeInstanceOf(Array);
        expect(utilityStore.picklists).toBeInstanceOf(Array);
        expect(utilityStore.usedLists).toBeDefined();
    });

    test('can fetch dictionary', async () => {
        expect(utilityStore.tasks).toBe(0);
        await utilityStore.fetchDictionary(1, 'patient');
        expect(utilityStore.dictionary).toHaveLength(6);
        expect(utilityStore.isBusy).toBe(false);
    });

    test('can fetch picklists', async () => {
        await utilityStore.fetchPicklists(['Gender']);
        expect(utilityStore.picklists).toHaveLength(1);
    });
});
