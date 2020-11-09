import React from 'react';

import { PluginPage } from './typing';
import IconFont from './IconFont';

export const PLUGIN_MAPPER_SOURCE: Record<string, Omit<PluginPage.PluginMapperItem, 'name'>> = {
  'limit-req': {
    category: 'Limit traffic',
    priority: 1,
  },
  'limit-count': {
    category: 'Limit traffic',
    priority: 2,
  },
  'limit-conn': {
    category: 'Limit traffic',
    priority: 3
  },
  prometheus: {
    category: 'Observability',
    noConfiguration: true,
    priority: 1,
    avatar: <IconFont type="iconPrometheus_software_logo" />
  },
  skywalking: {
    category: 'Observability',
    priority: 2,
    avatar: <IconFont type="iconskywalking" />
  },
  zipkin: {
    category: 'Observability',
    priority: 3,
  },
  'request-id': {
    category: 'Observability',
    priority: 4
  },
  'key-auth': {
    category: 'Authentication',
    priority: 1
  },
  'basic-auth': {
    category: 'Authentication',
    priority: 3
  },
  'node-status': {
    category: 'Other',
    noConfiguration: true
  },
  'jwt-auth': {
    category: 'Authentication',
    priority: 2,
    avatar: <IconFont type="iconjwt-3" />
  },
  'authz-keycloak': {
    category: 'Authentication',
    priority: 5,
    avatar: <IconFont type="iconkeycloak_icon_32px" />
  },
  'ip-restriction': {
    category: 'Security',
    priority: 1
  },
  'grpc-transcode': {
    category: 'Other',
    hidden: true,
  },
  'serverless-pre-function': {
    category: 'Other',
  },
  'serverless-post-function': {
    category: 'Other',
  },
  'openid-connect': {
    category: 'Authentication',
    priority: 4,
    avatar: <IconFont type="iconicons8-openid" />
  },
  'proxy-rewrite': {
    category: 'Other',
    hidden: true,
  },
  redirect: {
    category: 'Other',
    hidden: true,
  },
  'response-rewrite': {
    category: 'Other',
  },
  'fault-injection': {
    category: 'Security',
    priority: 4
  },
  'udp-logger': {
    category: 'Log',
    priority: 4
  },
  'wolf-rbac': {
    category: 'Other',
    hidden: true,
  },
  'proxy-cache': {
    category: 'Other',
    priority: 1
  },
  'tcp-logger': {
    category: 'Log',
    priority: 3
  },
  'proxy-mirror': {
    category: 'Other',
    priority: 2
  },
  'kafka-logger': {
    category: 'Log',
    priority: 1,
    avatar: <IconFont type="iconApache_kafka" />
  },
  cors: {
    category: 'Security',
    priority: 2
  },
  'uri-blocker': {
    category: 'Security',
    priority: 3
  },
  'request-validator': {
    category: 'Security',
    priority: 5
  },
  heartbeat: {
    category: 'Other',
    hidden: true,
  },
  'batch-requests': {
    category: 'Other',
    noConfiguration: true
  },
  'http-logger': {
    category: 'Log',
    priority: 2
  },
  'mqtt-proxy': {
    category: 'Other',
  },
  oauth: {
    category: 'Security',
  },
  syslog: {
    category: 'Log',
    priority: 5
  },
  echo: {
    category: 'Other',
    priority: 3
  }
};

export const SCHEMA_REQUEST_VALIDATION = {
  "type": "object",
  "properties": {
    "requestParams": {
      "title": "define request paramers",
      "type": "array",
      "items": {
        "type": "object",
        "$ref": "#/definitions/requestParams"
      },
      "minItems": 1
    }
  },
  "definitions": {
    "requestParams": {
      "type": "object",
      "properties": {
        "schema": {
          "type": "string",
          "enum": [
            "body_schema",
            "header_schema"
          ]
        },
        "key": {
          "type": "string"
        },
        "valueType": {
          "type": "string",
          "enum": [
            "string",
            "array",
            "integer",
            "number",
            "object",
            "boolean"
          ]
        },
        "required": {
          "type": "boolean"
        }
      },
      "dependencies": {
        "valueType": {
          "oneOf": [
            {
              "properties": {
                "valueType": {
                  "enum": [
                    "string"
                  ]
                },
                "minLength": {
                  "type": "integer"
                },
                "maxLength": {
                  "type": "integer"
                },
                "pattern": {
                  "type": "string"
                },
                "enumValues": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              },
              "required": ["valueType"]
            },
            {
              "properties": {
                "valueType": {
                  "enum": [
                    "array"
                  ]
                },
                "minItems": {
                  "type": "integer"
                },
                "itemsType": {
                  "type": "string",
                  "enum": [
                    "string",
                    "array",
                    "integer",
                    "number",
                    "object",
                    "boolean"
                  ]
                },
                "uniqueItems": {
                  "type": "boolean"
                }
              },
              "required": [
                "valueType"
              ]
            },
            {
              "properties": {
                "valueType": {
                  "enum": [
                    "integer"
                  ]
                },
                "minimum": {
                  "type": "integer"
                },
                "maximum": {
                  "type": "integer"
                }
              },
              "required": [
                "valueType"
              ]
            },
            {
              "properties": {
                "valueType": {
                  "enum": [
                    "number"
                  ]
                },
                "minimum": {
                  "type": "number"
                },
                "maximum": {
                  "type": "number"
                }
              },
              "required": [
                "valueType"
              ]
            },
            {
              "properties": {
                "valueType": {
                  "enum": [
                    "object"
                  ]
                }
              },
              "required": [
                "valueType"
              ]
            },
            {
              "properties": {
                "valueType": {
                  "enum": [
                    "boolean"
                  ]
                }
              },
              "required": [
                "valueType"
              ]
            }
          ]
        }
      },
      "required": ["schema", "key", "valueType"]
    }
  }
}