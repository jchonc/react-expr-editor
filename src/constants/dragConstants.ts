import { IExpressionStore } from "../types/index";

function handleHover(oldParentID: number, newParentID: number, targetID: number, sourceID: number, store: IExpressionStore) {
    let oldParent = store.getNode(oldParentID.toString());
    let newParent = store.getNode(newParentID.toString());

    let source = store.getNode(sourceID.toString());

    if (!source) {
        // input was not correct
        return;
    }

    let sourceIndex = oldParent!.children!.findIndex(node => node === sourceID);
    oldParent!.children!.splice(sourceIndex, 1);
    source.parent = newParentID

    let targetIndex = newParentID === targetID ? -1 : 
        newParent!.children!.findIndex((node: any) => node === targetID);

    if ((newParentID !== targetID && targetIndex < 0)) {
        return;
    }

    newParent!.children!.splice(targetIndex + 1, 0, sourceID);

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
        let node = props.expressionStore.getNode(props.node);
        return {node: node, parent: props.parent, store: props.expressionStore};
    },
    endDrag(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.isClone = false;
    }
};

export const simpleTarget = {
    hover(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        let condition = dragNodeInfo.node.name === 'logic' ? 
            !props.expressionStore.isAncestor(dragNodeInfo.node.nodeId, props.node) : 
            dragNodeInfo.node.nodeId !== props.node;
        if (condition) {
            dragNodeInfo.node.isClone = true;
            handleHover(dragNodeInfo.parent, props.parent, props.node, dragNodeInfo.node.nodeId, dragNodeInfo.store);
            dragNodeInfo.parent = props.parent;
        }
    },
    drop(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.isClone = false;
    }
};

export const complexSource = {
    beginDrag(props: any, monitor: any) {
        let node = props.expressionStore.getNode(props.node);
        return {node: node, 
                parent: props.parent ? props.parent : props.node, 
                store: props.expressionStore
            };
    },
    endDrag(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.isClone = false;
    }
};

export const complexTarget = {
    hover(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        
        let condition = dragNodeInfo.node.name === 'logic' ? 
            dragNodeInfo.node.nodeId !== props.node && !props.expressionStore.isAncestor(dragNodeInfo.node.nodeId, props.node)
            : true;

        let newParent = dragNodeInfo.store.getNode(props.node);
        if (condition && newParent && newParent.children[0] !== dragNodeInfo.node.nodeId) {
            dragNodeInfo.node.isClone = true;
            handleHover(
                dragNodeInfo.parent, 
                props.node, 
                props.node, 
                dragNodeInfo.node.nodeId,
                dragNodeInfo.store);
            dragNodeInfo.parent = props.node;
        }
    },
    drop(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.isClone = false;
    }
};