import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';

const testComplexExpression: any = {
  name: 'logic',
  operator: 'And',
  isClone: false,
  operands: [
    {
      name: 'compare',
      attrId: '11001',
      attrCaption: 'First Name',
      operator: 'Equal',
      isClone: false,
      operands: ['Jian']
    },
    {
      name: 'compare',
      attrId: '11003',
      attrCaption: 'Gender',
      operator: 'NotEqual',
      isClone: false,
      operands: ['GD_MALE']
    },
    {
      name: 'compare',
      attrId: '11004',
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
