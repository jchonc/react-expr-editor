import * as React from 'react';
import ExpressionValueNumber from './ExpressionValueNumber';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('Expression Simple Editor - Number', function() {

    beforeAll(function() {
        configure({ adapter: new Adapter() }); 
    });

    test('Should Render', function() {
        const values = ['123'];
        const component = shallow(
            <ExpressionValueNumber 
                values={values}
                readOnly={false}
                onChange={jest.fn()}
            />          
        );    
        expect(component !== null);    
    });

    test('Can Update Value', function() {        
        const values = ['123'];
        const newValue = '124';
        const onChanged = function(vs: any) {
            expect(vs).not.toBeNull();
            expect(Array.isArray(vs)).toBe(true);
            expect(vs.length).toBe(1);
            expect(vs[0]).toBe(parseInt(newValue, 10));
        };
        const component = mount(
            <ExpressionValueNumber 
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

});