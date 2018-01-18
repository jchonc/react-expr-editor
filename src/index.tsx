import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import expressionStore from './stores/ExpressionStore';
import { AttrIdSingleton } from './constants/constants';
import { IExpressionTreeNode } from './types/index';

const stores = {
  expressionStore
};

let testComplexExpression: IExpressionTreeNode = {
  name: 'logic',
  operator: 'And',
  nodeId: AttrIdSingleton.NextUniqueNodeId,
  operands: [
    {
      name: 'compare',
      attrId: '11001',
      nodeId: AttrIdSingleton.NextUniqueNodeId,
      attrCaption: 'First Name',
      operator: 'Equal',
      operands: ['Jian']
    },
    {
      name: 'compare',
      attrId: '11003',
      nodeId: AttrIdSingleton.NextUniqueNodeId,
      attrCaption: 'Gender',
      operator: 'NotEqual',
      operands: ['GD_MALE']
    },
    {
      name: 'compare',
      attrId: '11004',
      nodeId: AttrIdSingleton.NextUniqueNodeId,
      attrCaption: 'Birthday',
      operator: 'Equal',
      operands: ['2011-12-12']
    }
  ]
};

stores.expressionStore.setExpressionTree(testComplexExpression);

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
