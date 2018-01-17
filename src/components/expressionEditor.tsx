import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from '../components/expressionItem';
import './expressionEditor.css';
import { Button } from 'react-bootstrap';
import { AttrIdSingleton } from '../constants/constants';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

interface ExpressionEditorState {
    expression: any;
}

interface ExpressionEditorProps {
    readOnly: boolean;
    moduleId: number;
    entityName: string;
    expression: any;
}

const knownPickLists = [{
    listName: 'Gender',
    items: [
        { value: 'GD_MALE', label: 'Male', description: 'Gentleman'},
        { value: 'GD_FEMALE', label: 'Female', description: 'Lady'}
    ]
}];

const knownMetaDictionary = [{
    attrId: '11001',
    attrCaption: 'First Name',
    attrDataType: 'string',
    attrCtrlType: 'text',
    attrCtrlParams: ''
}, {
    attrId: '11002',
    attrCaption: 'Last Name',
    attrDataType: 'string',
    attrCtrlType: 'text',
    attrCtrlParams: ''
}, {
    attrId: '11003',
    attrCaption: 'Gender',
    attrDataType: 'string',
    attrCtrlType: 'picklist',
    attrCtrlParams: 'Gender'
}, {
    attrId: '11004',
    attrCaption: 'Birthday',
    attrDataType: 'date',
    attrCtrlType: 'date',
    attrCtrlParams: ''
   
}];

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
            expression: props.expression
        };
        this.addSimpleChild = this.addSimpleChild.bind(this);
        this.removeChild = this.removeChild.bind(this);
        this.replaceWithComplex = this.replaceWithComplex.bind(this);
        this.handleHover = this.handleHover.bind(this);
    }

    getChildContext() {
        return {
            metaDictionary: knownMetaDictionary,
            cachedPickLists: knownPickLists
        };
    }

    addSimpleChild() {
        this.setState({
            expression: { 
                name: 'compare', 
                attrId: '',  
                nodeId: AttrIdSingleton.NextUniqueNodeId, 
                attrCaption: '', 
                operator: '', 
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

        console.log(oldParent.operands);
        console.log(sourceIndex);

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

     getTargetNode(targetID: number, expr: any){
        
        if (expr.nodeId === targetID){
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

    replaceWithComplex(logic: string, child: any) {
        if (child) {
            const newComplexNode = {
                nodeId: AttrIdSingleton.NextUniqueNodeId,
                name: 'logic',
                operator: logic,
                operands: [child]
            };
            this.setState({
                expression: newComplexNode
            });
        }
    }

    render() {
        let expression = this.state.expression;
        if ( expression ) {
            let buttons = (<div />);
            if (!this.props.readOnly) {
                buttons = (
                    <div>
                        <Button type="button">Copy</Button>
                        <Button type="button">Paste</Button>
                        <Button type="button">Clear</Button>
                    </div>
                );
            }
            return (
                <div>
                    {buttons}
                    <div className="row expr-editor">
                        <div className="expr-canvas">
                            <ExpressionItem node={expression} readOnly={this.props.readOnly} parent={this} hoverCallback={this.handleHover}/> 
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

export default DragDropContext(HTML5Backend)(ExpressionEditor);