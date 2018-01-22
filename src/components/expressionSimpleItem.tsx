import * as React from 'react';
import * as PropTypes from 'prop-types';

import { Select } from 'antd';
const Option = Select.Option;

import { DropdownButton, MenuItem } from 'react-bootstrap';

import { DragSource, DropTarget } from 'react-dnd';
import classNames from 'classnames';

import ExpressionValueText from './editors/ExpressionValueText';
import ExpressionValueNumber from './editors/ExpressionValueNumber';
import ExpressionValueList from './editors/ExpressionValueList';
import ExpressionValueMultiList from './editors/ExpressionValueMultiList';
import ExpressionValueDate from './editors/ExpressionValueDate';
import ExpressionValueDateRange from './editors/ExpressionValueDateRange';
import {
    ItemTypes,
    dragCollect,
    dropCollectComplex,
    dropCollectSimple,
    simpleSource,
    simpleTarget
} from '../constants/dragConstants';

import './expressionSimpleItem.css';
import { IExpressionStore, ExpressionOperator, IExpressionTreeNode, ExpressionBooleanLogic } from '../types/index';
import ValidatorFactory from '../factories/ValidatorFactory';
import ExpressionValueLookup from './editors/ExpressionValueLookup';
import { observer, inject } from 'mobx-react';

interface ExpressionSimpleItemProps {
    node: number;
    // parent: any;
    readOnly: boolean;
    connectDragSource: any;
    connectDropTargetComplex: any;
    connectDropTargetSimple: any;
    isDragging: boolean;
    expressionStore?: IExpressionStore;
}

@observer
class ExpressionSimpleItem extends React.Component<ExpressionSimpleItemProps> {

    static contextTypes = {
        metaDictionary: PropTypes.any,
        cachedPickLists: PropTypes.any
    };

    validatorFactory = new ValidatorFactory();
    validator: any;
    node: IExpressionTreeNode;

    constructor(props: any, context: any) {
        super(props, context);
        const expression = props.node;
        if (!expression) {
            this.state = {
                attrId: '',
                allowedOperators: [],
                operator: '',
                operandKind: 'none',
                operands: []
            };
        }
        else {
            this.node = this.props.expressionStore!.getNode(expression)!;
            let meta = this.props.expressionStore!.getMeta(this.node.attrId!);
            let opKind = this.props.expressionStore!.getOperandKind(meta, this.node!.operator);
            this.validator = this.validatorFactory.GetValidator(opKind);
            //this.node!.isValid = this.validator(this.node!.operands);

        }
    }

    updateMetaReference(elmId: string) {
        const expression = this.node;
        let meta = this.props.expressionStore!.getMeta(elmId);
        if (expression && meta) {
            expression.attrId = elmId;
            expression.attrCaption = meta.attrCaption;

            let opKind = this.props.expressionStore!.getOperandKind(meta, expression.operator);
            this.validator = this.validatorFactory.GetValidator(opKind);

        }
    }

    updateOperator(operator: ExpressionOperator) {
        if (this.node) {
            this.node.operator = operator;
            let meta = this.props.expressionStore!.getMeta(this.node.attrId!);

            this.setState({
                operator: operator,
                operandKind: this.props.expressionStore!.getOperandKind(meta, this.node.operator)
            });
        }
    }

    updateValue(...values: any[]) {
        const expression = this.node;

        expression!.isValid = this.validator(values);
        expression!.operands = [...values];
    }

    removeSelf() {
        this.props.expressionStore!.removeChild(this.node);
    }

    replaceWithComplex(logic: ExpressionBooleanLogic) {
        this.props.expressionStore!.replaceWithComplex(logic, this.node);
    }

    addSibling() {
        this.props.expressionStore!.addSimpleChild(this.node!.parent!.toString());
    }

    componentWillReceiveProps(newProps: any) {
        this.node = newProps.expressionStore!.getNode(newProps.node);
    }

    render() {

        let expression = this.node;
        if (expression) {
            let options = this.context.metaDictionary.map(function (item: any) {
                return {
                    value: item.attrId,
                    label: item.attrCaption
                };
            });

            let meta = this.props.expressionStore!.getMeta(expression.attrId!);
            let operandKind = this.props.expressionStore!.getOperandKind(meta, expression.operator);
            let allowedOperators = this.props.expressionStore!.getAllowedOperators(meta);
            let listItems = [];
            if (meta) {
                if (meta.attrCtrlType === 'picklist' && meta.attrCtrlParams) {
                    const list = this.context.cachedPickLists.find(function (lr: any) {
                        return lr.listName === meta!.attrCtrlParams;
                    });
                    if (list) {
                        listItems = list.items;
                    }
                }
            }

            let OperandCtrlTag = null;
            let OperandCtrlProps: any = {
                values: expression.operands,
                readOnly: this.props.readOnly,
                onChange: (...evt: any[]) => { this.updateValue(...evt); }
            };

            switch (operandKind) {
                case 'text':
                    OperandCtrlTag = ExpressionValueText;
                    break;
                case 'number':
                    OperandCtrlTag = ExpressionValueNumber;
                    break;
                case 'pick':
                    OperandCtrlTag = ExpressionValueList;
                    OperandCtrlProps.options = listItems;
                    break;
                case 'multi-pick':
                    OperandCtrlTag = ExpressionValueMultiList;
                    OperandCtrlProps.options = listItems;
                    break;
                case 'date':
                    OperandCtrlTag = ExpressionValueDate;
                    break;
                case 'date-range':
                    OperandCtrlTag = ExpressionValueDateRange;
                    break;
                case 'lookup':
                    OperandCtrlTag = ExpressionValueLookup;
                    OperandCtrlProps.lookupKind = meta!.attrCtrlParams;
                    break;
                default:
                    break;
            }

            let OperandCtrl = OperandCtrlTag ? (
                <OperandCtrlTag {...OperandCtrlProps} />
            ) : (
                    <div>Empty</div>
                );

            let menu = (<span>&nbsp;</span>);
            if (!this.props.readOnly) {
                menu = (
                    <DropdownButton id="menu-simple-dropdown" title="">
                        <MenuItem onClick={() => { this.replaceWithComplex('And'); }}>AND</MenuItem>
                        <MenuItem onClick={() => { this.replaceWithComplex('Or'); }}>OR</MenuItem>
                        <MenuItem onClick={() => { this.addSibling(); }}>New Line</MenuItem>
                        <MenuItem divider={true} />
                        <MenuItem onClick={() => { this.removeSelf(); }}>Remove</MenuItem>
                    </DropdownButton>
                );
            }

            const { connectDropTargetComplex, connectDropTargetSimple, connectDragSource } = this.props;
            const drag = connectDragSource(
                <div className="expr-simple-part"><i className="fa fa-th" aria-hidden="true" /></div>
            );
            return connectDropTargetComplex(connectDropTargetSimple(
                <div className={classNames('expr-simple-item', { clone: expression.isClone }, { 'node-error': expression.isValid != undefined && !expression.isValid })}>
                    {drag}
                    <Select
                        className="expr-simple-field"
                        disabled={this.props.readOnly}
                        value={expression.attrId}
                        onChange={(value: any) => { this.updateMetaReference(value); }}
                    >
                        {options.map((o: any) => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                    </Select>
                    <Select
                        className="expr-simple-field"
                        disabled={this.props.readOnly}
                        value={expression.operator}
                        onChange={(value: any) => { this.updateOperator(value); }}
                    >
                        {
                            allowedOperators.map((o: any) =>
                                <Option key={o.value} value={o.value}>{o.label}</Option>
                            )
                        }
                    </Select>
                    {OperandCtrl}
                    <div className="expr-simple-part">
                        {menu}
                    </div>
                </div>
            ));
        }
        return <div />;

    }

}

export default
inject('expressionStore')(
    DropTarget(ItemTypes.Complex, simpleTarget, dropCollectComplex)(
        DropTarget(ItemTypes.Simple, simpleTarget, dropCollectSimple)(
            DragSource(ItemTypes.Simple, simpleSource, dragCollect)(ExpressionSimpleItem)
        )
    )
);
