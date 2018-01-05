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
        this.addSimpleChild = this.addSimpleChild.bind(this);
        this.removeChild = this.removeChild.bind(this);
        this.replaceWithComplex = this.replaceWithComplex.bind(this);
    }

    updateOperator(op: string) {
        this.props.node.operator = op;
        this.setState({
            operator: this.props.node.operator 
        });
    }

    addSimpleChild() {
        const newElement = {
            name: 'compare', attrId: '', attrCaption: '', operator: '', operands: [''] 
        };
        const newChildren = [...this.state.children, newElement];
        this.props.node.operands = newChildren;
        this.setState({
            children: newChildren
        });
    }

    removeChild(child: any) {
        if (child) {
            const idx = this.state.children.indexOf(child);
            if (idx >= 0) {
                const newChildren = this.state.children.splice(idx, 1);
                this.props.node.operands = newChildren;
                this.setState({
                    children: newChildren
                });
            }
        }
    }

    replaceWithComplex(logic: string, child: any) {
        if (child) {
            const idx = this.state.children.indexOf(child);
            if (idx >= 0) {
                const newComplexNode = {
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

            let menu = (<span>&nbsp;</span>);
            if (!this.props.readonly) {
                menu = (
                    <DropdownButton id="menu-simple-dropdown" title="">
                        <MenuItem onClick={() => {this.addSimpleChild(); }}>New Line</MenuItem>
                        <MenuItem divider={true} />
                        <MenuItem eventKey="3">Another Link</MenuItem>
                    </DropdownButton>
                );
            }
            return (
                <div className="expr-complex-item">
                    <div className="expr-logic">
                        <div className="expr-logic-part"><i className="fa fa-th" aria-hidden="true" /></div>
                        <Select 
                            className="expr-logic-operator"
                            options={options}
                            searchable={false}
                            clearable={false}
                            disabled={this.props.readonly}
                            value={this.state.operator}
                            onChange={(evt: any) => {this.updateOperator(evt.value); }}
                        />
                        <div className="expr-logic-part">
                            {menu}
                        </div>
                    </div>
                    <div className="expr-children">
                        {nodes}
                    </div>
                </div>
            );
        }
        return null;
    }        
}

export default ExpressionComplexItem;
  