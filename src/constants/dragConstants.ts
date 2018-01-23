import { LogicNode, AbstractNode } from '../types/index';

function handleHover(oldParent: LogicNode, newParent: LogicNode, target: AbstractNode, source: AbstractNode) {

    let sourceIndex = oldParent.operands.findIndex(node => node === source);

    oldParent.operands!.splice(sourceIndex, 1);

    let targetIndex = newParent === target ? -1 :
        newParent.operands.findIndex((node: any) => node === target);

    newParent.operands.splice(targetIndex + 1, 0, source);
    source.parentNode = newParent;
}

function confirmPlace(dragNode: AbstractNode, dragParentNode: LogicNode, TargetNode: AbstractNode): boolean {
    let index = dragParentNode.operands.findIndex((n: AbstractNode)  => n == dragNode);
    return index > 0 && TargetNode === dragParentNode.operands[index - 1];
}

export const ItemTypes = {
    Complex: 'Complex',
    Simple: 'Simple'
};

export function dropCollectComplex(connect: any, monitor: any) {
    return {
        connectDropTargetComplex: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

export function dropCollectSimple(connect: any, monitor: any) {
    return {
        connectDropTargetSimple: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

export function dragCollect(connect: any, monitor: any) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

export const simpleSource = {
    beginDrag(props: any, monitor: any) {
        let node = props.node;
        return { node: node };
    },
    endDrag(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.isClone = false;
    }
};

export const simpleTarget = {
    hover(props: any, monitor: any) {
        let dragNode = monitor.getItem().node;
        let targetNode = props.node;

        let condition = dragNode instanceof LogicNode ?
            !targetNode.isDescedentOf(dragNode) :
            dragNode !== targetNode;

        if (condition && !confirmPlace(dragNode, dragNode.parentNode, targetNode)) {
            dragNode.isClone = true;
            handleHover(dragNode.parentNode, targetNode.parentNode, targetNode, dragNode);
        }
    },
    drop(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.isClone = false;
    }
};

export const complexSource = {
    beginDrag(props: any, monitor: any) {
        let node = props.node;
        return { node: node };
    },
    endDrag(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.isClone = false;
    }
};

export const complexTarget = {
    hover(props: any, monitor: any) {
        let dragNode = monitor.getItem().node;
        let targetNode = props.node;

        let condition = dragNode instanceof LogicNode ?
            dragNode !== targetNode && !targetNode.isDescedentOf(dragNode)
            : true;

        if (condition && targetNode.operands[0] !== dragNode) {
            dragNode.isClone = true;
            handleHover(dragNode.parentNode, targetNode, targetNode, dragNode);
        }
    },
    drop(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.isClone = false;
    }
};