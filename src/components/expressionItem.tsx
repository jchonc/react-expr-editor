import * as React from 'react';

import { ExpressionType } from '../constants/expression';
import ExpressionSimpleItem from './expressionSimpleItem';
import ExpressionComplexItem from './expressionComplexItem';

interface ExpressionItemState {
}

interface ExpressionItemProps {
    node: any;
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
            if (node.name === ExpressionType.Logic) {
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