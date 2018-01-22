import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from './expressionItem';

import { Menu, Dropdown, Button, Icon, Select } from 'antd';
const Option = Select.Option;

import classNames from 'classnames';

import {
    ItemTypes,
    dragCollect,
    dropCollectComplex,
    dropCollectSimple,
    complexSource,
    complexTarget
} from '../constants/dragConstants';

import './expressionComplexItem.css';

import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';
import { inject, observer } from 'mobx-react';
import { ExpressionBooleanLogic, LogicNode } from '../types/index';
import { ExpressionStore } from '../stores/ExpressionStore';

interface ExpressionComplexItemProps {
    node: LogicNode;
    readonly: boolean;
    connectDragSource: any;
    connectDropTargetComplex: any;
    connectDropTargetSimple: any;
    isDragging: boolean;
    expressionStore?: ExpressionStore;
}

@observer
class ExpressionComplexItem extends React.Component<ExpressionComplexItemProps> {
    static contextTypes = {
        metaDictionary: PropTypes.any,
        cachedPickLists: PropTypes.any
    };

    constructor(props: any) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }    

    updateOperator(op: ExpressionBooleanLogic) {
        this.props.node.operator = op;
    }

    handleMenuClick(e: any) {
        switch (e.key) {
            case 'NEW_LINE':
                this.props.node.addSimpleChild();
                break;
            case 'REMOVE':
                this.props.node.removeSelf();
                break;
            default:
                break;
        }
    }
    
    render() {
        const node = this.props.node;
        const props = this.props;
        const operands = node!.operands;

        if (operands && operands.length) {
            let nodes = operands.map(function (n: any, i: number) {
                return (
                    <ExpressionItem
                        key={i}
                        node={n}
                        readOnly={props.readonly}
                    />);
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
                        value={node!.operator}
                        onChange={(evt: any) => { this.updateOperator(evt.value); }}
                    >
                        {options.map((o: any) => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                    </Select>
                    <div className="expr-logic-part">
                        {menu}
                    </div>
                </div>)));

            return (
                <div className={classNames('expr-complex-item', { clone: node!.isClone })}>
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
    inject('expressionStore')(
        DropTarget(ItemTypes.Simple, complexTarget, dropCollectSimple)(
            DropTarget(ItemTypes.Complex, complexTarget, dropCollectComplex)(
                DragSource(ItemTypes.Complex, complexSource, dragCollect)(ExpressionComplexItem)
            )
        )
    );
