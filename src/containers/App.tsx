import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';
import Button from 'antd/lib/button';
import { inject, observer } from 'mobx-react';
import { IExpressionStore } from '../types/index';

interface AppProps {
  expressionStore?: IExpressionStore;
}

@inject('expressionStore')
@observer
class App extends React.Component<AppProps> {

  reveal() {
    const result = JSON.stringify(this.props.expressionStore!.expression);
    document.getElementById('expr_value')!.innerHTML = result;
  }

  validate() {

    let validateNode = (node: any): boolean => {
      if (node.name === 'logic') {
        let result = true;
        for (let i = 0; i < node.operands.length && result; i++) {
          result = result && validateNode(node.operands[i]);
        }
        return result;
      } else {
        return node.isValid;
      }
    };

    this.setState({ valid: validateNode(this.props.expressionStore!.expression) });
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
          <Button onClick={() => { this.validate(); }}>validate</Button>
          <div id="expr_value" />
        </div>
      </div>
    );
  }
}

export default App;
