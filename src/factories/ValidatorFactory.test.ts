import ValidatorFactory from './ValidatorFactory';

describe('ValidatorFactory', () => {
    test('can get validator', () => {
        let v1 = ValidatorFactory.GetValidator('number');
        expect(v1).toBeDefined();
        let v2 = ValidatorFactory.GetValidator('text');
        expect(v2).toBeDefined();
        let v3 = ValidatorFactory.GetValidator('date');
        expect(v3).toBeDefined();
        let v4 = ValidatorFactory.GetValidator('date-range');
        expect(v4).toBeDefined();
        let v5 = ValidatorFactory.GetValidator('multi-pick');
        expect(v5).toBeDefined();
        let v6 = ValidatorFactory.GetValidator('pick');
        expect(v6).toBeDefined();
    });

    test('can validate numbers', () => {
        let r1 = ValidatorFactory.GetValidator('number')(['0', '1', '2']);
        expect(r1).toBeTruthy();

        let r2 = ValidatorFactory.GetValidator('number')(['test']);
        expect(r2).toBeFalsy();

        let r3 = ValidatorFactory.GetValidator('number')(['']);
        expect(r3).toBeFalsy();
    });

    test('can validate text', () => {
        let r1 = ValidatorFactory.GetValidator('text')(['string', 'string']);
        expect(r1).toBeTruthy();

        let r2 = ValidatorFactory.GetValidator('text')(['']);
        expect(r2).toBeFalsy();
    });

    test('can validate multi-pick', () => {
        let r1 = ValidatorFactory.GetValidator('multi-pick')(['string', 'string']);
        expect(r1).toBeTruthy();

        let r2 = ValidatorFactory.GetValidator('multi-pick')(['', '', '']);
        expect(r2).toBeFalsy();
    });

    test('can validate date', () => {
        let r1 = ValidatorFactory.GetValidator('date')(['1900-01-01']);
        expect(r1).toBeTruthy();

        let r2 = ValidatorFactory.GetValidator('date')(['']);
        expect(r2).toBeFalsy();
    });

    test('can validate dates', () => {
        let r1 = ValidatorFactory.GetValidator('date-range')(['1900-01-01', '1900-01-01']);
        expect(r1).toBeTruthy();

        let r2 = ValidatorFactory.GetValidator('date-range')(['', '']);
        expect(r2).toBeFalsy();
    });
});