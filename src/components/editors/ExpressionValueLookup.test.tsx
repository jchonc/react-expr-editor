import * as React from 'react';
import ExpressionValueLookup from './ExpressionValueLookup';
import mockUtilityApi from '../../utils/mockApi';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('Expression Simple Editor - Lookup', function() {

    beforeAll(function() {
        mockUtilityApi();
        configure({ adapter: new Adapter() }); 
    });

    test('Should Render', function() {
        const values = ['Jian Zhou(jzhou@rlsolutions.com)'];
        const onChanged = () => undefined;
        const component = shallow(
            <ExpressionValueLookup 
                values={values}
                readOnly={false}
                lookupKind="users"
                onChange={onChanged}
            />          
        );    
        expect(component !== null);    
    });

    test('Can Lookup', async (done) =>  { 
        const values = ['Jian Zhou(jzhou@rlsolutions.com)'];
        const onChanged = function(vs: any) {
            expect(vs).not.toBeNull();
            expect(Array.isArray(vs)).toBe(true);
            expect(vs.length).toBe(1);
            expect(vs[0]).toBe('jzhou@rlsolutions.com(Jian Zhou)');
            done();
        };
        const component = mount(
            <ExpressionValueLookup 
                values={values}
                readOnly={false}
                lookupKind="users"
                onChange={onChanged}
            />          
        );    
        expect(component !== null);    
        component.find('.ant-select-search').simulate('click');
        component.find('input').simulate('change', {target: { value: 'c'}});
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
        let menuItems = component.find('li.ant-select-dropdown-menu-item');
        if (menuItems.length > 0) {
            menuItems.first().simulate('click');
        }
    });

});
