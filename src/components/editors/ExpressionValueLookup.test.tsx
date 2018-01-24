import * as React from 'react';
import ExpressionValueLookup from './ExpressionValueLookup';

import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('Expression Simple Editor - Date', function() {

    beforeAll(function() {
        configure({ adapter: new Adapter() }); 
    });

    test('Should Render', function() {
        const values = ['2011-12-12'];
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

});
