import React from 'react';
import { INodeInnerDefaultProps, IPortDefaultProps } from '@mrblenny/react-flow-chart';

import { SOuter, SPortDefaultOuter } from './DrawPluginStyle';
import { PanelType } from './index';

export const NodeInnerCustom = ({ node }: INodeInnerDefaultProps) => {
  const { customData } = node.properties;
  if (customData.type === PanelType.Condition) {
    return (
      <SOuter>
        <p>判断条件：{customData.name || '(点击配置判断条件)'}</p>
      </SOuter>
    );
  }

  if (customData.type === PanelType.Plugin) {
    return (
      <SOuter>
        <p>插件名称：{customData.name || '(点击配置插件)'}</p>
      </SOuter>
    );
  }

  return (
    <SOuter>
      <br />
    </SOuter>
  );
};

export const PortCustom = (props: IPortDefaultProps) => (
  <SPortDefaultOuter>
    {props.port.properties && props.port.properties.value === 'yes' && (
      <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
        <path fill="white" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
      </svg>
    )}
    {props.port.properties && props.port.properties.value === 'no' && (
      <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
        <path
          fill="white"
          d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
        />
      </svg>
    )}
    {!props.port.properties && (
      <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
        <path fill="white" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
      </svg>
    )}
  </SPortDefaultOuter>
);
