import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from '../components/expressionItem';
import './expressionEditor.css';

import { AttrIdSingleton } from '../constants/constants';
import Button from 'antd/lib/button';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Expression, ExpressionOperator } from '../types/index';

interface ExpressionEditorState {
    expression: any;
    knownMetaDictionary: any;
    knownPickLists: any;
    metaLoaded: boolean;
}

interface ExpressionEditorProps {
    readOnly: boolean;
    moduleId: number;
    entityName: string;
    expression: Expression;
}

class ExpressionEditor extends React.Component<ExpressionEditorProps, ExpressionEditorState> {

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
        this.addSimpleChild = this.addSimpleChild.bind(this);
        this.removeChild = this.removeChild.bind(this);
        this.replaceWithComplex = this.replaceWithComplex.bind(this);
        this.handleHover = this.handleHover.bind(this);
    }

    componentDidMount() {
        const dictionaryUrl = `/dictionary/${this.props.moduleId}/${this.props.entityName}`;
        fetch(dictionaryUrl)
            .then((res) => res.json())
            .then((resData) => {
                const dictionray = resData;
                let usedLists: string[] = [];
                resData.map(function(attr: any) {
                    if (attr.attrCtrlType === 'picklist' && attr.attrCtrlParams) {
                        if (usedLists.indexOf(attr.attrCtrlParams) < 0) {
                            usedLists.push(attr.attrCtrlParams);
                        }
                    }
                });
                if (usedLists && usedLists.length) {
                    const picklistUrl = '/picklists';
                    fetch(picklistUrl, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'                   
                        },
                        method: 'POST',
                        body: JSON.stringify(usedLists)
                    })
                        .then((res) => res.json())
                        .then((resLists) => {
                            this.setState({
                                knownMetaDictionary: dictionray,
                                knownPickLists: resLists,
                                metaLoaded: true
                            });
                        });
                }
                else {
                    this.setState({
                        knownMetaDictionary: dictionray,
                        knownPickLists: [],
                        metaLoaded: true
                    });
                }               
            });
    }

    getChildContext() {
        return {
            metaDictionary: this.state.knownMetaDictionary,
            cachedPickLists: this.state.knownPickLists
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

    handleHover(oldParentID: number, newParentID: number, targetID: number, sourceID: number){
        let expression = this.state.expression;
        let oldParent = this.getTargetNode(oldParentID, expression);
        let newParent = this.getTargetNode(newParentID, expression);

        let sourceIndex = oldParent.operands.findIndex((node: any) => node.nodeId == sourceID);
        let source = oldParent.operands[sourceIndex];

        if (sourceIndex.length < 0){
            // input was not correct
            return;
        }

        oldParent.operands.splice(sourceIndex, 1);

        let targetIndex = newParentID === targetID ? -1 : 
            newParent.operands.findIndex((node: any) => node.nodeId == targetID);

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

        if (expr.name == 'logic') {
            for (let i = 0; i < expr.operands.length; i++){
                let node = expr.operands[i];
                let result: any = this.getTargetNode(targetID, node);
                if (result){
                    return result;
                }
            }
        }
    }		

    removeChild(child: any) {
        this.addSimpleChild();
    }

    isAncestor(current: any) {
        return false;
    }

    replaceWithComplex(logic: ExpressionOperator, child: any) {
        if (child) {
            const newComplexNode: Expression = {
                name: 'logic',
                nodeId: AttrIdSingleton.NextUniqueNodeId,
                operator: logic,
                operands: [child]
            };
            this.setState({
                expression: newComplexNode
            });
        }
    }

    render() {
        if (!this.state.metaLoaded) {
            return (<div>Loading Metabase</div>);
        }
        else {
            let expression = this.state.expression;
            if (expression) {
                let buttons = (<div />);
                if (!this.props.readOnly) {
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
                                <ExpressionItem node={expression} readOnly={this.props.readOnly} parent={this} hoverCallback={this.handleHover} />
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