import { LogicNode, AbstractNode } from '../types/index';
import {
    DragSourceConnector,
    DropTargetConnector,
    DropTargetMonitor,
    DragSourceMonitor,
    ConnectDragSource,
    DragSourceSpec,
    DropTargetSpec
} from 'react-dnd';
import { ExpressionSimpleItemProps } from '../components/expressionSimpleItem';
import { ExpressionComplexItemProps } from '../components/expressionComplexItem';

function handleHover(oldParent: LogicNode, newParent: LogicNode, target: AbstractNode, source: AbstractNode) {

    let sourceIndex = oldParent.operands.findIndex(node => node === source);

    oldParent.removeOperandAt(sourceIndex);

    let targetIndex = newParent === target ? -1 :
        newParent.operands.findIndex((node: any) => node === target);

    newParent.addOperandAt(targetIndex + 1, source);
}

function confirmPlace(dragNode: AbstractNode, dragParentNode: LogicNode, TargetNode: AbstractNode): boolean {
    let index = dragParentNode.operands.findIndex((n: AbstractNode) => n === dragNode);
    return index > 0 && TargetNode === dragParentNode.operands[index - 1];
}

export const ItemTypes = {
    Complex: 'Complex',
    Simple: 'Simple'
};

export function dropCollectComplex(connect: DropTargetConnector, monitor: DropTargetMonitor) {
    return {
        connectDropTargetComplex: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

export function dropCollectSimple(connect: DropTargetConnector, monitor: DropTargetMonitor) {
    return {
        connectDropTargetSimple: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

export interface NodeSourceProps {
    isDragging: boolean;
    connectDragSource: ConnectDragSource;
}

export function dragCollect(connect: DragSourceConnector, monitor: DragSourceMonitor): NodeSourceProps {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

export const simpleSource: DragSourceSpec<NodeSourceProps & ExpressionSimpleItemProps> = {
    beginDrag(props: ExpressionSimpleItemProps, monitor: DragSourceMonitor) {
        let node = props.node;
        return { node: node };
    },
    endDrag(props: ExpressionSimpleItemProps, monitor: DragSourceMonitor) {
        let dragNodeInfo: any = monitor.getItem();
        dragNodeInfo.node.toggleIsClone(false);
    }
};

export interface NodeTargetProps {

}

export const simpleTarget: DropTargetSpec<NodeTargetProps & ExpressionSimpleItemProps | ExpressionComplexItemProps> = {
    hover(props: ExpressionSimpleItemProps, monitor: DropTargetMonitor) {
        let dragNode = (monitor.getItem() as any).node;
        let targetNode: AbstractNode = props.node;

        let condition = dragNode instanceof LogicNode ?
            !targetNode.isDescedentOf(dragNode) :
            dragNode !== targetNode;

        if (condition && !confirmPlace(dragNode, dragNode.parentNode, targetNode)) {
            dragNode.toggleIsClone(true);
            handleHover(dragNode.parentNode, targetNode.parentNode as LogicNode, targetNode, dragNode);
        }
    },
    drop(props: ExpressionSimpleItemProps, monitor: DropTargetMonitor) {
        let dragNodeInfo: any = monitor.getItem();
        dragNodeInfo.node.toggleIsClone(false);
    }
};

export const complexSource = {
    beginDrag(props: any, monitor: any) {
        let node = props.node;
        return { node: node };
    },
    endDrag(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.toggleIsClone(false);
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
            dragNode.toggleIsClone(true);
            handleHover(dragNode.parentNode, targetNode, targetNode, dragNode);
        }
    },
    drop(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.toggleIsClone(false);
    }
};