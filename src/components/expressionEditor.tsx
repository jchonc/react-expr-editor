import * as React from 'react';
import * as PropTypes from 'prop-types';
import ExpressionItem from '../components/expressionItem';
import './expressionEditor.css';
import Button from 'antd/lib/button';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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
    expression: any;
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
}

export default DragDropContext(HTML5Backend)(ExpressionEditor);