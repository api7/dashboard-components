import React, { useState, useEffect } from 'react';
import { EyeFilled, SettingFilled } from '@ant-design/icons';
import { JSONSchema7 } from 'json-schema';
import { Anchor, Layout, Switch, Card, Tooltip, Button, notification } from 'antd';
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
};

const PanelSectionStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 33.333333%)',
  gridRowGap: 15,
  gridColumnGap: 10,
  width: 'calc(100% - 20px)',
};

const { Sider, Content } = Layout;

const PluginPageApp: React.FC<Props> = ({ initialData = {}, readonly, onChange = () => {} }) => {
  const [pluginName, setPluginName] = useState<string | undefined>();
  const [schema, setSchema] = useState<JSONSchema7>();
  const [allPlugins, setAllPlugins] = useState<Record<string, PluginPage.PluginMapperItem[]>>({});
  const [codeMirrorCodes, setCodeMirrorCodes] = useState<object | undefined>();

  useEffect(() => {
    getList(initialData).then(setAllPlugins);
  }, []);

  const ajv = new Ajv();

  const resetAllPlugins = () => {
    if (!pluginName) {
      return
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
  };

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
        <Content style={{ padding: '0 10px', backgroundColor: '#fff', minHeight: 1300 }}>
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
                    title={
                      <a
                        href={`https://github.com/apache/incubator-apisix/blob/master/doc/plugins/${name}.md`}
                        style={{ color: 'inherit' }}
                        target="_blank"
                      >
                        {name}
                      </a>
                    }
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
                            fetchPluginSchema(name!).then((schemaData) => {
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
                          const data = { ...initialData, [name]: initialData[name] || {} };
                          if (isChecked) {
                            fetchPluginSchema(name!).then((schemaData) => {
                              const validate = ajv.validate(schemaData, initialData[name] || {});
                              if (validate) {
                                onChange(data);
                              } else {
                                notification.warning({ message: `请配置插件 ${name}` });
                                setSchema(schemaData);
                                setTimeout(() => {
                                  setPluginName(name);
                                }, 300);
                              }
                            });
                          } else {
                            onChange(omit(data, [name!]));
                          }
                        }}
                        key={Math.random().toString(36).substring(7)}
                      />,
                    ]}
                  ></Card>
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
          resetAllPlugins();
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
