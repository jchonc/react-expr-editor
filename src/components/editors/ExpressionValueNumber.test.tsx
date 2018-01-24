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
        const onChanged = () => undefined;
        const component = shallow(
            <ExpressionValueNumber 
                values={values}
                readOnly={false}
                onChange={onChanged}
            />          
        );    
        expect(component !== null);    
    });

});