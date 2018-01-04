import * as React from 'react';
import * as PropTypes from 'prop-types';
import Select from 'react-select';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import ExpressionValueText from './editors/ExpressionValueText';

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

        expression.set({
            attrId: elmId,
            attrCaption: meta.attrCaption    
        });

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
        expression.set({
            operator: operator
        });
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

    getAllowedOperators(meta: any) {
        // gt; ge; lt; le; between; is-one-of; 
        return [
            { value: 'eq', label: 'equals to'},
            { value: 'ne', label: 'not equal to'}
        ];
    }

    getOperandKind(meta: any, operator: string) {
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

        let operandCtrl = (<div />);
        if (this.state.operandKind === 'text' ) {
            operandCtrl = (
                <ExpressionValueText 
                    value={this.state.operands[0]} 
                    onChange={(...evt: any[]) => {this.updateValue(...evt); }}
                />
            );
        }

        return (
            <div className="expr-simple-item row">
                <form className="form-inline">
                    <div className="input-group">
                        <div className="input-group-addon"><i className="fa fa-th" aria-hidden="true" /></div>
                        <Select 
                            className="expr-logic-variable"
                            options={options}
                            searchable={false}
                            clearable={false}
                            disabled={this.props.readonly}
                            value={this.state.attrId}
                            onChange={(evt: any) => {this.updateMetaReference(evt.value); }}
                        />
                        <Select
                            className="expr-logic-operator"
                            options={this.state.allowedOperators}
                            searchable={false}
                            clearable={false}
                            value={this.state.operator}
                            onChange={(evt: any) => {this.updateOperator(evt.value); }}
                        />
                        {operandCtrl}
                        <div className="input-group-addon">
                            <DropdownButton id="menu-simple-dropdown" title="">
                                <MenuItem eventKey="1">Action</MenuItem>
                                <MenuItem divider={true} />
                                <MenuItem eventKey="3">Another Link</MenuItem>
                            </DropdownButton>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default ExpressionSimpleItem;
  