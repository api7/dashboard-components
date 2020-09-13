import React, { useState, useEffect } from 'react';
import { LinkOutlined, SettingOutlined } from '@ant-design/icons';
import { omit } from 'lodash';
import { JSONSchema7 } from 'json-schema';

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
}

const PluginPageApp: React.FC<Props> = ({ data = {}, disabled, onChange }) => {
  const [pluginName, setPluginName] = useState<string | undefined>();
  const [schema, setSchema] = useState<JSONSchema7>();
  const [allPlugins, setAllPlugins] = useState<Record<string, PluginPage.PluginMapperItem[]>>({});

  useEffect(() => {
    getList().then(setAllPlugins);
  }, []);

  return (
    <>
      {Object.entries(allPlugins).map(([category, plugins]) => {
        return (
          <PanelSection
            title={category}
            key={category}
            style={PanelSectionStyle}
          >
            {plugins.map(({ name }) => (
              <PluginCard
                name={name!}
                actions={[
                  <SettingOutlined
                    onClick={() => {
                      fetchPluginSchema(name!).then(schemaData => {
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
