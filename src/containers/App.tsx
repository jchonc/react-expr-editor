import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';
import Button from 'antd/lib/button';

/*
let testExpression = {
  name: 'compare',
  attrId: '11001',
  attrCaption: 'First Name',
  operator: 'eq',
  operands: ['Jian']
};*/
export enum ExpressionType {
  Logic,
  Compare
}

export enum ExpressionOperator {
  And,
  Or,
  Equal,
  NotEqual,
  IsBetween,
  IsNotBetween
}

export interface ExpressionOperand {
  name: ExpressionType;
}

export type Expression = {
  name: ExpressionType,
  operator: ExpressionOperator,
  operands?: Expression[] | string[],
  attrId?: string,
  attrCaption?: string
};

let testComplexExpression: Expression = {
  name: ExpressionType.Logic,
  operator: ExpressionOperator.And,
  operands: [
    {
      name: ExpressionType.Compare,
      attrId: '11001',
      attrCaption: 'First Name',
      operator: ExpressionOperator.Equal,
      operands: ['Jian']
    },
    {
      name: ExpressionType.Compare,
      attrId: '11003',
      attrCaption: 'Gender',
      operator: ExpressionOperator.NotEqual,
      operands: ['GD_MALE']
    },
    {
      name: ExpressionType.Compare,
      attrId: '11004',
      attrCaption: 'Birthday',
      operator: ExpressionOperator.Equal,
      operands: ['2011-12-12']
    }
  ]
};

interface AppProps {

}

interface AppState {
  expression: any;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      expression: testComplexExpression
    };
  }

  reveal() {
    const result = JSON.stringify(this.state.expression);
    document.getElementById('expr_value')!.innerHTML = result;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <h2>Welcome to React</h2>
        </div>
        <ExpressionEditor readOnly={false} moduleId={1} entityName="patient" expression={this.state.expression} />
        <hr />
        <div>
          <Button type="primary" onClick={() => { this.reveal(); }}>Reveal</Button>
          <div id="expr_value" />
        </div>
      </div>
    );
  }
}

export default App;
