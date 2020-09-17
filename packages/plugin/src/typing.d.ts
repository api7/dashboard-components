export declare namespace PluginPage {
  // NOTE: 需要与 PluginPage 文件中的 Category 枚举值同步
  type PluginCategory = 'Security' | 'Limit traffic' | 'Log' | 'Observability' | 'Other' | 'Authentication';

  type PluginMapperItem = {
    category: PluginCategory;
    hidden?: boolean;
    name: string;
    enabled?: boolean;
    noConfiguration?: boolean;
  };

  type PluginProps = PluginMapperItem & {
    name: string;
  };

  type FinalData = Record<string, object>;

  type DrawData = { [name: string]: any };
}
