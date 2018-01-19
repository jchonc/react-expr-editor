import * as React from 'react';
import ExpressionValueText from './ExpressionValueText';

import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('Expression Simple Editor - Text', function() {

    beforeAll(function() {
        configure({ adapter: new Adapter() }); 
    });

    test('Should Render', function() {
        let values = ['someString'];
        const onChanged = () => undefined;
        const component = shallow(
            <ExpressionValueText 
                values={values}
                readOnly={false}
                onChange={onChanged}
            />          
        );    
        expect(component !== null);    
    });

    test('Should Render - ReadOnly', function() {
        let values = ['someString'];
        const onChanged = () => undefined;
        const component = mount(
            <ExpressionValueText 
                values={values}
                readOnly={true}
                onChange={onChanged}
            />          
        );
        const input = component.find('input');
        expect(input).not.toBeNull();
        expect((input.instance() as any).readOnly).toBeTruthy();
    });

    test('Can Update Value', function() {
        let values = ['someString'];
        const newValue = 'something else';
        const onChanged = function(values: any) {
            expect(values).not.toBeNull();
            expect(Array.isArray(values)).toBe(true);
            expect(values.length).toBe(1);
            expect(values[0]).toBe(newValue);
        };
        const component = mount(
            <ExpressionValueText 
                values={values}
                readOnly={false}
                onChange={onChanged}
            />          
        );
        const input = component.find('input');
        expect(input).not.toBeNull();
        const inputElm: any = input.instance();
        inputElm.value = newValue;
        input.simulate('change');
    });
  
    test('Cannot Update Value if ReadOnly', function() {
        let values = ['someString'];
        const newValue = 'something else';
        const onChanged = function(values: any) {
            expect(values).not.toBeNull();
            expect(Array.isArray(values)).toBe(true);
            expect(values.length).toBe(1);
            debugger;
            expect(values[0]).not.toBe(newValue);
        };
        const component = mount(
            <ExpressionValueText 
                values={values}
                readOnly={true}
                onChange={onChanged}
            />          
        );
        const input = component.find('input');
        expect(input).not.toBeNull();
        const inputElm: any = input.instance();
        inputElm.value = newValue;
        input.simulate('change');
    });
});
