import * as React from 'react';

import ExpressionSimpleItem from './expressionSimpleItem';
import ExpressionComplexItem from './expressionComplexItem';
import { Expression } from '../types/index';

interface ExpressionItemState {
}

interface ExpressionItemProps {
    node: Expression;
    parent: any;
    readOnly: boolean;
}

export default class ExpressionItem extends React.Component<ExpressionItemProps, ExpressionItemState> {
    
    render() {
        let node = this.props.node;
        if (!node) {
            return (<div>Empty</div>);
        }
        else {
            if (node.name === 'logic') {
                return (
                    <ExpressionComplexItem node={node} parent={this.props.parent} readOnly={this.props.readOnly} />
                );
            } 
            else {
                return (
                    <ExpressionSimpleItem node={node} parent={this.props.parent} readOnly={this.props.readOnly} />
                );
            }
        }
    }

}