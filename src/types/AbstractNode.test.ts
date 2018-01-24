import { LogicNode, CompareNode, AbstractNode } from './AbstractNode';

describe('LogicNode', () => {
    test('instanceof', () => {
        let n1 = new LogicNode();
        expect(n1).toBeInstanceOf(AbstractNode);
        expect(n1.parentNode).toBeUndefined();

        let n2 = new LogicNode(n1);
        expect(n2).toBeInstanceOf(AbstractNode);
        expect(n2.parentNode).toBe(n1);
        expect(n1.operands).toContain(n2);
    });

    test('can add child', () => {
        let n1 = new LogicNode();
        n1.addSimpleChild();
        expect(n1.operands).toHaveLength(1);
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
        n1.addSibling();
        expect(parent.operands).toHaveLength(1);
    });
});