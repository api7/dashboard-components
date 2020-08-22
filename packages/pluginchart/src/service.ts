import { JSONSchema7 } from 'json-schema';

import request from './request';

export const fetchPluginList = () => request<string[]>('/plugins');

export const fetchPluginSchema = (name: string): Promise<JSONSchema7> =>
  request(`/schema/plugins/${name}`);
