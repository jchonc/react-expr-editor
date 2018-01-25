import * as React from 'react';
import { configure, shallow /*, mount*/ } from 'enzyme';
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
        operator: 'Equal',
        operands: ['Jian']
      },
      {
        name: 'compare',
        attrId: '11003',
        attrCaption: 'Gender',
        operator: 'NotEqual',
        operands: ['GD_MALE']
      },
      {
        name: 'compare',
        attrId: '11004',
        attrCaption: 'Birthday',
        operator: 'Equal',
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
        const component = shallow(
                <ExpressionEditor 
                    moduleId={1}
                    entityName={'patient'}
                    node={testComplexExpression}
                    readOnly={false}
                />          
        );    
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        expect(component !== null);    
    });

    test('Should Render if empty', function() {
        const component = shallow(
                <ExpressionEditor 
                    moduleId={1}
                    entityName={'patient'}
                    node={null}
                    readOnly={false}
                />          
        );    
        expect(component !== null);    
    });

    /*
    test('Should Render If Empty', function() {
        const values: any = [];
        const onChanged = () => undefined;
        const component = mount(
            <ExpressionValueDate 
                values={values}
                readOnly={false}
                onChange={onChanged}
            />          
        );    
        expect(component !== null);    
    });

    test('Should Render If Invalid', function() {
        const values: any = ['1999/99/99'];
        const onChanged = () => undefined;
        const component = mount(
            <ExpressionValueDate 
                values={values}
                readOnly={false}
                onChange={onChanged}
            />          
        );    
        expect(component !== null);    
    });

    test('Should Render - ReadOnly', function() {
        const values = ['2011-12-12'];
        const onChanged = () => undefined;
        const component = mount(
            <ExpressionValueDate 
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
        const values = ['2011-12-12'];
        const newValue = '2013-12-12';
        const onChanged = function(vs: any) {
            expect(vs).not.toBeNull();
            expect(Array.isArray(vs)).toBe(true);
            expect(vs.length).toBe(1);
            expect(vs[0]).toBe(newValue);
        };
        const component = mount(
            <ExpressionValueDate 
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
        const values = ['2011-12-12'];
        const newValue = '2013-12-12';
        const onChanged = jest.fn();
        const component = mount(
            <ExpressionValueDate 
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
        expect(onChanged).not.toHaveBeenCalled();
    });*/
});
