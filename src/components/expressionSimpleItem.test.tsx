import * as React from 'react';
import { configure, shallow /*, mount*/ } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { CompareNode } from '../types/index';
import expressionStore from '../stores/ExpressionStore';
import utilityStore from '../stores/UtilityStore';
import mockUtilityApi from '../utils/mockApi';

import { ExpressionSimpleItem } from './expressionSimpleItem';

describe('Expression Compare Node', function() {

    beforeAll( async (done) => {
        expressionStore.moduleId = 1;
        expressionStore.entityName = 'patient';
        mockUtilityApi();
        await utilityStore.fetchDictionary(1, 'patient');
        configure({ adapter: new Adapter() }); 
        done();
    });

    test('Should Render', function() {
        const expressionNode = new CompareNode(undefined);
        expressionNode.attrId = '11001';
        expressionNode.attrCaption = 'First Name';
        expressionNode.operator = 'Equal';
        expressionNode.isClone = false;
        expressionNode.operands = ['Jian'];
        const component = shallow(
            <ExpressionSimpleItem 
                node={expressionNode}
                readOnly={false}
                connectDragSource={jest.fn()}
                connectDropTargetComplex={jest.fn()}
                connectDropTargetSimple={jest.fn()}
                expressionStore={expressionStore}
                utilityStore={utilityStore}
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
