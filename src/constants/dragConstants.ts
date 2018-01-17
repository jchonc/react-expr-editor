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
        return {node: props.node, parentID: props.parent.props.node.nodeId, hoverCallback: props.hoverCallback};
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
            !props.parent.isAncestor(dragNodeInfo.node) : 
            dragNodeInfo.node.nodeId !== props.node.nodeId;
        if (condition) {
            dragNodeInfo.node.isClone = true;
            let newParentID = props.parent.props.node.nodeId;
            dragNodeInfo.hoverCallback(dragNodeInfo.parentID, newParentID, props.node.nodeId, dragNodeInfo.node.nodeId);
            dragNodeInfo.parentID = newParentID;
        }
    },
    drop(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.isClone = false;
    }
};

export const complexSource = {
    beginDrag(props: any, monitor: any) {
        return {node: props.node, 
                parentID: props.parent ? props.parent.props.node.nodeId : props.node.nodeId, 
                hoverCallback: props.hoverCallback
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
            dragNodeInfo.node !== props.node && !props.parent.isAncestor(dragNodeInfo.node)
            : true;

        if (condition && props.node.operands[0].nodeId !== dragNodeInfo.node.nodeId) {
            dragNodeInfo.node.isClone = true;
            dragNodeInfo.hoverCallback(dragNodeInfo.parentID, props.node.nodeId, props.node.nodeId, dragNodeInfo.node.nodeId);
            dragNodeInfo.parentID = props.node.nodeId;
        }
    },
    drop(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        dragNodeInfo.node.isClone = false;
    }
};