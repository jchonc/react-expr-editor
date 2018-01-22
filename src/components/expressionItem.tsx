import * as React from 'react';

import ExpressionSimpleItem from './expressionSimpleItem';
import ExpressionComplexItem from './expressionComplexItem';
import { ExpressionStore } from '../stores/ExpressionStore';
import { observer, inject } from 'mobx-react';
import { AbstractNode } from '../types/index';

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
            if (node.name === 'logic') {
                return (
                    <ExpressionComplexItem
                        node={node}
                        readOnly={readOnly}
                    />
                );
            }
            else {
                return (
                    <ExpressionSimpleItem
                        node={node}
                        readOnly={readOnly}
                    />
                );
            }
        }
    }

}