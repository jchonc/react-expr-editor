import * as React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'mobx-react';
import { LogicNode } from '../types/index';
import expressionStore from '../stores/ExpressionStore';
import utilityStore from '../stores/UtilityStore';
import mockUtilityApi from '../utils/mockApi';

import ExpressionComplexItem from './expressionComplexItem';
import { NodeFactory } from '../types/AbstractNode';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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

const emptyComplexExpression: any = {
    name: 'logic',
    operator: 'And',
    isClone: false,
    operands: []
};

describe('Expression Logic Node', function () {

    const stores = {
        expressionStore,
        utilityStore,
    };

    const Wrapper = DragDropContext(HTML5Backend)(Provider);

    beforeAll(async (done) => {
        expressionStore.moduleId = 1;
        expressionStore.entityName = 'patient';
        mockUtilityApi();
        await utilityStore.fetchDictionary(1, 'patient');
        configure({ adapter: new Adapter() });
        done();
    });

    test('Should Render', function () {
        const expressionNode = NodeFactory.LoadExpression(testComplexExpression) as LogicNode;
        const component = shallow(
            <Provider {...stores}>
                <ExpressionComplexItem
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                    isDragging={false}
                />
            </Provider>
        );
        expect(component !== null);
    });

    test('Could render if empty', function () {
        const expressionNode = NodeFactory.LoadExpression(emptyComplexExpression) as LogicNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionComplexItem
                    node={expressionNode}
                    readOnly={false}

                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                    isDragging={false}
                />
            </Wrapper>
        );
        expect(component !== null);
    }); 

    test('Could change operator if not readonly', function () {
        const expressionNode = NodeFactory.LoadExpression(testComplexExpression) as LogicNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionComplexItem
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                    isDragging={false}
                />
            </Wrapper>
        );
        expect(component !== null);
        const logicPart = component.find('.expr-logic-operator');
        logicPart.find('.ant-select-arrow').first().simulate('click');
        component.find('li.ant-select-dropdown-menu-item').first().simulate('click');
    });

    test('Could click new line', async function () {
        const expressionNode = NodeFactory.LoadExpression(testComplexExpression) as LogicNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionComplexItem
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                    isDragging={false}
                />
            </Wrapper>
        );
        expect(component !== null);
        component.find('button.ant-dropdown-trigger').first().simulate('mouseEnter');
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        component.find('li.ant-dropdown-menu-item').first().simulate('click');
    }); 

    test('Could click AND', async function () {
        const expressionNode = NodeFactory.LoadExpression(testComplexExpression) as LogicNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionComplexItem
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                    isDragging={false}
                />
            </Wrapper>
        );
        expect(component !== null);
        component.find('button.ant-dropdown-trigger').first().simulate('mouseEnter');
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        component.find('li.ant-dropdown-menu-item').at(1).simulate('click');
    });

    test('Could click OR', async function () {
        const expressionNode = NodeFactory.LoadExpression(testComplexExpression) as LogicNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionComplexItem
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                    isDragging={false}
                />
            </Wrapper>
        );
        expect(component !== null);
        component.find('button.ant-dropdown-trigger').first().simulate('mouseEnter');
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        component.find('li.ant-dropdown-menu-item').at(2).simulate('click');
    }); 

    test('Could click Duplicate', async function () {
        const expressionNode = NodeFactory.LoadExpression(testComplexExpression) as LogicNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionComplexItem
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                    isDragging={false}
                />
            </Wrapper>
        );
        expect(component !== null);
        component.find('button.ant-dropdown-trigger').first().simulate('mouseEnter');
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        component.find('li.ant-dropdown-menu-item').at(3).simulate('click');
    });

    test('Could click Remove', async function () {
        const expressionNode = NodeFactory.LoadExpression(testComplexExpression) as LogicNode;
        const component = mount(
            <Wrapper {...stores}>
                <ExpressionComplexItem
                    node={expressionNode}
                    readOnly={false}
                    connectDragSource={jest.fn()}
                    connectDropTargetComplex={jest.fn()}
                    connectDropTargetSimple={jest.fn()}
                    isDragging={false}
                />
            </Wrapper>
        );
        expect(component !== null);
        component.find('button.ant-dropdown-trigger').first().simulate('mouseEnter');
        await new Promise(resolve => setTimeout(resolve, 500));
        component.update();
        component.find('li.ant-dropdown-menu-item').at(4).simulate('click');
    }); 
});
