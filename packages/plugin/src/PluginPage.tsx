import React, { useState, useEffect } from 'react';
import { EyeFilled, SettingFilled } from '@ant-design/icons';
import { JSONSchema7 } from 'json-schema';
import { Anchor, Layout, Switch, Card, Tooltip, Button, notification, Avatar } from 'antd';
import { omit } from 'lodash';
import Ajv from 'ajv';

// @ts-ignore
import { PanelSection } from '@api7-dashboard/ui';

import PluginDrawer from './PluginDrawer';
import { getList, fetchPluginSchema } from './service';
import { transformPlugin } from './transformer';
import { PluginPage } from './typing.d';
import { PLUGIN_MAPPER_SOURCE } from './data';
import CodeMirrorDrawer from './CodeMirrorDrawer';

type Props = {
  readonly?: boolean;
  initialData?: PluginPage.FinalData;
  onChange?(data: PluginPage.FinalData): void;
  schemaType?: string;
};

const PanelSectionStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 33.333333%)',
  gridRowGap: 15,
  gridColumnGap: 10,
  width: 'calc(100% - 20px)',
};

const { Sider, Content } = Layout;

const PluginPageApp: React.FC<Props> = ({ initialData = {}, readonly, onChange = () => {}, schemaType='' }) => {
  const [pluginName, setPluginName] = useState<string | undefined>();
  const [schema, setSchema] = useState<JSONSchema7>();
  const [allPlugins, setAllPlugins] = useState<PluginPage.PluginMapperItem[][]>([]);
  const [codeMirrorCodes, setCodeMirrorCodes] = useState<object | undefined>();

  useEffect(() => {
    getList(initialData).then(setAllPlugins);
  }, [initialData]);

  const ajv = new Ajv();

  return (
    <>
      <style>{`
        .ant-avatar > img {
          object-fit: contain;
        }
        .ant-avatar {
          background-color: transparent;
        }
        .ant-avatar.ant-avatar-icon {
          font-size: 32px;
        }
      `}</style>
      <Layout>
        <Sider theme="light">
          <Anchor offsetTop={150}>
            {allPlugins.map((plugins) => {
              const { category } = plugins[0];
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
        <Content style={{ padding: '0 10px', backgroundColor: '#fff', minHeight: 1400 }}>
          {allPlugins.map((plugins) => {
            const { category } = plugins[0];
            return (
              <PanelSection
                title={category}
                key={category}
                style={PanelSectionStyle}
                id={`plugin-category-${category}`}
              >
                {plugins.map(({ name, enabled, avatar }) => (
                  <Card
                    key={name}
                    title={[
                      avatar && <Avatar
                        icon={avatar}
                        className="plugin-avatar"
                        style={{
                          marginRight: 5
                        }}
                      />,
                      <a
                        href={`https://github.com/apache/incubator-apisix/blob/master/doc/plugins/${name}.md`}
                        style={{ color: 'inherit' }}
                        target="_blank"
                      >
                        {name}
                      </a>
                    ]}
                    style={{ height: 66 }}
                    extra={[
                      <Tooltip title="View Raw" key={`plugin-card-${name}-extra-tooltip`}>
                        <Button
                          shape="circle"
                          icon={<EyeFilled />}
                          size="middle"
                          onClick={() => {
                            setCodeMirrorCodes(initialData[name]);
                          }}
                        />
                      </Tooltip>,
                      <Tooltip title="Setting" key={`plugin-card-${name}-extra-tooltip-2`}>
                        <Button
                          disabled={PLUGIN_MAPPER_SOURCE[name]?.noConfiguration}
                          shape="circle"
                          icon={<SettingFilled />}
                          style={{ marginRight: 10, marginLeft: 10 }}
                          size="middle"
                          onClick={() => {
                            fetchPluginSchema(name!, schemaType).then((schemaData) => {
                              setSchema(schemaData);
                              setTimeout(() => {
                                setPluginName(name);
                              }, 300);
                            });
                          }}
                        />
                      </Tooltip>,
                      <Switch
                        defaultChecked={enabled}
                        disabled={readonly}
                        onChange={(isChecked) => {
                          // NOTE: 当前生命周期为：若关闭插件，则移除数据状态；再启用时，该插件一定是没有状态的。
                          if (isChecked) {
                            const data = initialData[name] || {};
                            fetchPluginSchema(name!, schemaType).then((schemaData) => {
                              const validate = ajv.validate(schemaData, data);
                              if (validate) {
                                onChange({ ...initialData, [name]: data });
                              } else {
                                notification.warning({ message: `请配置插件 ${name}` });
                                setSchema(schemaData);
                                setTimeout(() => {
                                  setPluginName(name);
                                }, 300);
                              }
                            });
                          } else {
                            onChange(omit({ ...initialData }, [name!]));
                          }
                        }}
                        key={Math.random().toString(36).substring(7)}
                      />,
                    ]}
                  />
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
        readonly={readonly}
        schema={schema!}
        onClose={() => {
          setPluginName(undefined);
        }}
        onFinish={(value) => {
          if (!pluginName) {
            return;
          }
          onChange({
            ...initialData,
            [pluginName]: transformPlugin(pluginName, value, 'request'),
          });
          setPluginName(undefined);
        }}
      />
      <CodeMirrorDrawer
        visiable={Boolean(codeMirrorCodes)}
        data={codeMirrorCodes || {}}
        onClose={() => setCodeMirrorCodes(undefined)}
      />
    </>
  );
};

export default PluginPageApp;
