import * as React from 'react';
import { configure, /*shallow,*/ mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mockUtilityApi from '../utils/mockApi';
import ExpressionEditor from './expressionEditor';

const testComplexExpression: any = {
    name: 'logic',
    operator: 'And',
    isClone: false,
    operands: [
        {
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']
        },
        {
            name: 'compare',
            attrId: '11003',
            attrCaption: 'Gender',
            operator: 'NOT_EQUALS',
            operands: ['GD_MALE']
        },
        {
            name: 'compare',
            attrId: '11004',
            attrCaption: 'Birthday',
            operator: 'EQUALS',
            operands: ['2011-12-12']
        }
    ]
};
  
describe('Expression Editor', function() {

    beforeAll( async (done) => {
        await mockUtilityApi();
        configure({ adapter: new Adapter() }); 
        done();
    });

    test('Should Render', async function() {
        const component = mount(
                <ExpressionEditor 
                    moduleId={1}
                    entityName={'patient'}
                    root={testComplexExpression}
                    readOnly={false}
                />          
        );    
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        expect(component !== null);    
    });

    test('Should Render ReadOnly', async function() {
        const component = mount(
                <ExpressionEditor 
                    moduleId={1}
                    entityName={'patient'}
                    root={testComplexExpression}
                    readOnly={true}
                />          
        );    
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        expect(component !== null);    
    });

    test('Should Render if empty', function() {
        const component = mount(
                <ExpressionEditor 
                    moduleId={1}
                    entityName={'patient'}
                    root={null}
                    readOnly={false}
                />          
        );    
        expect(component !== null);    
    });

    test('Click Clear', async function() {
        const component = mount(
                <ExpressionEditor 
                    moduleId={1}
                    entityName={'patient'}
                    root={testComplexExpression}
                    readOnly={false}
                />          
        );    
        await new Promise(resolve => setTimeout(resolve, 1500));
        component.update();
        expect(component !== null);    
        component.find('.expr-editor-toolbar').first().find('button').at(2).simulate('click');
    });

});
