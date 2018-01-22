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
import { ExpressionOperator, CompareNode } from '../types/index';
import ValidatorFactory from '../factories/ValidatorFactory';
import ExpressionValueLookup from './editors/ExpressionValueLookup';
import { observer, inject } from 'mobx-react';
import { ExpressionStore } from '../stores/ExpressionStore';

interface ExpressionSimpleItemProps {
    node: CompareNode;
    // parent: any;
    readOnly: boolean;
    connectDragSource: any;
    connectDropTargetComplex: any;
    connectDropTargetSimple: any;
    // isDragging: boolean;
    expressionStore?: ExpressionStore;
}

@observer
class ExpressionSimpleItem extends React.Component<ExpressionSimpleItemProps> {

    static contextTypes = {
        metaDictionary: PropTypes.any,
        cachedPickLists: PropTypes.any
    };

    validatorFactory = new ValidatorFactory();
    validator: any;

    constructor(props: any, context: any) {
        super(props, context);
        // const expression = props.node;
        // if (!expression) {
        //     this.state = {
        //         attrId: '',
        //         allowedOperators: [],
        //         operator: '',
        //         operandKind: 'none',
        //         operands: []
        //     };
        // }
        // else {
        // this.node = this.props.expressionStore!.getNode(expression)!;
        let meta = this.props.expressionStore!.getMeta(this.props.node.attrId!);
        this.validator = this.validatorFactory.GetValidator(this.props.node.getOperandKind(meta));

        // this.node!.isValid = this.validator(this.node!.operands);

        // }
    }

    updateMetaReference(elmId: string) {
        const expression = this.props.node;
        let meta = this.props.expressionStore!.getMeta(elmId);
        if (expression && meta) {
            expression.attrId = elmId;
            expression.attrCaption = meta.attrCaption;

            let opKind = expression.getOperandKind(meta);
            this.validator = this.validatorFactory.GetValidator(opKind);
        }
    }

    updateOperator(operator: ExpressionOperator) {
        this.props.node.operator = operator;
        // let meta = this.props.expressionStore!.getMeta(this.props.node.attrId!);

        // this.setState({
        //     operator: operator,
        //     operandKind: this.props.expressionStore!.getOperandKind(meta, this.node.operator)
        // });
    }

    updateValue(...values: any[]) {
        const expression = this.props.node;

        // expression.isValid = this.validator(values);
        expression.operands = [...values];
    }

    render() {

        let expression = this.props.node;
        if (expression) {
            let options = this.context.metaDictionary.map(function (item: any) {
                return {
                    value: item.attrId,
                    label: item.attrCaption
                };
            });

            let meta = this.props.expressionStore!.getMeta(expression.attrId!);
            let operandKind = this.props.node.getOperandKind(meta);
            let allowedOperators = this.props.node.getAllowedOperators(meta);
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
                        <MenuItem onClick={() => { expression.replaceWithComplex('And'); }}>AND</MenuItem>
                        <MenuItem onClick={() => { expression.replaceWithComplex('Or'); }}>OR</MenuItem>
                        <MenuItem onClick={() => { expression.addSibling(); }}>New Line</MenuItem>
                        <MenuItem divider={true} />
                        <MenuItem onClick={() => { expression.removeSelf(); }}>Remove</MenuItem>
                    </DropdownButton>
                );
            }

            const { connectDropTargetComplex, connectDropTargetSimple, connectDragSource } = this.props;
            const drag = connectDragSource(
                <div className="expr-simple-part"><i className="fa fa-th" aria-hidden="true" /></div>
            );
            return connectDropTargetComplex(connectDropTargetSimple(
                <div className={classNames('expr-simple-item', { clone: expression.isClone }, { 'node-error': !expression.isValid })}>
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
