import React from 'react';
import { Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const App: React.FC = () => {
  return (
    <div>
      示例组件：
      <Button>
        <BellOutlined /> Button
      </Button>
    </div>
  );
};

export default App;
