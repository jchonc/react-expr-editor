import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';
import { AttrIdSingleton } from '../constants/constants';

/*
let testExpression = {
  name: 'compare',
  attrId: '11001',
  attrCaption: 'First Name',
  operator: 'eq',
  operands: ['Jian']
};*/

let testComplexExpression = {
  nodeId: AttrIdSingleton.NextUniqueNodeId,
  name: 'logic',
  operator: 'and',
  operands: [
    {name: 'compare', attrId: '11001', nodeId: AttrIdSingleton.NextUniqueNodeId, attrCaption: 'First Name', operator: 'eq', operands: ['Jian'] },
    {name: 'compare', attrId: '11003', nodeId: AttrIdSingleton.NextUniqueNodeId, attrCaption: 'Gender', operator: 'ne', operands: ['GD_MALE'] },
    {name: 'compare', attrId: '11004', nodeId: AttrIdSingleton.NextUniqueNodeId, attrCaption: 'Birthday', operator: 'eq', operands: ['2011-12-12']}
  ]
};

interface AppProps {

}

interface AppState {
  expression: any;
  valid: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state =  {
      expression: testComplexExpression,
      valid: true
    };
  }

  reveal() {
    const result = JSON.stringify(this.state.expression);
    document.getElementById('expr_value')!.innerHTML = result;
  }

  validate(){

    let validateNode = (node: any): boolean =>{
      if (node.name == 'logic') {
        let result = true;
        for (let i = 0 ; i < node.operands.length && result; i++){
          result = result && validateNode(node.operands[i]);
        }
        return result;
      } else {
        return node.isValid
      }
    }

    this.setState({ valid: validateNode(this.state.expression)});
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <h2>Welcome to React</h2>
        </div>
        <ExpressionEditor readOnly={false} moduleId={1} entityName="patient" expression={this.state.expression} />
        <hr/>
        {!this.state.valid && <div className='error'>There is an error</div>}
        <div>
            <button type="button" onClick={() => {this.reveal(); }}>Reveal</button>
            <button type="button" onClick={() => {this.validate(); }}>validate</button>
            <div id="expr_value" />
        </div>
      </div>
    );
  }
}

export default App;
