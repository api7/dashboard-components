import { JSONSchema7 } from 'json-schema';

import { PLUGIN_MAPPER_SOURCE } from './data';
import { transformPlugin } from './transformer';
import { PluginPage } from './typing.d';
import request from './request';

enum Category {
  'Limit traffic',
  'Observability',
  'Security',
  'Authentication',
  'Log',
  'Other',
}

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

  return Object.keys(data).sort((a, b) => Category[a] - Category[b]).map(category => {
    return data[category].sort((a, b) => {
      return (a.priority || 9999) - (b.priority || 9999)
    })
  });
};

const cachedPluginSchema: Record<string, object> = {}
export const fetchPluginSchema = async (name: string): Promise<JSONSchema7> => {
  if (!cachedPluginSchema[name]) {
    cachedPluginSchema[name] = await request(`/schema/plugins/${name}`)
  }
  return transformPlugin(name, cachedPluginSchema[name], 'schema')
}
