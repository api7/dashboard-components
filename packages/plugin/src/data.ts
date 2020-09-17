import { PluginPage } from './typing.d';

export const PLUGIN_MAPPER_SOURCE: Record<string, Omit<PluginPage.PluginMapperItem, 'name'>> = {
  'limit-req': {
    category: 'Limit traffic',
  },
  'limit-count': {
    category: 'Limit traffic',
  },
  'limit-conn': {
    category: 'Limit traffic',
  },
  prometheus: {
    category: 'Observability',
    noConfiguration: true
  },
  skywalking: {
    category: 'Observability'
  },
  zipkin: {
    category: 'Observability',
  },
  'request-id': {
    category: 'Observability',
  },
  'key-auth': {
    category: 'Authentication',
  },
  'basic-auth': {
    category: 'Authentication',
  },
  'node-status': {
    category: 'Other',
    noConfiguration: true
  },
  'jwt-auth': {
    category: 'Authentication',
  },
  'authz-keycloak': {
    category: 'Authentication',
  },
  'ip-restriction': {
    category: 'Security',
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
  },
  'udp-logger': {
    category: 'Log',
  },
  'wolf-rbac': {
    category: 'Other',
    hidden: true,
  },
  'proxy-cache': {
    category: 'Other',
  },
  'tcp-logger': {
    category: 'Log',
  },
  'proxy-mirror': {
    category: 'Other',
  },
  'kafka-logger': {
    category: 'Log',
  },
  cors: {
    category: 'Security',
  },
  'uri-blocker': {
    category: 'Security',
  },
  'request-validator': {
    category: 'Security',
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
  },
  'mqtt-proxy': {
    category: 'Other',
  },
  oauth: {
    category: 'Security',
  },
  syslog: {
    category: 'Log',
  },
  echo: {
    category: 'Log',
  }
};
