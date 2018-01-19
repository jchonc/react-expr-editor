import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from './expressionItem';

import { Menu, Dropdown, Button, Icon, Select } from 'antd';
const Option = Select.Option;

import classNames from 'classnames';

import { AttrIdSingleton } from '../constants/constants';
import { ItemTypes, dragCollect, dropCollectComplex, dropCollectSimple, complexSource, complexTarget } from '../constants/dragConstants';

import './expressionComplexItem.css';

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
    connectDropTargetComplex: any;
    connectDropTargetSimple: any;
    isDragging: boolean;
    hoverCallback: any;
}

class ExpressionComplexItem extends React.Component<ExpressionComplexItemProps, ExpressionComplexItemState> {
    static contextTypes = {
        metaDictionary: PropTypes.any,
        cachedPickLists: PropTypes.any
    };
    
    self: ExpressionComplexItem;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            operator: props.node.operator,
            children: props.node.operands,
        };
        this.addSimpleChild = this.addSimpleChild.bind(this);
        this.removeChild = this.removeChild.bind(this);
        this.replaceWithComplex = this.replaceWithComplex.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    updateOperator(op: string) {
        this.props.node.operator = op;
        this.setState({
            operator: this.props.node.operator
        });
    }

    addSimpleChild() {
        const newElement = {
            name: 'compare',
            attrId: '',
            nodeId: AttrIdSingleton.NextUniqueNodeId, 
            attrCaption: '', 
            operator: '', 
            operands: [''] 
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
                if (children.length === 0) {
                    this.removeSelf();
                } else {
                    this.setState({
                        children: children
                    });
                }
            }
        }
    }

    removeSelf() {
        this.props.parent.removeChild(this.props.node);
    }

    replaceWithComplex(logic: string, child: any) {
        if (child) {
            const idx = this.state.children.indexOf(child);
            if (idx >= 0) {
                const newComplexNode = {
                    nodeId: AttrIdSingleton.NextUniqueNodeId,
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

    isAncestor(connector: any) {
        return connector === this.props.node ? true : this.props.parent.isAncestor(connector);
    }

    componentWillReceiveProps(newProps: any) {

        this.setState({
            operator: newProps.node.operator,
            children: newProps.node.operands
        });
    }

    handleMenuClick(e: any) {
        switch (e.key) {
            case 'NEW_LINE':
                this.addSimpleChild();
                break;
            case 'REMOVE':
                this.removeSelf();
                break;
            default:
                break;
        }
    }

    render() {
        const props = this.props;
        const self = this;
        if (this.state.children && this.state.children.length) {
            let nodes = this.state.children.map(function(n: any, i: number) {
                return (<ExpressionItem key={i} node={n} parent={self} readOnly={props.readonly} hoverCallback={props.hoverCallback}/>);
            });

            const options: any = [
                { value: 'and', label: 'AND' },
                { value: 'or', label: 'OR' }
            ];

            let menu = (<span>&nbsp;</span>);
            if (!this.props.readonly) {
                const dropdownMenu = (
                    <Menu onClick={this.handleMenuClick}>
                      <Menu.Item key="NEW_LINE">NewLine</Menu.Item>
                      <Menu.Item key="SOMETHING">Another Link</Menu.Item>
                      <Menu.Divider />
                      <Menu.Item key="REMOVE">Remove Group</Menu.Item>
                    </Menu>
                  );
                menu = (
                    <Dropdown overlay={dropdownMenu}>
                        <Button><Icon type="down" /></Button>
                    </Dropdown>
                );
            }
            const { connectDropTargetComplex, connectDropTargetSimple, connectDragSource } = this.props;

            let logicNode = connectDropTargetComplex(connectDropTargetSimple(connectDragSource(
                <div className="expr-logic">
                    <div className="expr-logic-part"><i className="fa fa-th" aria-hidden="true" /></div>
                    <Select
                        className="expr-logic-operator"
                        disabled={this.props.readonly}
                        value={this.state.operator}
                        onChange={(evt: any) => { this.updateOperator(evt.value); }}
                    >
                        {options.map((o: any) => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                    </Select>
                    <div className="expr-logic-part">
                        {menu}
                    </div>
                </div>)));

            return (
                <div className={classNames('expr-complex-item', {clone: this.props.node.isClone})}>
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
    DropTarget(ItemTypes.Simple, complexTarget, dropCollectSimple)(
        DropTarget(ItemTypes.Complex, complexTarget, dropCollectComplex)(
            DragSource(ItemTypes.Complex, complexSource, dragCollect)(ExpressionComplexItem)
        )
    );
