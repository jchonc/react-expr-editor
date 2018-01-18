import * as React from 'react';

import ExpressionSimpleItem from './expressionSimpleItem';
import ExpressionComplexItem from './expressionComplexItem';
import { IExpressionTreeNode, IExpressionStore } from '../types/index';
import { observer, inject } from 'mobx-react';

interface ExpressionItemState {
}

interface ExpressionItemProps {
    node: IExpressionTreeNode;
    parent: any;
    readOnly: boolean;
    hoverCallback: any;
    expressionStore?: IExpressionStore;

}

@inject('expressionStore')
@observer
export default class ExpressionItem extends React.Component<ExpressionItemProps, ExpressionItemState> {

    componentWillReceiveProps(newProps: any) {
        if (newProps.node.isClone === undefined) {
            newProps.node.isClone = false;
        }
    }

    render(): JSX.Element {
        let node = this.props.node;
        if (!node) {
            return (
                <div>Empty</div>
            );
        }
        else {
            const { parent, readOnly, hoverCallback } = this.props;
            if (node.name === 'logic') {
                return (
                    <ExpressionComplexItem
                        node={node}
                        parent={parent}
                        readOnly={readOnly}
                        hoverCallback={hoverCallback}
                    />
                );
            }
            else {
                return (
                    <ExpressionSimpleItem
                        node={node}
                        parent={parent}
                        readOnly={readOnly}
                        hoverCallback={hoverCallback}
                    />
                );
            }
        }
    }

}