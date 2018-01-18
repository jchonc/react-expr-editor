import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';
import Button from 'antd/lib/button';

import { IExpressionStore } from '../types/index';
import { inject, observer } from 'mobx-react';

interface AppProps {
  expressionStore?: IExpressionStore;
}

@inject('expressionStore')
@observer
class App extends React.Component<AppProps> {

  render() {
    const { expressionStore } = this.props;
    if (expressionStore) {
      return (
        <div className="container">
          <div className="row">
            <h2>Welcome to React</h2>
          </div>
          <ExpressionEditor
            readOnly={expressionStore.readonly}
            moduleId={expressionStore.moduleId}
            entityName={expressionStore.entityName}
            expression={expressionStore.expression}
          />
          <hr />
          {!expressionStore.valid && <div className="error">There is an error</div>}
          <div>
            <Button onClick={() => { expressionStore.reveal(); }}>Reveal</Button>
            <Button onClick={() => { expressionStore.validate(); }}>validate</Button>
            <div id="expr_value" />
          </div>
        </div>
      );
    }
    return;
  }
}

export default App;
