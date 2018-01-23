import * as React from 'react';
import { Menu, Dropdown, Button, Icon, Select } from 'antd';
const Option = Select.Option;
import { DragSource, DropTarget } from 'react-dnd';
import classNames from 'classnames';
import ExpressionValueText from './editors/ExpressionValueText';
import ExpressionValueNumber from './editors/ExpressionValueNumber';
import ExpressionValueList from './editors/ExpressionValueList';
import ExpressionValueMultiList from './editors/ExpressionValueMultiList';
import ExpressionValueDate from './editors/ExpressionValueDate';
import ExpressionValueDateRange from './editors/ExpressionValueDateRange';
import ExpressionValueLookup from './editors/ExpressionValueLookup';

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

import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { ExpressionStore } from '../stores/ExpressionStore';

interface ExpressionSimpleItemProps {
    node: CompareNode;
    readOnly: boolean;
    connectDragSource: any;
    connectDropTargetComplex: any;
    connectDropTargetSimple: any;
    expressionStore?: ExpressionStore;
}

@observer
class ExpressionSimpleItem extends React.Component<ExpressionSimpleItemProps> {

   constructor(props: any, context: any) {
        super(props, context);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(e: any) {
        switch (e.key) {
            case 'ADD_AND': 
                this.props.node.replaceWithComplex('And'); 
                break;
            case 'ADD_OR':
                this.props.node.replaceWithComplex('Or');
                break;
            case 'NEW_LINE':
                this.props.node.addSibling();
                break;
            case 'REMOVE':
                this.props.node.removeSelf();
                break;
            default: 
                break;
        }
    }

    updateMetaReference(elmId: string) {
        const expression = this.props.node;
        let meta = this.props.expressionStore!.getMeta(elmId);
        if (expression && meta) {
            expression.attrId = elmId;
            expression.attrCaption = meta.attrCaption;          
            expression.operands = ['', ''];
        }
    }

    updateOperator(operator: ExpressionOperator) {
        this.props.node.operator = operator;
    }

    updateValue(values: string[]) {
        this.props.node.operands = observable(values);
    }

    render() {

        let expression = this.props.node;
        if (expression) {
            let options = this.props.expressionStore!.knownMetaDictionary.map(function (item: any) {
                return {
                    value: item.attrId,
                    label: item.attrCaption
                };
            });

            let meta = this.props.expressionStore!.getMeta(expression.attrId!);
            let operandKind = this.props.node.getOperandKind(meta);
            let allowedOperators = this.props.node.getAllowedOperators(meta);
            let listItems: any[] = [];
            if (meta) {
                if (meta.attrCtrlType === 'picklist' && meta.attrCtrlParams) {
                    const list: any = this.props.expressionStore!.knownPickLists.find(function (lr: any) {
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
                onChange: (evt: any) => { this.updateValue(evt); }
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
                const dropdownMenu = (
                    <Menu onClick={this.handleMenuClick}>
                    <Menu.Item key="ADD_AND">AND</Menu.Item>
                    <Menu.Item key="ADD_OR">OR</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="NEW_LINE">New Line</Menu.Item>
                    <Menu.Item key="REMOVE">Remove</Menu.Item>
                    </Menu>
                );
                menu = (
                    <Dropdown overlay={dropdownMenu}>
                        <Button style={{ marginLeft: 8 }}><Icon type="down" /></Button>
                    </Dropdown>
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
