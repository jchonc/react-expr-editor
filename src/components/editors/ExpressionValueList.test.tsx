import * as React from 'react';
import ExpressionValueList from './ExpressionValueList';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('Expression Simple Editor - List', function() {

    const options = [ 
        { value: 'GD_MALE', label: 'Male', description: 'Gentleman' },
        { value: 'GD_FEMALE', label: 'Female', description: 'Lady' }
    ];

    beforeAll(function() {
        configure({ adapter: new Adapter() }); 
    });

    test('Should Render', function() {
        const values = ['GD_MALE'];        
        const onChanged = () => undefined;
        const component = shallow(
            <ExpressionValueList 
                values={values}
                readOnly={false}
                options={options}
                onChange={onChanged}
            />          
        );    
        expect(component !== null);    
    });

    test('Can Update Value', async (done) =>  {        
        const newValue = 'GD_MALE';
        const onChanged = function(vs: any) {
            expect(vs).not.toBeNull();
            expect(Array.isArray(vs)).toBe(true);
            expect(vs.length).toBe(1);
            expect(vs[0]).toBe(newValue);
            done();
        };
        const component: any = mount(
            <ExpressionValueList 
                values={[]}
                readOnly={false}
                options={options}
                onChange={onChanged}
            />          
        );
        component.find('.ant-select-selection').simulate('click');
        let menuItems = component.find('li.ant-select-dropdown-menu-item');
        if (menuItems.length > 0) {
            menuItems.first().simulate('click');
        }
    });

});
