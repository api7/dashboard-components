import React, { CSSProperties } from 'react';
import { Divider } from 'antd';

const PanelSection: React.FC<{
  title: string;
  style?: CSSProperties;
  id?: string;
}> = ({ title, style, id, children }) => {
  return (
    <div id={id}>
      <Divider orientation="left">{title}</Divider>
      <div style={style}>{children}</div>
    </div>
  );
};

export default PanelSection;
