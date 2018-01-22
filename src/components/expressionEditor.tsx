import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from '../components/expressionItem';
import './expressionEditor.css';

import Button from 'antd/lib/button';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { NodeOwner, AbstractNode, CompareNode } from '../types/index';
import { inject, observer } from 'mobx-react';
import { ExpressionStore } from '../stores/ExpressionStore';

interface ExpressionEditorProps {
    expressionStore?: ExpressionStore;
    root: NodeOwner;
}

@inject('expressionStore')
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
        this.props.expressionStore!.fetchStuff();
    }

    getChildContext() {
        return {
            metaDictionary: this.props.expressionStore!.knownMetaDictionary,
            cachedPickLists: this.props.expressionStore!.knownPickLists
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
        this.props.expressionStore!.expression = newExp;
    }

    replaceNode(oldNode: AbstractNode, newNode: AbstractNode): void {
        this.props.expressionStore!.expression = newNode;
    }

    render() {
        if (!this.props.expressionStore!.metaLoaded) {
            return <div>Loading Metabase</div>;
        }
        else {
            let expression = this.props.expressionStore!.expression;
            if (expression) {
                if (!expression.parentNode) {
                    expression.parentNode = this;
                }
                let buttons = (<div />);
                if (!this.props.expressionStore!.readonly) {
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
                                <ExpressionItem
                                    node={expression}
                                    readOnly={this.props.expressionStore!.readonly}
                                />
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