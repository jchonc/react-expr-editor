import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from './expressionItem';
import Select from 'react-select';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import './expressionComplexItem.css';
import 'react-select/dist/react-select.css';

import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';

interface ExpressionComplexItemState {
    operator: string;
    children: any;
}

interface ExpressionComplexItemProps {
    node: any;
    parent: any;
    readonly: boolean;
    connectDragSource: any;
    connectDropTarget: any;
    isDragging: boolean;
}

const ItemTypes = {
    Complex: 'Complex',
    Simple: 'Simple'
};

const complexSource = {
    beginDrag(props: any, monitor: any) {
        return {node: props.node, parent: props.parent};
    }
};

const complexTarget = {
    drop(props: any, monitor: any) {
        let dragNodeInfo = monitor.getItem();
        console.log(dragNodeInfo);
    }
};

function dropCollect(connect: any, monitor: any) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

function dragCollect(connect: any, monitor: any) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

class ExpressionComplexItem extends React.Component<ExpressionComplexItemProps, ExpressionComplexItemState> {
    
    static contextTypes = {
        metaDictionary: PropTypes.any,
        cachedPickLists: PropTypes.any
    };

    constructor (props: any, context: any) {
        super(props, context);
        this.state = {
            operator: props.node.operator,
            children: props.node.operands
        };
        this.addSimpleChild = this.addSimpleChild.bind(this);
        this.removeChild = this.removeChild.bind(this);
        this.replaceWithComplex = this.replaceWithComplex.bind(this);
    }

    updateOperator(op: string) {
        this.props.node.operator = op;
        this.setState({
            operator: this.props.node.operator 
        });
    }

    addSimpleChild() {
        const newElement = {
            name: 'compare', attrId: '', attrCaption: '', operator: '', operands: [''] 
        };
        const newChildren = [...this.state.children, newElement];
        this.props.node.operands = newChildren;
        this.setState({
            children: newChildren
        });
    }

    removeChild(child: any) {
        if (child) {
            let children = this.props.node.operands;
            const idx = children.indexOf(child);
            if (idx >= 0) {
                children.splice(idx, 1);
                this.setState({
                    children: children
                });
            }
        }
    }

    removeSelf() {
        this.props.parent.removeChild(this.props.node);
    }

    dragChildIn(target: any, source: any) {
        let children = this.props.node.operands;
        const targetIndex = children.indexOf(target);
        if (targetIndex >= 0) {
            children.splice(targetIndex + 1, 0, source);
            this.setState({
                children: children
            });
        }
    }

    replaceWithComplex(logic: string, child: any) {
        if (child) {
            const idx = this.state.children.indexOf(child);
            if (idx >= 0) {
                const newComplexNode = {
                    name: 'logic',
                    operator: logic,
                    operands: [child]
                };
                const newChildren = this.state.children;
                newChildren[idx] = newComplexNode;
                this.props.node.operands = newChildren;
                this.setState({
                    children: newChildren
                });
            }
        }
    }

    isAncestor(current: any) {
        return current === this.props.node ? true : this.props.parent.isAncestor(this.props.node);
    }

    render() {
        const props = this.props;
        const self = this;
        if (this.state.children && this.state.children.length) {
            let nodes = this.state.children.map(function(n: any, i: number) {
                return (<ExpressionItem key={i} node={n} parent={self} readonly={props.readonly} />);
            });

            const options: any = [
                {value: 'and', label: 'AND'},
                {value: 'or', label: 'OR'}
            ];

            let menu = (<span>&nbsp;</span>);
            if (!this.props.readonly) {
                menu = (
                    <DropdownButton id="menu-simple-dropdown" title="">
                        <MenuItem onClick={() => {this.addSimpleChild(); }}>New Line</MenuItem>
                        <MenuItem divider={true} />
                        <MenuItem eventKey="3">Another Link</MenuItem>
                        <MenuItem onClick={() => {this.removeSelf(); }}>Remove Group</MenuItem>
                    </DropdownButton>
                );
            }
            const { connectDropTarget, connectDragSource } = this.props;

            let logicNode = connectDragSource(connectDropTarget(
                <div className="expr-logic">
                    <div className="expr-logic-part"><i className="fa fa-th" aria-hidden="true" /></div>
                    <Select 
                        className="expr-logic-operator"
                        options={options}
                        searchable={false}
                        clearable={false}
                        disabled={this.props.readonly}
                        value={this.state.operator}
                        onChange={(evt: any) => {this.updateOperator(evt.value); }}
                    />
                    <div className="expr-logic-part">
                        {menu}
                    </div>
                </div>));

            return (
                <div className="expr-complex-item">
                    {logicNode}
                    <div className="expr-children">
                        {nodes}
                    </div>
                </div>
            );
        }
        return null;
    }        
}

export default 
DropTarget(ItemTypes.Simple, complexTarget, dropCollect)(
    DropTarget(ItemTypes.Complex, complexTarget, dropCollect)(
        DragSource(ItemTypes.Complex, complexSource, dragCollect)(ExpressionComplexItem)
    )
);
  