import React from 'react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';

interface Props extends CardProps {
  name: string;
}

const PluginCard: React.FC<Props> = ({ name, actions }) => {
  return (
    <Card actions={actions}>
      <Card.Meta title={name} description="暂无简介" />
    </Card>
  );
};

export default PluginCard;
