import * as React from 'react';
import ExpressionValueLookup from './ExpressionValueLookup';
<<<<<<< HEAD
import mockUtilityApi from '../../utils/mockApi';
import { configure, shallow, mount } from 'enzyme';
=======

import { configure, shallow } from 'enzyme';
>>>>>>> a32de5dfe084c08e42ed9ecf2fb7d5ae7d66c561
import Adapter from 'enzyme-adapter-react-16';

describe('Expression Simple Editor - Date', function() {

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

    test('Can Lookup', async function() {
        const values = ['Jian Zhou(jzhou@rlsolutions.com)'];
        const onChanged = () => undefined;
        const component = mount(
            <ExpressionValueLookup 
                values={values}
                readOnly={false}
                lookupKind="users"
                onChange={onChanged}
            />          
        );    
        expect(component !== null);    
        let comp = component.instance() as ExpressionValueLookup;
        comp.fetch('c');
        await new Promise(resolve => setTimeout(resolve, 2000));
        expect(comp.state.options).toHaveLength(5);
    });

});
