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
    root: number;
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

        this.removeChild = this.removeChild.bind(this);
        this.replaceWithComplex = this.replaceWithComplex.bind(this);
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

    removeChild(child: any) {
        this.props.expressionStore!.addSimpleChild(child.parent.nodeId);
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
                operands: [child],
                isClone: false
            };
            this.setState({
                expression: newComplexNode
            });
        }
    }

    render() {
        if (!this.props.expressionStore!.metaLoaded) {
            return <div>Loading Metabase</div>;
        }
        else {
            let expression = this.props.expressionStore!.expressionMap;
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
                                    node={this.props.root}
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