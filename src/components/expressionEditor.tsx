import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from '../components/expressionItem';
import './expressionEditor.css';
import { Button } from 'react-bootstrap';

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
    }

    getChildContext() {
        return {
            metaDictionary: knownMetaDictionary,
            cachedPickLists: knownPickLists
        };
    }

    addSimpleChild() {
        this.setState({
            expression: { name: 'compare', attrId: '', attrCaption: '', operator: '', operands: [''] }
        });
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
                            <ExpressionItem node={expression} readOnly={this.props.readOnly} parent={this} /> 
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