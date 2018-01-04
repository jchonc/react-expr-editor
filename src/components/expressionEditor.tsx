import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from '../components/expressionItem';
import './expressionEditor.css';

interface ExpressionEditorState {
    fullScreen: boolean;
}

interface ExpressionEditorProps {
    readonly: boolean;
    moduleId: number;
    entityName: string;
    expression: any;
}

const knownPickLists = [{
    listId: '1201',
    listCaption: 'Gender',
    items: [
        { cd: 'GD_MALE', caption: 'Male', description: 'Gentleman'},
        { cd: 'GD_FEMALE', caption: 'Female', description: 'Lady'}
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
}];

export default class ExpressionEditor extends React.Component<ExpressionEditorProps, ExpressionEditorState> {

    static childContextTypes = {
        metaDictionary: PropTypes.any,
        cachedPickLists: PropTypes.any
    };

    metaDictionary: any;
    cachedPickLists: any;

    constructor(props: any) {
        super(props);
        this.state = {
            fullScreen: false
        };
    }

    getChildContext() {
        return {
            metaDictionary: knownMetaDictionary,
            cachedPickLists: knownPickLists
        };
    }

    render() {
        let expression = this.props.expression;
        if ( expression ) {
            return (
                <div>
                    <div>Toolbar</div>
                    <div className="row expr-editor">
                        <div className="expr-canvas">
                            <ExpressionItem node={expression} readonly={this.props.readonly} parent={null} /> 
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