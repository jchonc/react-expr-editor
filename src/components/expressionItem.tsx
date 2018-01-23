import * as React from 'react';

import ExpressionSimpleItem from './expressionSimpleItem';
import ExpressionComplexItem from './expressionComplexItem';
import { observer } from 'mobx-react';
import { AbstractNode, LogicNode, CompareNode } from '../types/index';

interface ExpressionItemProps {
    node: AbstractNode;
    readOnly: boolean;
}

@observer
export default class ExpressionItem extends React.Component<ExpressionItemProps> {

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