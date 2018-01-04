import * as React from 'react';

import ExpressionSimpleItem from './expressionSimpleItem';
import ExpressionComplexItem from './expressionComplexItem';

interface ExpressionItemState {
}

interface ExpressionItemProps {
    node: any;
    parent: any;
    readonly: boolean;
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
                    <ExpressionComplexItem node={node} parent={this.props.parent} readonly={this.props.readonly} />
                );
            } 
            else {
                return (
                    <ExpressionSimpleItem node={node} parent={this.props.parent} readonly={this.props.readonly} />
                );
            }
        }
    }

}