import * as React from 'react';

import ExpressionSimpleItem from './expressionSimpleItem';
import ExpressionComplexItem from './expressionComplexItem';
import { ExpressionStore } from '../stores/ExpressionStore';
import { observer, inject } from 'mobx-react';
import { AbstractNode, LogicNode, CompareNode } from '../types/index';

interface ExpressionItemState {
}

interface ExpressionItemProps {
    node: AbstractNode;
    readOnly: boolean;
    expressionStore?: ExpressionStore;
}

@inject('expressionStore')
@observer
export default class ExpressionItem extends React.Component<ExpressionItemProps, ExpressionItemState> {

    render(): JSX.Element {
        let {node} = this.props;
        if (!node) {
            return <div>Empty</div>;
        }
        else {
            const { readOnly } = this.props;
            if (node instanceof LogicNode) {
                return (
                    <ExpressionComplexItem
                        node={node as LogicNode}
                        readOnly={readOnly}
                    />
                );
            }
            else {
                return (
                    <ExpressionSimpleItem
                        node={node as CompareNode}
                        readOnly={readOnly}
                    />
                );
            }
        }
    }

}