import * as React from 'react';
import ExpressionValueList from './ExpressionValueList';

import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('Expression Simple Editor - List', function() {

    beforeAll(function() {
        configure({ adapter: new Adapter() }); 
    });

    test('Should Render', function() {
        const values = ['GD_MALE'];
        const options = [ 
            { value: 'GD_MALE', label: 'Male', description: 'Gentleman' },
            { value: 'GD_FEMALE', label: 'Female', description: 'Lady' }
        ];
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

});
