import setValue from 'set-value';
import { omit } from 'lodash';

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
  return data;
};

const responseRequestValidation = (data: any) => {
  const bodySchemaList: any = [];
  const headerSchemaList: any = [];
  if (data && data.body_schema && Object.keys(data.body_schema.properties).length !== 0) {
    const { properties } = data.body_schema;
    Object.keys(properties).forEach(item => {
      bodySchemaList.push({
        "schema": 'body_schema',
        key: item,
        valueType: properties[item].type,
        ...omit(properties[item], 'type')
      })
    })
  }
  if (data && data.header_schema && Object.keys(data.header_schema.properties).length !== 0) {
    const { properties } = data.header_schema;
    Object.keys(properties).forEach(item => {
      headerSchemaList.push({
        "schema": 'header_schema',
        key: item,
        valueType: properties[item].type,
        ...omit(properties[item], 'type')
      })
    })
  }
  return { requestParams: [...bodySchemaList, ...headerSchemaList] };
}

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

const requestRequestValidation = (data: any) => {
  const returnData: any = {};
  const bodySchema = {
    "type": 'object',
    "required": true,
    properties: {}
  };
  const headerSchema = {
    "type": 'object',
    "required": true,
    properties: {}
  };
  (data.requestParams || []).forEach((item: any) => {
    if (item.schema === 'body_schema') {
      bodySchema.properties[item.key] = { "type": item.valueType, ...omit(item, ['valueType', 'key', 'schema']) }
      returnData.body_schema = bodySchema;
    }
    if (item.schema === 'header_schema') {
      headerSchema.properties[item.key] = { "type": item.valueType, ...omit(item, ['valueType', 'key', 'schema']) }
      returnData.header_schema = headerSchema;
    }
  })
  return returnData;
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
      if (type === 'request') {
        return requestRequestValidation(data);
      }
      if (type === 'response') {
        return responseRequestValidation(data);
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
