import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from '../components/expressionItem';
import './expressionEditor.css';

import { AttrIdSingleton } from '../constants/constants';
import Button from 'antd/lib/button';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { ExpressionOperator, IExpressionTreeNode, IExpressionStore } from '../types/index';
import { inject, observer } from 'mobx-react';

interface ExpressionEditorProps {
    expressionStore?: IExpressionStore;
}

@inject('expressionStore')
@observer
class ExpressionEditor extends React.Component<ExpressionEditorProps> {

    static childContextTypes = {
        metaDictionary: PropTypes.any,
        cachedPickLists: PropTypes.any
    };

    metaDictionary: any;
    cachedPickLists: any;

    constructor(props: any) {
        super(props);
        this.state = {
            expression: props.expression,
            knownMetaDictionary: null,
            knownPickLists: null,
            metaLoaded: false
        };
        // this.addSimpleChild = this.addSimpleChild.bind(this);
        this.removeChild = this.removeChild.bind(this);
        this.replaceWithComplex = this.replaceWithComplex.bind(this);
        this.handleHover = this.handleHover.bind(this);
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

    addSimpleChild() {
        this.setState({
            expression: {
                name: 'compare',
                attrId: '',
                attrCaption: '',
                nodeId: AttrIdSingleton.NextUniqueNodeId, 
                operator: 'And',
                operands: ['']
            }
        });
    }

    handleHover(oldParentID: number, newParentID: number, targetID: number, sourceID: number) {
        let expression = this.props.expressionStore!.expression;
        let oldParent = this.getTargetNode(oldParentID, expression);
        let newParent = this.getTargetNode(newParentID, expression);

        let sourceIndex = oldParent.operands.findIndex((node: any) => node.nodeId === sourceID);
        let source = oldParent.operands[sourceIndex];

        if (sourceIndex.length < 0) {
            // input was not correct
            return;
        }

        oldParent.operands.splice(sourceIndex, 1);

        let targetIndex = newParentID === targetID ? -1 : 
            newParent.operands.findIndex((node: any) => node.nodeId === targetID);

        if ((newParentID !== targetID && targetIndex.length < 0)) {
            return;
        }

        newParent.operands.splice(targetIndex + 1, 0, source);

        this.setState({
            expression: expression
        });

    }

     getTargetNode(targetID: number, expr: any) {
        
        if (expr.nodeId === targetID) {
            return expr;
        }

        if (expr.name === 'logic') {
            for (let i = 0; i < expr.operands.length; i++) {
                let node = expr.operands[i];
                let result: any = this.getTargetNode(targetID, node);
                if (result) {
                    return result;
                }
            }
        }
    }

    removeChild(child: any) {
        this.props.expressionStore!.addSimpleChild();
    }

    isAncestor(current: any) {
        return false;
    }

    replaceWithComplex(op: ExpressionOperator, child: IExpressionTreeNode) {
        if (child) {
            const newComplexNode: IExpressionTreeNode = {
                name: 'logic',
                nodeId: AttrIdSingleton.NextUniqueNodeId,
                operator: op,
                operands: [child]
            };
            this.setState({
                expression: newComplexNode
            });
        }
    }

    render() {
        if (!this.props.expressionStore!.metaLoaded) {
            return (<div>Loading Metabase</div>);
        }
        else {
            let expression = this.props.expressionStore!.expression;
            if (expression) {
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
                                    parent={this} 
                                    hoverCallback={this.handleHover} 
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