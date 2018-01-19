import * as React from 'react';
import * as PropTypes from 'prop-types';

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

import { ItemTypes, dragCollect, dropCollectComplex, dropCollectSimple, simpleSource, simpleTarget } from '../constants/dragConstants';

import './expressionSimpleItem.css';
import { ExpressionOperandKind } from '../types/index';

interface ExpressionSimpleItemState {
    attrMeta: any;
    allowedOperators: any;
    attrId: string;
    operator: string;
    operandKind: ExpressionOperandKind;
    operands: any;
}

interface ExpressionSimpleItemProps {
    node: any;
    parent: any;
    readOnly: boolean;
    connectDragSource: any;
    connectDropTargetComplex: any;
    connectDropTargetSimple: any;
    isDragging: boolean;
    hoverCallback: any;
}

const validCtrlKind: string[] = [
    'none', 'text', 'number', 'date', 'time', 'datetime', 'date-range', 'pick', 'multi-pick', 'lookup'
];

class ExpressionSimpleItem extends React.Component<ExpressionSimpleItemProps, ExpressionSimpleItemState> {

    static contextTypes = {
        metaDictionary: PropTypes.any,
        cachedPickLists: PropTypes.any
    };

    constructor(props: any, context: any) {
        super(props, context);
        const expression = props.node;
        if (!expression) {
            this.state = {
                attrMeta: null,
                attrId: '',
                allowedOperators: [],
                operator: '',
                operandKind: 'none',
                operands: []
            };
        }
        else {
            let meta = context.metaDictionary.find(function (elm: any) {
                return elm.attrId === expression.attrId;
            });
            this.state = {
                attrMeta: meta,
                allowedOperators: this.getAllowedOperators(meta),
                attrId: expression.attrId,
                operator: expression.operator,
                operandKind: this.getOperandKind(meta, expression.operator),
                operands: expression.operands
            };
        }
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(e: any) {
        switch (e.key) {
            case 'ADD_AND': 
                this.replaceWithComplex('and'); 
                break;
            case 'ADD_OR':
                this.replaceWithComplex('or');
                break;
            case 'NEW_LINE':
                this.addSibling();
                break;
            case 'REMOVE':
                this.removeSelf();
                break;
            default: 
                break;
        }
    }

    updateMetaReference(elmId: string) {
        const expression = this.props.node;
        let meta = this.context.metaDictionary.find(function (elm: any) {
            return elm.attrId === elmId;
        });

        expression.attrId = elmId;
        expression.attrCaption = meta.attrCaption;

        this.setState({
            attrMeta: meta,
            allowedOperators: this.getAllowedOperators(meta),
            attrId: elmId,
            operandKind: this.getOperandKind(meta, expression.operator)
        });
    }

    updateOperator(operator: string) {
        const expression = this.props.node;
        const meta = this.state.attrMeta;
        expression.operator = operator;
        this.setState({
            operator: operator,
            operandKind: this.getOperandKind(meta, expression.operator)
        });
    }

    updateValue(...values: any[]) {
        this.props.node.operands = values;
        this.setState({
            operands: [...values]
        });
        return;
    }

    removeSelf() {
        this.props.parent.removeChild(this.props.node);
    }

    replaceWithComplex(logic: string) {
        this.props.parent.replaceWithComplex(logic, this.props.node);
    }

    addSibling() {
        this.props.parent.addSimpleChild();
    }

    getAllowedOperators(meta: any) {
        // gt; ge; lt; le; between; is-one-of; 
        let results = [
            { value: 'eq', label: 'equals to' },
            { value: 'ne', label: 'not equal to' }
        ];
        if (meta) {
            if (meta.attrCtrlType === 'picklist') {
                results.push({ value: 'is-one-of', label: 'is one of' });
            }
            if (meta.attrCtrlType === 'date') {
                results.push({ value: 'between', label: 'between' });
            }
        }
        return results;
    }

    getOperandKind(meta: any, operator: string) {
        if (meta) {
            if (meta.attrCtrlType === 'date' && operator === 'between') {
                return 'date-range';
            }
            if (meta.attrCtrlType === 'picklist') {
                return (operator === 'is-one-of') ? 'multi-pick' : 'pick';
            }
            if (validCtrlKind.indexOf(meta.attrCtrlType) >= 0) {
                return meta.attrCtrlType;
            }
        }
        return 'none';
    }

    componentWillReceiveProps(newProps: any) {
        let expression = newProps.node;
        let meta = this.context.metaDictionary.find(function (elm: any) {
            return elm.attrId === expression.attrId;
        });

        this.setState({
            attrMeta: meta,
            allowedOperators: this.getAllowedOperators(meta),
            attrId: expression.attrId,
            operator: expression.operator,
            operandKind: this.getOperandKind(meta, expression.operator),
            operands: expression.operands
        });
    }

    render() {

        let options = this.context.metaDictionary.map(function (item: any) {
            return {
                value: item.attrId,
                label: item.attrCaption
            };
        });

        const meta = this.state.attrMeta;
        let listItems = [];
        if (meta) {
            if (meta.attrCtrlType === 'picklist' && meta.attrCtrlParams) {
                const list = this.context.cachedPickLists.find(function (lr: any) {
                    return lr.listName === meta.attrCtrlParams;
                });
                if (list) {
                    listItems = list.items;
                }
            }
        }

        let OperandCtrlTag = null;
        let OperandCtrlProps: any = {
            values: this.state.operands,
            readOnly: this.props.readOnly,
            onChange: (...evt: any[]) => { this.updateValue(...evt); }
        };

        switch (this.state.operandKind) {
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
                OperandCtrlProps.lookupKind = meta.attrCtrlParams;
                break;
            default:
                break;
        }

        let OperandCtrl = OperandCtrlTag ? ( <OperandCtrlTag {...OperandCtrlProps}/> ) : ( <div>Empty</div> );

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
        return connectDropTargetComplex(connectDropTargetSimple(connectDragSource(
            <div className={classNames('expr-simple-item', {clone: this.props.node.isClone})}>
                <div className="expr-simple-part"><i className="fa fa-th" aria-hidden="true" /></div>
                <Select
                    className="expr-simple-field"
                    disabled={this.props.readOnly}
                    value={this.state.attrId}
                    onChange={(value: any) => { this.updateMetaReference(value); }}
                >
                    {options.map((o: any) => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                </Select>
                <Select
                    className="expr-simple-field"
                    disabled={this.props.readOnly}
                    value={this.state.operator}
                    onChange={(value: any) => { this.updateOperator(value); }}
                >
                    {
                        this.state.allowedOperators.map((o: any) =>
                            <Option key={o.value} value={o.value}>{o.label}</Option>
                        )
                    }
                </Select>
                {OperandCtrl}
                <div className="expr-simple-part">
                    {menu}
                </div>
            </div>
        )));
    }

}

export default
    DropTarget(ItemTypes.Complex, simpleTarget, dropCollectComplex)(
        DropTarget(ItemTypes.Simple, simpleTarget, dropCollectSimple)(
            DragSource(ItemTypes.Simple, simpleSource, dragCollect)(ExpressionSimpleItem)
        )
    );
