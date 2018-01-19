import * as React from 'react';

import ExpressionSimpleItem from './expressionSimpleItem';
import ExpressionComplexItem from './expressionComplexItem';
import { IExpressionStore } from '../types/index';
import { observer, inject } from 'mobx-react';

interface ExpressionItemState {
}

interface ExpressionItemProps {
    node: number;
    readOnly: boolean;
    hoverCallback: any;
    expressionStore?: IExpressionStore;
}

@inject('expressionStore')
@observer
export default class ExpressionItem extends React.Component<ExpressionItemProps, ExpressionItemState> {

    render(): JSX.Element {
        let node = this.props.expressionStore!.getNode(this.props.node.toString());
        if (!node) {
            return <div>Empty</div>;
        }
        else {
            const { readOnly, hoverCallback } = this.props;
            const { parent } = node;
            if (node.name === 'logic') {
                return (
                    <ExpressionComplexItem
                        node={node.nodeId}
                        parent={parent}
                        readOnly={readOnly}
                        hoverCallback={hoverCallback}
                    />
                );
            }
            else {
                return (
                    <ExpressionSimpleItem
                        node={node.nodeId}
                        parent={parent}
                        readOnly={readOnly}
                        hoverCallback={hoverCallback}
                    />
                );
            }
        }
    }

}