import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';
import { AttrIdSingleton } from '../constants/constants';
import Button from 'antd/lib/button';

/*
let testExpression = {
  name: 'compare',
  attrId: '11001',
  attrCaption: 'First Name',
  operator: 'eq',
  operands: ['Jian']
};*/
import { IExpressionTreeNode, IExpressionStore } from '../types/index';
import { inject, observer } from 'mobx-react';

let testComplexExpression: IExpressionTreeNode = {
  nodeId: AttrIdSingleton.NextUniqueNodeId,
  name: 'logic',
  operator: 'And',
  operands: [
    {
      name: 'compare',
      attrId: '11001',
      nodeId: AttrIdSingleton.NextUniqueNodeId,
      attrCaption: 'First Name',
      operator: 'Equal',
      operands: ['Jian']
    },
    {
      name: 'compare',
      attrId: '11003',
      nodeId: AttrIdSingleton.NextUniqueNodeId,
      attrCaption: 'Gender',
      operator: 'NotEqual',
      operands: ['GD_MALE']
    },
    {
      name: 'compare',
      attrId: '11004',
      nodeId: AttrIdSingleton.NextUniqueNodeId,
      attrCaption: 'Birthday',
      operator: 'Equal',
      operands: ['2011-12-12']
    },
    {
      name: 'compare',
      attrId: '11005',
      nodeId: AttrIdSingleton.NextUniqueNodeId,
      attrCaption: 'Owner',
      operator: 'Equal',
      operands: ['jzhou@rlsolutions.com(Jian Zhou)']
    }
  ]
};

interface AppProps {
  expressionStore?:IExpressionStore
 }

@inject('expressionStore')
@observer
class App extends React.Component<AppProps> {

  reveal() {
    const result = JSON.stringify(this.props.expressionStore!.expression);
    document.getElementById('expr_value')!.innerHTML = result;
  }

  render() {
    console.dir(this.props.expressionStore);
    return (
      <div className="container">
        <div className="row">
          <h2>Welcome to React</h2>
        </div>
        <ExpressionEditor
          readOnly={this.props.expressionStore!.readonly}
          moduleId={this.props.expressionStore!.moduleId}
          entityName={this.props.expressionStore!.entityName}
          expression={this.props.expressionStore!.expression}
        />
        <hr />
        {!this.props.expressionStore!.valid && <div className="error">There is an error</div>}
        <div>
          <Button onClick={() => { this.reveal(); }}>Reveal</Button>
          <Button onClick={() => { this.props.expressionStore!.validate(); }}>validate</Button>
          <div id="expr_value" />
        </div>
      </div>
    );
  }
}

export default App;
