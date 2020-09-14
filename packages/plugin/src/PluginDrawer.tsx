import React, { Fragment, useRef } from 'react';
import { Drawer, Button } from 'antd';
import { withTheme, FormProps } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';
// @ts-ignore
import { Theme as AntDTheme } from '@rjsf/antd';

type Props = {
  name?: string;
  initialData: any;
  schema: JSONSchema7;
  onClose(): void;
  onFinish(values: any): void;
};

const PluginForm = withTheme(AntDTheme);

const PluginDrawer: React.FC<Props> = ({ name, schema, initialData, onClose, onFinish }) => {
  if (!name) {
    return null;
  }

  const form = useRef<any>(null)
  return (
    <Drawer
      title={`配置 ${name} 插件`}
      width={500}
      visible={Boolean(name)}
      destroyOnClose
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            style={{ marginRight: 8, marginLeft: 8 }}
            onClick={() => {
              form.current?.submit();
            }}
          >
            确认
          </Button>
        </div>
      }
    >
      <PluginForm
        schema={schema}
        liveValidate
        formData={initialData}
        showErrorList={false}
        // @ts-ignore
        ref={(_form: FormProps<any>) => {
          form.current = _form;
        }}
        onSubmit={({ formData }) => {
          onFinish(formData);
        }}
      >
        {/* NOTE: 留空，用于隐藏 Submit 按钮 */}
        <Fragment />
      </PluginForm>
    </Drawer>
  );
};

export default PluginDrawer;
