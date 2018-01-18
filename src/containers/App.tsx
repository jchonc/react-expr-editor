import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';
import Button from 'antd/lib/button';
import { inject, observer } from 'mobx-react';
import { IExpressionStore } from '../types/index';

interface AppProps {
  expressionStore?: IExpressionStore;
}

interface AppState {
  expression: any;
}

@inject('expressionStore')
@observer
class App extends React.Component<AppProps, AppState> {

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
        <div>
          <Button type="primary" onClick={() => { this.reveal(); }}>Reveal</Button>
          <div id="expr_value" />
        </div>
      </div>
    );
  }
}

export default App;
