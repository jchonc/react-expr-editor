import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';
import { AttrIdSingleton } from '../constants/constants';

const testComplexExpression: any = {
  name: 'logic',
  operator: 'And',
  nodeId: AttrIdSingleton.NextUniqueNodeId,
  isClone: false,
  operands: [
    {
      name: 'compare',
      attrId: '11001',
      nodeId: AttrIdSingleton.NextUniqueNodeId,
      attrCaption: 'First Name',
      operator: 'Equal',
      isClone: false,
      operands: ['Jian']
    },
    {
      name: 'compare',
      attrId: '11003',
      nodeId: AttrIdSingleton.NextUniqueNodeId,
      attrCaption: 'Gender',
      operator: 'NotEqual',
      isClone: false,
      operands: ['GD_MALE']
    },
    {
      name: 'compare',
      attrId: '11004',
      nodeId: AttrIdSingleton.NextUniqueNodeId,
      attrCaption: 'Birthday',
      operator: 'Equal',
      isClone: false,
      operands: ['2011-12-12']
    }
  ]
};

class App extends React.Component<{ }> {

  render() {

    return (
      <div className="container">
        <div className="row">
          <h2>Welcome to React</h2>
        </div>
        <ExpressionEditor
          moduleId={1}
          entityName={'patient'}
          root={testComplexExpression}
        />
      </div>
    );

  }
}

export default App;
