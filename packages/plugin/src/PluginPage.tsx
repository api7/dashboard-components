import React, { useState, useEffect } from 'react';
import { LinkOutlined, SettingOutlined, InfoOutlined } from '@ant-design/icons';
import { JSONSchema7 } from 'json-schema';
import { Anchor, Layout, Switch, Card, Tooltip, Button } from 'antd';

// @ts-ignore
import { PanelSection } from '@api7-dashboard/ui';

import PluginDrawer from './PluginDrawer';
import { getList, fetchPluginSchema } from './service';
import { transformPlugin } from './transformer';
import { PluginPage } from './typing.d';

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

const PluginPageApp: React.FC<Props> = ({ initialData = {}, onChange }) => {
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
                      <Switch checked={enabled} onChange={() => {}} key={`plugin-card-${name}-extra-switch`} />,
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
        initialData={pluginName ? transformPlugin(pluginName, initialData[pluginName], 'response') : {}}
        schema={schema!}
        onClose={() => setPluginName(undefined)}
        onFinish={(value) => {
          if (!pluginName) {
            return;
          }
          onChange && onChange({
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
