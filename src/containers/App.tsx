import * as React from 'react';
import './App.css';
import ExpressionEditor from '../components/expressionEditor';
import expressionStore from '../stores/ExpressionStore';
import { autorun } from 'mobx';
import { NodeFactory } from '../types/index';
import { Layout, Row, Col } from 'antd';
const { Header, Content } = Layout;
const testComplexExpression: any = {
  name: 'logic',
  operator: 'And',
  isClone: false,
  operands: [
    {
      name: 'compare',
      attrId: '11001',
      attrCaption: 'First Name',
      operator: 'EQUALS',
      isClone: false,
      operands: ['Jian']
    },
    {
      name: 'compare',
      attrId: '11003',
      attrCaption: 'Gender',
      operator: 'NOT_EQUALS',
      isClone: false,
      operands: ['GD_MALE']
    },
    {
      name: 'compare',
      attrId: '11004',
      attrCaption: 'Birthday',
      operator: 'EQUALS_IS',
      isClone: false,
      operands: ['2011-12-12']
    }
  ]
};

class App extends React.Component<{}> {
  componentDidMount() {
    autorun(
      () => {
        if (expressionStore && expressionStore.expression) {
          document.getElementById('expr_value')!.innerHTML =
            JSON.stringify(NodeFactory.SaveExpression(expressionStore.expression), null, 2);
        }
      },
      this
    );
  }
  render() {
    return (
      <Layout>

        <Header>
          <h2>Welcome to React</h2>
        </Header>
        <Content>
          <Row>
            <Col span={16}>
              <ExpressionEditor
                moduleId={1}
                entityName={'patient'}
                root={testComplexExpression}
              />
            </Col>
            <Col>
              <pre id="expr_value" />
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default App;
