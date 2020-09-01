import React, { Fragment, useState, useEffect } from 'react';
import { cloneDeep } from 'lodash';
import { FlowChart, IFlowChartCallbacks } from '@mrblenny/react-flow-chart';
import * as actions from '@mrblenny/react-flow-chart/src/container/actions';
import { Form, Input, Button, Collapse, Divider } from 'antd';
import { withTheme } from '@rjsf/core';
// @ts-ignore
import { Theme as AntDTheme } from '@rjsf/antd';
import { JSONSchema7 } from 'json-schema';

import { PluginPageType } from '../../plugin/src';
import { Page, SidebarItem } from './components';
import { INIT_CHART, PLUGINS_PORTS, CONDITION_PORTS } from './constants';
import { SMessage, SContent, SSidebar } from './DrawPluginStyle';
import { PortCustom, NodeInnerCustom } from './customConfig';
import { fetchPluginList, fetchPluginSchema } from './service';

export * from './transform';

export enum PanelType {
  Plugin,
  Condition,
  Default,
}

type Props = {
  data: any;
  onChange(data: PluginPageType.DrawData): void;
};

const { Panel } = Collapse;

const PluginForm = withTheme(AntDTheme);

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const SelectedSidebar: React.FC<Props> = ({ data = {}, onChange }) => {
  const [form] = Form.useForm();
  const [chart, setChart] = useState(cloneDeep(Object.keys(data).length ? data : INIT_CHART));
  const [schema, setSchema] = useState<JSONSchema7>();
  const [selectedType, setSelectedType] = useState<PanelType>(PanelType.Default);
  const [pluginNameList, setPluginNameList] = useState<string[]>([]);

  const getCustomDataById = (id = chart.selected.id) => {
    if (!id || !chart.nodes[id].properties) {
      return {};
    }
    return chart.nodes[id].properties.customData;
  };

  const stateActionCallbacks = Object.keys(actions).reduce((obj, key) => {
    const clonedObj = cloneDeep(obj);
    clonedObj[key] = (...args: any) => {
      const action = actions[key];
      const newChartTransformer = action(...args);
      const newChart = newChartTransformer(chart);
      if (
        ['onLinkMouseEnter', 'onLinkMouseLeave', 'onNodeMouseEnter', 'onNodeMouseLeave'].includes(
          key,
        )
      ) {
        return newChart;
      }

      if (key === 'onDragCanvasStop') {
        setSelectedType(PanelType.Default);
        return newChart;
      }

      setChart({ ...chart, ...newChart });
      if (['onCanvasDrop', 'onNodeClick'].includes(key)) {
        const { type, name } = getCustomDataById(args.nodeId);
        setSelectedType(type);
        if (type === PanelType.Plugin && name) {
          fetchPluginSchema(name).then(setSchema);
        }
      }
      onChange(newChart);
      return newChart;
    };
    return clonedObj;
  }, {}) as IFlowChartCallbacks;

  useEffect(() => {
    fetchPluginList().then((r: string[]) => {
      setPluginNameList(r.sort());
    });
  }, []);

  const renderSidebar = () => {
    if (selectedType === PanelType.Condition) {
      form.setFieldsValue({ condition: getCustomDataById().name });
      return (
        <SMessage>
          <Form
            {...layout}
            name="basic"
            form={form}
            onFinish={(values) => {
              const clonedChart = cloneDeep(chart);
              clonedChart.nodes[chart.selected.id!].properties.customData.name = values.condition;
              setChart(clonedChart);
              onChange(clonedChart);
              setSelectedType(PanelType.Default);
            }}
          >
            <Form.Item
              label="判断条件"
              name="condition"
              rules={[{ required: true, message: '请输入判断条件!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </SMessage>
      );
    }
    if (selectedType === PanelType.Plugin && schema) {
      return (
        <SMessage style={{ overflow: 'scroll' }}>
          <PluginForm
            schema={schema}
            liveValidate
            formData={getCustomDataById().data || {}}
            showErrorList={false}
            onSubmit={({ formData }) => {
              const clonedChart = cloneDeep(chart);
              clonedChart.nodes[chart.selected.id!].properties.customData.data = formData;
              setChart(clonedChart);
              onChange(clonedChart);
              setSelectedType(PanelType.Default);
            }}
          >
            {/* NOTE: 留空，用于隐藏 Submit 按钮 */}
            <Fragment />

            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </PluginForm>
        </SMessage>
      );
    }

    return (
      <SSidebar>
        <SMessage style={{ fontSize: '16px', fontWeight: 'bold' }}>拖动所需组件至面板</SMessage>
        <Divider style={{ margin: '0px' }} />
        <SidebarItem
          type="判断条件"
          ports={CONDITION_PORTS}
          properties={{
            customData: {
              type: PanelType.Condition,
            },
          }}
        />

        <Collapse>
          <Panel header="选择插件" key="1">
            <div
              style={{
                overflowY: 'scroll',
                height: '300px',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {pluginNameList &&
                pluginNameList.map((name) => {
                  return (
                    <SidebarItem
                      key={name}
                      type={name}
                      ports={PLUGINS_PORTS}
                      properties={{
                        customData: {
                          type: PanelType.Plugin,
                          name,
                        },
                      }}
                    />
                  );
                })}
            </div>
          </Panel>
        </Collapse>
      </SSidebar>
    );
  };
  return (
    <Page>
      <SContent>
        <FlowChart
          chart={chart}
          callbacks={stateActionCallbacks}
          config={{
            zoom: { wheel: { disabled: true } },
            }}
          Components={{
            Port: PortCustom,
            NodeInner: NodeInnerCustom,
          }}
        />
      </SContent>
      <SSidebar>{renderSidebar()}</SSidebar>
    </Page>
  );
};

export default SelectedSidebar;
