import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from './expressionItem';

import { Select } from 'antd';
const Option = Select.Option;

import { DropdownButton, MenuItem } from 'react-bootstrap';
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

    updateOperator(op: ExpressionBooleanLogic) {
        this.props.node.operator = op;
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
                menu = (
                    <DropdownButton id="menu-simple-dropdown" title="">
                        <MenuItem onClick={() => { node.addSimpleChild(); }}>New Line</MenuItem>
                        <MenuItem divider={true} />
                        <MenuItem eventKey="3">Another Link</MenuItem>
                        <MenuItem onClick={() => { node.removeSelf(); }}>Remove Group</MenuItem>
                    </DropdownButton>
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
