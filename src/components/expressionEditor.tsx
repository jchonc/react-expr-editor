import * as React from 'react';
import ExpressionItem from '../components/expressionItem';
import './expressionEditor.css';
import Button from 'antd/lib/button';
import expressionStore from '../stores/ExpressionStore';
import utilityStore from '../stores/UtilityStore';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { NodeOwner, AbstractNode, CompareNode } from '../types/index';
import { Provider, observer } from 'mobx-react';
import { Spin } from 'antd';

interface ExpressionEditorProps {
    moduleId: number;
    entityName: string;
    readOnly: boolean;
    root: any;
}

const stores = {
    expressionStore,
    utilityStore,
};

@observer
class ExpressionEditor extends React.Component<ExpressionEditorProps> implements NodeOwner {

    constructor(props: any) {
        super(props);
        stores.expressionStore.moduleId = props.moduleId;
        stores.expressionStore.entityName = props.entityName;
        stores.expressionStore.readOnly = props.readOnly;
        stores.expressionStore.setExpression(props.root);
    }

    componentDidMount() {
        stores.utilityStore.fetchDictionary(this.props.moduleId, this.props.entityName)
            .then(() => {
                stores.utilityStore.fetchPicklists(utilityStore.usedLists);
            });
    }

    isDescedentOf(parentNode: AbstractNode) {
        return false;
    }

    addSimpleChild(node: AbstractNode): void {
        this.removeNode(node);
    }

    removeNode(node: AbstractNode): void {
        const newExp = new CompareNode(this);
        stores.expressionStore.expression = newExp;
    }

    replaceNode(oldNode: AbstractNode, newNode: AbstractNode): void {
        stores.expressionStore.expression = newNode;
    }

    render() {
        if (stores.utilityStore.isBusy || stores.utilityStore.isDictionaryEmpty) {
            return <div className="spinner-container"><Spin tip="Loading metabase..." /></div>;
        }
        else {
            let expression = stores.expressionStore.expression;
            if (expression) {
                if (!expression.parentNode) {
                    expression.parentNode = this;
                }
                let buttons = (<div />);
                if (!expressionStore.readOnly) {
                    buttons = (
                        <div className="expr-editor-toolbar">
                            <Button>Copy</Button>
                            <Button>Paste</Button>
                            <Button
                                onClick={() => {
                                    stores.expressionStore.clear();
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    );
                }
                return (
                    <div>
                        {buttons}
                        <div className="expr-editor">
                            <div className="expr-canvas">
                                <Provider {...stores}>
                                    <ExpressionItem
                                        node={expression}
                                        readOnly={expressionStore.readOnly}
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