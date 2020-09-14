import React, { useState, useEffect } from 'react';
import { LinkOutlined, SettingOutlined, InfoOutlined } from '@ant-design/icons';
import { JSONSchema7 } from 'json-schema';
import { Anchor, Layout, Switch, Card, Tooltip, Button, notification } from 'antd';
import { omit } from 'lodash';

// @ts-ignore
import { PanelSection } from '@api7-dashboard/ui';

import PluginDrawer from './PluginDrawer';
import { getList, fetchPluginSchema } from './service';
import { transformPlugin } from './transformer';
import { PluginPage } from './typing.d';
import { PLUGIN_MAPPER_SOURCE } from './data';

type Props = {
  // NOTE: 从 API 中获取到的已经配置的 plugins
  initialData?: PluginPage.FinalData;
  onChange?(data: PluginPage.FinalData): void;
};

const PanelSectionStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 33.333%)',
  gridRowGap: 10,
  gridColumnGap: 10,
  width: 'calc(100% - 40px)',
};

const { Sider, Content } = Layout;

const PluginPageApp: React.FC<Props> = ({ initialData = {}, onChange = () => {} }) => {
  const [pluginName, setPluginName] = useState<string | undefined>();
  const [schema, setSchema] = useState<JSONSchema7>();
  const [allPlugins, setAllPlugins] = useState<Record<string, PluginPage.PluginMapperItem[]>>({});

  useEffect(() => {
    getList(initialData).then(setAllPlugins);
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
        <Content style={{ padding: '0 10px', backgroundColor: '#fff' }}>
          {Object.entries(allPlugins).map(([category, plugins]) => {
            return (
              <PanelSection
                title={category}
                key={category}
                style={PanelSectionStyle}
                id={`plugin-category-${category}`}
              >
                {plugins.map(({ name, enabled }) => (
                  <Card
                    key={name}
                    title={name}
                    extra={[
                      <Tooltip title="View Raw" key={`plugin-card-${name}-extra-tooltip`}>
                        <Button
                          shape="circle"
                          icon={<InfoOutlined />}
                          size="small"
                          style={{ marginRight: 10 }}
                          // TODO
                          onClick={() => alert('待开发')}
                        />
                      </Tooltip>,
                      <Switch
                        defaultChecked={enabled}
                        onChange={(isChecked) => {
                          // NOTE: 当前生命周期为：若关闭插件，则移除数据状态；再启用时，该插件一定是没有状态的。
                          const data = { ...initialData, [name]: initialData[name] || {} };
                          if (isChecked) {
                            notification.info({ message: `请配置插件 ${name}` });
                            onChange(data);
                          } else {
                            onChange(omit(data, [name!]));
                          }
                        }}
                        key={`plugin-card-${name}-extra-switch-${enabled}`}
                      />,
                    ]}
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
                  >
                    {/* TODO: https://github.com/ant-design/pro-components/pull/379/files#diff-9b2c55deb25c2f8fec0e59c7bf59ce4aR75 */}
                    <Card.Meta description="暂无简介" />
                  </Card>
                ))}
              </PanelSection>
            );
          })}
        </Content>
      </Layout>
      <PluginDrawer
        name={pluginName}
        initialData={
          pluginName ? transformPlugin(pluginName, initialData[pluginName], 'response') : {}
        }
        schema={schema!}
        onClose={() => setPluginName(undefined)}
        onFinish={(value) => {
          if (!pluginName) {
            return;
          }

          const { category = 'Other' } = PLUGIN_MAPPER_SOURCE[pluginName] || {};
          const newAllPlugins = { ...allPlugins };
          newAllPlugins[category] = newAllPlugins[category].map((item) => {
            if (item.name === pluginName) {
              return { ...item, enabled: true };
            }
            return item;
          });
          setAllPlugins(newAllPlugins);

          onChange({
            ...initialData,
            [pluginName]: transformPlugin(pluginName, value, 'request'),
          });
          setPluginName(undefined);
        }}
      />
    </>
  );
};

export default PluginPageApp;
