import store from './ExpressionStore';
import { IExpressionTreeNode } from '../types/index';

let testExpression: IExpressionTreeNode = {
    name: 'logic',
    operator: 'And',
    nodeId: 1,
    operands: [
        {
            name: 'compare',
            attrId: '11001',
            nodeId: 2,
            attrCaption: 'First Name',
            operator: 'Equal',
            operands: ['Jian']
        },
        {
            name: 'compare',
            attrId: '11003',
            nodeId: 3,
            attrCaption: 'Gender',
            operator: 'NotEqual',
            operands: ['GD_MALE']
        },
        {
            name: 'compare',
            attrId: '11004',
            nodeId: 4,
            attrCaption: 'Birthday',
            operator: 'Equal',
            operands: ['2011-12-12']
        }
    ]
};

test('can convert expression tree to map', () => {
    let result = [];
    store.setExpressionTree(testExpression);
    store.getExpressionMap();
    expect(result.length).toBe(4);
});