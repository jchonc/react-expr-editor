import * as React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { CompareNode } from '../types/index';
import expressionStore from '../stores/ExpressionStore';
import utilityStore from '../stores/UtilityStore';
import mockUtilityApi from '../utils/mockApi';
import { NodeFactory } from '../types/AbstractNode';
import ExpressionSimpleItem from './expressionSimpleItem';
import { Provider } from 'mobx-react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

describe('Expression Compare Node', function() {

    const stores = {
        expressionStore,
        utilityStore,
    };

    const Wrapper = DragDropContext(HTML5Backend)(Provider);
    
    beforeAll( async (done) => {
        expressionStore.moduleId = 1;
        expressionStore.entityName = 'patient';
        mockUtilityApi();
        await utilityStore.fetchDictionary(1, 'patient');
        await utilityStore.fetchPicklists(['Gender']);
        configure({ adapter: new Adapter() }); 
        done();
    });

    test('Should Render', function() {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']    
        }) as CompareNode;
        const component = shallow(
            <Provider {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Provider>
        );    
        expect(component !== null);    
    });

    test('Should Render if text', function() {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);    
    });

    test('Should Render if number', function() {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11006',
            attrCaption: 'Age',
            operator: 'EQUALS',
            operands: ['13']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);    
    });

    test('Should Render if date', function() {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11004',
            attrCaption: 'Birthday',
            operator: 'EQUALS',
            operands: ['1977-11-11']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);    
    });

    test('Should Render if date range', function() {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11004',
            attrCaption: 'Birthday',
            operator: 'BETWEEN',
            operands: ['1977-11-11', '1988-11-11']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);    
    });

    test('Should Render if picklist', function() {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11003',
            attrCaption: 'Gender',
            operator: 'EQUALS',
            operands: ['GD_MALE']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);    
    });

    test('Should Render if multi-pick', function() {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11003',
            attrCaption: 'Gender',
            operator: 'ONE_OF',
            operands: ['GD_MALE']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);    
    });

    test('Should Render if lookup', function() {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11005',
            attrCaption: 'Owner',
            operator: 'EQUALS',
            operands: ['jzhou@rlsolutions.com(Jian Zhou)']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);    
    });

    test('Should update if changed', async function() { 
        const newValue = 'John';
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);    
        component.find('input.ant-input').last().simulate('change', {target: { value: newValue }});
        component.update();
        expect(expressionNode.operands).toHaveLength(1);
        expect(expressionNode.operands[0]).toBe(newValue);
    });

    test('Can change field', async function() { 
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);    
        component.find('.ant-select-arrow').first().simulate('click');
        component.find('li.ant-select-dropdown-menu-item').at(1).simulate('click');
        component.update();
        expect(expressionNode.attrId).toBe('11002');
    });

    test('Can change operator', async function() { 
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);    
        component.find('.ant-select-arrow').at(1).simulate('click');
        component.find('li.ant-select-dropdown-menu-item').at(1).simulate('click');
        component.update();
        expect(expressionNode.operator).toBe('NOT_EQUALS');
    });

    test('Could click NEW LINE', async function () {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);
        component.find('button.ant-dropdown-trigger').last().simulate('mouseEnter');
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        component.find('li.ant-dropdown-menu-item').first().simulate('click');
    });

    test('Could click AND', async function () {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);
        component.find('button.ant-dropdown-trigger').last().simulate('mouseEnter');
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        component.find('li.ant-dropdown-menu-item').at(1).simulate('click');
    });

    test('Could click OR', async function () {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);
        component.find('button.ant-dropdown-trigger').last().simulate('mouseEnter');
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        component.find('li.ant-dropdown-menu-item').at(2).simulate('click');
    });

    test('Could click DUPLICATE', async function () {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);
        component.find('button.ant-dropdown-trigger').last().simulate('mouseEnter');
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        component.find('li.ant-dropdown-menu-item').at(3).simulate('click');
    });

    test('Could click REMOVE', async function () {
        const expressionNode = NodeFactory.LoadExpression({
            name: 'compare',
            attrId: '11001',
            attrCaption: 'First Name',
            operator: 'EQUALS',
            operands: ['Jian']    
        }) as CompareNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionSimpleItem 
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                />          
            </Wrapper>
        );    
        expect(component !== null);
        component.find('button.ant-dropdown-trigger').last().simulate('mouseEnter');
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        component.find('li.ant-dropdown-menu-item').at(4).simulate('click');
    });

});
