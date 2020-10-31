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

export const fetchPluginList = () => request<PluginPage.Response>('/plugins');

let cachedPluginNameList: string[] = [];
export const getList = async (plugins: Record<string, object> = {}) => {
  if (!cachedPluginNameList.length) {
    cachedPluginNameList = (await fetchPluginList()).data;
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

  return Object.keys(data)
    .sort((a, b) => Category[a] - Category[b])
    .map((category) => {
      return data[category].sort((a, b) => {
        return (a.priority || 9999) - (b.priority || 9999);
      });
    });
};

/** cache pulgin schema by schemaType
 *  default schema is route for plugins in route
 *  support schema: consumer for plugins in consumer
 */
const cachedPluginSchema: Record<string, object> = {
  'route': {},
  'consumer': {}
}
export const fetchPluginSchema = async (name: string, schemaType: string): Promise<JSONSchema7> => {
  if (!cachedPluginSchema[schemaType][name]) {
    let queryString = schemaType !== 'route' ? `?schema_type=${schemaType}` : ''
    cachedPluginSchema[schemaType][name] = (await request(`/schema/plugins/${name}${queryString}`)).data
    // for plugins schema returned with properties: [], which will cause parse error
    if (JSON.stringify(cachedPluginSchema[schemaType][name].properties) === "[]") {
      delete cachedPluginSchema[schemaType][name].properties;
    }
  }
  return transformPlugin(name, cachedPluginSchema[schemaType][name], 'schema')
}
