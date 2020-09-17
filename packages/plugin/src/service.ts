import { JSONSchema7 } from 'json-schema';

import { PLUGIN_MAPPER_SOURCE } from './data';
import { transformPlugin } from './transformer';
import { PluginPage } from './typing.d';
import request from './request';

export const fetchPluginList = (): Promise<string[]> => request<string[]>('/plugins');

let cachedPluginNameList: string[] = []
export const getList = async (plugins: Record<string, object>) => {
  if (!cachedPluginNameList.length) {
    cachedPluginNameList = await fetchPluginList()
  }
  const names = cachedPluginNameList;
  const data: Record<string, PluginPage.PluginMapperItem[]> = {};
  const enabledPluginNames = Object.keys(plugins);
  names.forEach((name) => {
    const plugin = PLUGIN_MAPPER_SOURCE[name] || {};
    const { category = 'Other', hidden = false } = plugin;

    if (!data[category]) {
      data[category] = [];
    }

    if (!hidden) {
      data[category] = data[category].concat({
        ...plugin,
        name,
        enabled: enabledPluginNames.includes(name),
      });
    }
  });
  return data;
};

export const fetchPluginSchema = (name: string): Promise<JSONSchema7> =>
  request(`/schema/plugins/${name}`).then((data: any) => transformPlugin(name, data, 'schema'));
