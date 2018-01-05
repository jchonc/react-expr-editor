import * as React from 'react';
import * as PropTypes from 'prop-types';
import Select from 'react-select';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import ExpressionValueText from './editors/ExpressionValueText';
import ExpressionValueList from './editors/ExpressionValueList';
import ExpressionValueMultiList from './editors/ExpressionValueMultiList';
import ExpressionValueDate from './editors/ExpressionValueDate';
import ExpressionValueDateRange from './editors/ExpressionValueDateRange';

import './expressionSimpleItem.css';
import 'react-select/dist/react-select.css';

interface ExpressionSimpleItemState {
    attrMeta: any;
    allowedOperators: any;
    attrId: string;
    operator: string;
    operandKind: string;
    operands: any;
}

interface ExpressionSimpleItemProps {
    node: any;
    parent: any;
    readonly: boolean;
}

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
            let meta = context.metaDictionary.find(function(elm: any) {
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
    }

    updateMetaReference(elmId: string) {
        const expression = this.props.node;
        let meta = this.context.metaDictionary.find(function(elm: any) {
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

    updateValue( ...values: any[]) {
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
        let results =  [
            { value: 'eq', label: 'equals to'},
            { value: 'ne', label: 'not equal to'}
        ];
        if (meta) {
            if ( meta.attrCtrlType === 'picklist' ) {
                results.push({ value: 'is-one-of', label: 'is one of'});
            }
            if ( meta.attrCtrlType === 'date' ) {
                results.push({ value: 'between', label: 'between'});
            }            
        }
        return results;
    }

    getOperandKind(meta: any, operator: string) {
        if (!meta) {
            return 'none';
        }
        // none | text | number | date | time | datetime | date-range | pick | multi-pick 
        if ( meta.attrCtrlType === 'date' && operator === 'between' ) {
            return 'date-range';
        }
        if ( meta.attrCtrlType === 'picklist' ) {
            if ( operator === 'is-one-of' ) {
                return 'multi-pick';
            }
            else {
                return 'pick';
            }
        }
        switch ( meta.attrCtrlType ) {
            case 'number':
                return 'number';
            case 'text':
                return 'text';
            case 'date':
                return 'date';
            case 'time':
                return 'time';
            case 'datetime':
                return 'datetime';
            default: 
                return 'none';
        }
    }

    render() {

        let options = this.context.metaDictionary.map(function(item: any) {
            return {
                value: item.attrId,
                label: item.attrCaption
            };
        });
        
        const meta = this.state.attrMeta;
        let listItems = [];
        if (meta) {
            if (meta.attrCtrlType === 'picklist' && meta.attrCtrlParams ) {
                const list = this.context.cachedPickLists.find(function(lr: any) {
                    return lr.listName === meta.attrCtrlParams;
                });
                if (list) {
                    listItems = list.items;
                }
            }
        }

        let operandCtrl: any;
        switch (this.state.operandKind) {
            case 'text':
                operandCtrl = (
                    <ExpressionValueText 
                        value={this.state.operands[0]} 
                        readOnly={this.props.readonly}
                        onChange={(...evt: any[]) => {this.updateValue(...evt); }}
                    />
                );
                break;
            case 'pick':                
                operandCtrl = (
                    <ExpressionValueList 
                        value={this.state.operands[0]} 
                        readOnly={this.props.readonly}
                        options={listItems}
                        onChange={(...evt: any[]) => {this.updateValue(...evt); }}
                    />
                );
                break;
            case 'multi-pick':
                operandCtrl = (
                    <ExpressionValueMultiList 
                        values={this.state.operands} 
                        readOnly={this.props.readonly}
                        options={listItems}
                        onChange={(evt: any) => {this.updateValue(...evt); }}
                    />
                );
                break;
            case 'date':
                operandCtrl = (
                    <ExpressionValueDate
                        value={this.state.operands[0]}
                        readOnly={this.props.readonly}
                        onChange={(evt: any) => {this.updateValue(...evt); }}
                    />
                );
                break;
            case 'date-range':
                operandCtrl = (
                    <ExpressionValueDateRange
                        values={this.state.operands}
                        readOnly={this.props.readonly}
                        onChange={(evt: any) => {this.updateValue(...evt); }}
                    />
                );
                break;
            default:
                operandCtrl = (<div />);
                break;
        }        

        return (
            <div className="expr-simple-item">
                <div className="expr-simple-part"><i className="fa fa-th" aria-hidden="true" /></div>
                <Select 
                    className="expr-simple-field"
                    options={options}
                    searchable={false}
                    clearable={false}
                    disabled={this.props.readonly}
                    value={this.state.attrId}
                    onChange={(evt: any) => {this.updateMetaReference(evt.value); }}
                />
                <Select
                    className="expr-simple-field"
                    options={this.state.allowedOperators}
                    searchable={false}
                    clearable={false}
                    value={this.state.operator}
                    onChange={(evt: any) => {this.updateOperator(evt.value); }}
                />
                {operandCtrl}
                <div className="expr-simple-part">
                    <DropdownButton id="menu-simple-dropdown" title="">
                        <MenuItem onClick={() => {this.replaceWithComplex('and'); }}>AND</MenuItem>
                        <MenuItem onClick={() => {this.replaceWithComplex('or'); }}>OR</MenuItem>
                        <MenuItem onClick={() => {this.addSibling(); }}>New Line</MenuItem>
                        <MenuItem divider={true} />
                        <MenuItem onClick={() => {this.removeSelf(); }}>Remove</MenuItem>
                    </DropdownButton>
                </div>
            </div>
        );
    }

}

export default ExpressionSimpleItem;
  