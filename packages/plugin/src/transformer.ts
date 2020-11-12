import setValue from 'set-value';
import { omit, isEmpty } from 'lodash';

import { SCHEMA_REQUEST_VALIDATION } from './data'

type TransformerType = 'schema' | 'request' | 'response';

const schemaRewriteHeader = (data: any) => {
  const { description } = data?.properties?.headers;

  setValue(data, 'properties.headers', {
    description,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
        },
        value: {
          "type": "object",
          "oneOf": [
            {
              "title": "value type is string",
              "properties": {
                "value": {
                  "type": "string"
                }
              }
            },
            {
              "title": "value type is number",
              "properties": {
                "value": {
                  "type": "number"
                }
              }
            }
          ]
        },
      },
    },
  });
  return data;
};

/**
 * Transform data before sending Request
 */
const requestRewriteHeader = (data: any) => {
  const headers = {};
  (data.headers || []).forEach((item: Record<string, string>) => {
    headers[item.key] = item.value;
  });
  setValue(data, 'headers', headers);

  if (isEmpty(headers)) {
    return omit(data, ['headers']);
  }

  return data;
};

/**
 * Transform data after receiving Response
 */
const responseRewriteHeader = (data: any) => {
  const headers = Object.entries(data?.headers || {}).map(([key, value]) => {
    return {
      key,
      value,
    };
  });
  setValue(data, 'headers', headers);
  return data;
};

export const transformPlugin = (name: string, data: any, type: TransformerType) => {
  switch (name) {
    case 'response-rewrite':
    case 'proxy-rewrite':
      if (type === 'schema') {
        return schemaRewriteHeader(data);
      }
      if (type === 'request') {
        return requestRewriteHeader(data);
      }
      if (type === 'response') {
        return responseRewriteHeader(data);
      }
      break;
    case 'request-validation':
      if (type === 'schema') {
        return SCHEMA_REQUEST_VALIDATION;
      }
      break;
    default:
      break;
  }
  return data;
};

export const transformPlugins = (data: Record<string, object> = {}, type: TransformerType) => {
  const plugins = {};
  Object.entries(data).forEach(([name, value]) => {
    if (transformPlugin(name, value, type)) {
      plugins[name] = transformPlugin(name, value, type);
    }
  });
  return plugins;
};
