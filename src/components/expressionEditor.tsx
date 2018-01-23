import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from '../components/expressionItem';
import './expressionEditor.css';

import Button from 'antd/lib/button';
import expressionStore from '../stores/ExpressionStore';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { NodeOwner, AbstractNode, CompareNode } from '../types/index';
import { Provider, observer } from 'mobx-react';

interface ExpressionEditorProps {
    moduleId: number; entityName: string; root: any;
}

const stores = {
    expressionStore
};

@observer
class ExpressionEditor extends React.Component<ExpressionEditorProps> implements NodeOwner {

    static childContextTypes = {
        metaDictionary: PropTypes.any,
        cachedPickLists: PropTypes.any
    };

    metaDictionary: any;
    cachedPickLists: any;

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        expressionStore!.fetchStuff();
    }

    getChildContext() {
        return {
            metaDictionary: expressionStore!.knownMetaDictionary,
            cachedPickLists: expressionStore!.knownPickLists
        };
    }

    isDescedentOf(parentNode: AbstractNode) {
        return false;
    }

    addSimpleChild(node: AbstractNode): void {
        this.removeNode(node);
    }

    removeNode(node: AbstractNode): void {
        const newExp = new CompareNode(this);
        expressionStore.expression = newExp;
    }

    replaceNode(oldNode: AbstractNode, newNode: AbstractNode): void {
        expressionStore.expression = newNode;
    }

    render() {
        stores.expressionStore.moduleId = 1;
        stores.expressionStore.entityName = 'patient';

        stores.expressionStore.setExpression(this.props.root);
        if (!expressionStore.metaLoaded) {
            return <div>Loading Metabase</div>;
        }
        else {
            let expression = expressionStore.expression;
            if (expression) {
                if (!expression.parentNode) {
                    expression.parentNode = this;
                }
                let buttons = (<div />);
                if (!expressionStore.readonly) {
                    buttons = (
                        <div>
                            <Button>Copy</Button>
                            <Button>Paste</Button>
                            <Button>Clear</Button>
                        </div>
                    );
                }
                return (
                    <div>
                        {buttons}
                        <div className="row expr-editor">
                            <div className="expr-canvas">
                                <Provider {...stores}>
                                    <ExpressionItem
                                        node={expression}
                                        readOnly={expressionStore.readonly}
                                    />
                                </Provider>
                            </div>
                        </div>
                    </div>
                );
            }
            else {
                return (<div>Expression Editor</div>);
            }
        }
    }
}

export default DragDropContext(HTML5Backend)(ExpressionEditor);