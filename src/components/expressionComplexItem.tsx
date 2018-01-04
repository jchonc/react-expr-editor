import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from './expressionItem';
import Select from 'react-select';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import './expressionComplexItem.css';
import 'react-select/dist/react-select.css';

interface ExpressionComplexItemState {
    operator: string;
    children: any;
}

interface ExpressionComplexItemProps {
    node: any;
    parent: any;
    readonly: boolean;
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
    }

    updateOperator(op: string) {
        this.props.node.operator = op;
        this.setState({
            operator: this.props.node.operator 
        });
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

            return (
                <div className="expr-complex-item row">
                    <div className="expr-logic col-md-3">
                        <form className="form-inline">
                            <div className="input-group">
                                <div className="input-group-addon"><i className="fa fa-th" aria-hidden="true" /></div>
                                <Select 
                                    className="expr-logic-operator"
                                    options={options}
                                    searchable={false}
                                    clearable={false}
                                    disabled={this.props.readonly}
                                    value={this.state.operator}
                                    onChange={(evt: any) => {this.updateOperator(evt.value); }}
                                />
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
                    <div className="expr-children col-md-9">
                        {nodes}
                    </div>
                </div>
            );
        }
        return null;
    }        
}

export default ExpressionComplexItem;
  