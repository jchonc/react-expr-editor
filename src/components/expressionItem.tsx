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
    hoverCallback: any;
}

export default class ExpressionItem extends React.Component<ExpressionItemProps, ExpressionItemState> {

    componentWillReceiveProps(newProps: any) {
        if (newProps.node.isClone === undefined) {
            newProps.node.isClone = false;
        }
    }

    render() {
        let node = this.props.node;
        if (!node) {
            return (<div>Empty</div>);
        }
        else {
            const { parent, readOnly, hoverCallback } = this.props;
            if (node.name === 'logic') {
                return (
                    <ExpressionComplexItem node={node} parent={parent} readOnly={readOnly} hoverCallback={hoverCallback} />
                );
            } 
            else {
                return (
                    <ExpressionSimpleItem node={node} parent={parent} readOnly={readOnly} hoverCallback={hoverCallback} />
                );
            }
        }
    }

}