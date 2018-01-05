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
    {name: 'compare', attrId: '11003', attrCaption: 'Gender', operator: 'ne', operands: ['GD_MALE'] },
    {name: 'compare', attrId: '11004', attrCaption: 'Birthday', operator: 'eq', operands: ['2011-12-12']}
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
    this.state =  {
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
        <ExpressionEditor readonly={false} moduleId={1} entityName="patient" expression={this.state.expression} />
        <hr/>
        <div>
            <button type="button" onClick={() => {this.reveal(); }}>Reveal</button>
            <div id="expr_value" />
        </div>
      </div>
    );
  }
}

export default App;
