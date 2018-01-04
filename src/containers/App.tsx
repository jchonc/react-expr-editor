import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';

/*
let testExpression = {
  name: 'compare',
  attrId: '11001',
  attrCaption: 'First Name',
  operator: 'eq',
  operands: ['Jian']
};*/

let testComplexExpression = {
  name: 'logic',
  operator: 'and',
  operands: [
    {name: 'compare', attrId: '11001', attrCaption: 'First Name', operator: 'eq', operands: ['Jian'] },
    {name: 'compare', attrId: '11003', attrCaption: 'Gender', operator: 'ne', operands: ['Male'] },
  ]
};

class App extends React.Component {

  render() {
    return (
      <div className="container">
        <div className="row">
          <h2>Welcome to React</h2>
        </div>
        <ExpressionEditor readonly={false} moduleId={1} entityName="patient" expression={testComplexExpression} />
      </div>
    );
  }
}

export default App;
