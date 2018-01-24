import * as React from 'react';
import ExpressionValueDateRange from './ExpressionValueDateRange';

import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('Expression Simple Editor - Date Range', function() {

    beforeAll(function() {
        configure({ adapter: new Adapter() }); 
    });

    test('Should Render', function() {
        const values = ['2011-12-12', '2012-5-30'];
        const onChanged = () => undefined;
        const component = shallow(
            <ExpressionValueDateRange 
                values={values}
                readOnly={false}
                onChange={onChanged}
            />          
        );    
        expect(component !== null);    
    });
}