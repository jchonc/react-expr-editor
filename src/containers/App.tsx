import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';
<<<<<<< HEAD
import Button from 'antd/lib/button';
import { Expression } from '../types/index';

let testComplexExpression: Expression = {
=======
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
>>>>>>> master
  name: 'logic',
  operator: 'And',
  operands: [
<<<<<<< HEAD
    {
      name: 'compare',
      attrId: '11001',
      attrCaption: 'First Name',
      operator: 'Equal',
      operands: ['Jian']
    },
    {
      name: 'compare',
      attrId: '11003',
      attrCaption: 'Gender',
      operator: 'NotEqual',
      operands: ['GD_MALE']
    },
    {
      name: 'compare',
      attrId: '11004',
      attrCaption: 'Birthday',
      operator: 'Equal',
      operands: ['2011-12-12']
    }
=======
    {name: 'compare', attrId: '11001', nodeId: AttrIdSingleton.NextUniqueNodeId, attrCaption: 'First Name', operator: 'eq', operands: ['Jian'] },
    {name: 'compare', attrId: '11003', nodeId: AttrIdSingleton.NextUniqueNodeId, attrCaption: 'Gender', operator: 'ne', operands: ['GD_MALE'] },
    {name: 'compare', attrId: '11004', nodeId: AttrIdSingleton.NextUniqueNodeId, attrCaption: 'Birthday', operator: 'eq', operands: ['2011-12-12']}
>>>>>>> master
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

  // componentDidMount() {
  //   let r = new Request('/expressions/1');
  //   fetch(r).then((response) => {
  //     if (response.ok) {
  //       response.json().then((exp: Expression) => {
  //         this.setState({
  //           expression: exp
  //         });
  //       });
  //     }
  //   });
  // }

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
