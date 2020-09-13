import React from 'react';
import { Card } from 'antd';
import type { CardProps } from 'antd/lib/card';

type Props = CardProps & {
  name: string;
}

const PluginCard: React.FC<Props> = ({ name, actions }) => {
  return (
    <Card actions={actions}>
      {/* TODO: https://github.com/ant-design/pro-components/pull/379/files#diff-9b2c55deb25c2f8fec0e59c7bf59ce4aR75 */}
      <Card.Meta title={name} description="暂无简介" />
    </Card>
  );
};

export default PluginCard;
