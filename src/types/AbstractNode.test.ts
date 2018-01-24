import { LogicNode, CompareNode, AbstractNode } from './AbstractNode';

describe('LogicNode', () => {
    test('instanceof', () => {
        let n1 = new LogicNode();
        expect(n1).toBeInstanceOf(AbstractNode);
        expect(n1.parentNode).toBeUndefined();

        let n2 = new LogicNode(n1);
        n1.operands.push(n2);
        expect(n2).toBeInstanceOf(AbstractNode);
        expect(n2.parentNode).toBe(n1);
        expect(n1.operands).toContain(n2);
    });

    test('can add operator', () => {
        let n1 = new LogicNode();
        n1.setOperator('And');
        expect(n1.operator).toBe('And');
        n1.setOperator('Or');
        expect(n1.operator).toBe('Or');
    });

    test('can add child', () => {
        let n1 = new LogicNode();
        n1.addSimpleChild();
        expect(n1.operands).toHaveLength(1);
    });

    test('can remove self', () => {
        let n1 = new LogicNode();
        let n2 = new LogicNode(n1);
        n1.operands.push(n2);
        expect(n1.operands).toHaveLength(1);
        n2.removeSelf();
        expect(n1.operands).toHaveLength(0);
    });

    test('can remove operand at index', () => {
        let n1 = new LogicNode();
        let n2 = new LogicNode(n1);
        let n3 = new LogicNode(n1);
        let n4 = new LogicNode(n1);
        n1.operands.push(...[n2, n3, n4]);
        expect(n1.operands).toHaveLength(3);
        n1.removeOperandAt(1);
        expect(n1.operands).toHaveLength(2);
        expect(n1.operands).toContain(n2);
        expect(n1.operands).toContain(n4);

        n4.removeOperandAt(1);
        expect(n4.operands).toHaveLength(0);

    });

    test('can remove node by reference', () => {
        let n1 = new LogicNode();
        let n2 = new LogicNode(n1);
        let n3 = new LogicNode(n1);
        let n4 = new LogicNode(n1);
        n1.operands.push(...[n2, n3, n4]);
        expect(n1.operands).toHaveLength(3);
        n1.removeNode(n2);
        expect(n1.operands).toHaveLength(2);
        expect(n1.operands).toContain(n3);
        expect(n1.operands).toContain(n4);

        let n5 = new LogicNode();
        n5.removeNode(new LogicNode());
        expect(n5.operands).toHaveLength(0);
    });

    test('can add operand at index', () => {
        let n1 = new LogicNode();
        let n2 = new LogicNode();

        n1.addOperandAt(0, n2);
        expect(n1.operands).toHaveLength(1);
        expect(n1.operands[0]).toBe(n2);
    });

    test('can add operand at invalid index', () => {
        let n1 = new LogicNode();
        let n2 = new LogicNode();

        n1.addOperandAt(1, n2);
        expect(n1.operands).toHaveLength(1);
        expect(n1.operands[0]).toBe(n2);
    });

    test('can replace node', () => {
        let n1 = new LogicNode();
        let n2 = new LogicNode(n1);
        let n3 = new LogicNode();
        n1.operands.push(n2);
        expect(n1.operands).toHaveLength(1);
        expect(n1.operands).toContain(n2);
        n1.replaceNode(n2, n3);
        expect(n1.operands).toHaveLength(1);
        expect(n1.operands).toContain(n3);
        expect(n1.operands).not.toContain(n2);
        
        let n4 = new LogicNode();
        let n5 = new LogicNode();
        n3.replaceNode(n4, n5);
        expect(n3.operands).toHaveLength(1);
        expect(n3.operands).toContain(n5);
    });
});

describe('CompareNode', () => {
    test('instanceof', () => {
        let n1 = new CompareNode();
        expect(n1).toBeInstanceOf(AbstractNode);
        expect(n1.parentNode).toBeUndefined();
    });

    test('can add sibling', () => {
        let parent = new LogicNode();
        let n1 = new CompareNode(parent);
        parent.operands.push(n1);
        n1.addSibling();
        expect(parent.operands).toHaveLength(2);
    });

    test('can remove self', () => {
        let n1 = new LogicNode();
        let n2 = new CompareNode(n1);
        n1.operands.push(n2);
        expect(n1.operands).toHaveLength(1);
        n2.removeSelf();
        expect(n1.operands).toHaveLength(0);
    });
});