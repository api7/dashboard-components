import React, { useState, useEffect } from 'react';
import { LinkOutlined, SettingOutlined } from '@ant-design/icons';
import { omit } from 'lodash';
import { JSONSchema7 } from 'json-schema';
import { Anchor, Layout } from 'antd';

// @ts-ignore
import { PanelSection } from '@api7-dashboard/ui';

import PluginCard from './PluginCard';
import PluginDrawer from './PluginDrawer';
import { getList, fetchPluginSchema } from './service';
import { transformPlugin } from './transformer';
import { PluginPage } from './typing.d';

type Props = {
  disabled?: boolean;
  // NOTE: 从 API 中获取到的已经配置的 plugins
  data?: PluginPage.PluginData;
  onChange?(data: PluginPage.PluginData): void;
};

const PanelSectionStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 33.333%)',
  gridRowGap: 10,
  gridColumnGap: 10,
  width: 'calc(100% - 40px)',
};

const { Sider, Content } = Layout;

const PluginPageApp: React.FC<Props> = ({ data = {}, disabled, onChange }) => {
  const [pluginName, setPluginName] = useState<string | undefined>();
  const [schema, setSchema] = useState<JSONSchema7>();
  const [allPlugins, setAllPlugins] = useState<Record<string, PluginPage.PluginMapperItem[]>>({});

  useEffect(() => {
    getList().then(setAllPlugins);
  }, []);

  return (
    <>
      <Layout>
        <Sider theme="light">
          <Anchor offsetTop={150}>
            {Object.entries(allPlugins).map(([category]) => {
              return (
                <Anchor.Link
                  href={`#plugin-category-${category}`}
                  title={category}
                  key={category}
                />
              );
            })}
          </Anchor>
        </Sider>
        <Content style={{ padding: '0 10px' }}>
          {Object.entries(allPlugins).map(([category, plugins]) => {
            return (
              <PanelSection
                title={category}
                key={category}
                style={PanelSectionStyle}
                id={`plugin-category-${category}`}
              >
                {plugins.map(({ name }) => (
                  <PluginCard
                    name={name!}
                    actions={[
                      <SettingOutlined
                        onClick={() => {
                          fetchPluginSchema(name!).then((schemaData) => {
                            setSchema(schemaData);
                            setTimeout(() => {
                              setPluginName(name);
                            }, 300);
                          });
                        }}
                      />,
                      <LinkOutlined
                        onClick={() =>
                          window.open(
                            `https://github.com/apache/incubator-apisix/blob/master/doc/plugins/${name}.md`,
                          )
                        }
                      />,
                    ]}
                    key={name}
                  />
                ))}
              </PanelSection>
            );
          })}
        </Content>
      </Layout>
      <PluginDrawer
        name={pluginName}
        initialData={pluginName ? transformPlugin(pluginName, data[pluginName], 'response') : {}}
        active={false}
        schema={schema!}
        disabled={disabled}
        onActive={(name) => {
          //
        }}
        onInactive={(name) => {
          if (!onChange) {
            throw new Error('请提供 onChange 方法');
          }
          onChange(omit({ ...data }, name));
          //
          setPluginName(undefined);
        }}
        onClose={() => setPluginName(undefined)}
        onFinish={(value) => {
          if (!pluginName) {
            return;
          }
          if (!onChange) {
            throw new Error('请提供 onChange 方法');
          }
          onChange({
            ...data,
            [pluginName]: transformPlugin(pluginName, value, 'request'),
          });
          setPluginName(undefined);
        }}
      />
    </>
  );
};

export default PluginPageApp;
