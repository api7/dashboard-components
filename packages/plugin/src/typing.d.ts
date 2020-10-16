export declare namespace PluginPage {
  // NOTE: 需要与 PluginPage 文件中的 Category 枚举值同步
  type PluginCategory =
    | 'Security'
    | 'Limit traffic'
    | 'Log'
    | 'Observability'
    | 'Other'
    | 'Authentication';

  type PluginMapperItem = {
    category: PluginCategory;
    hidden?: boolean;
    name: string;
    enabled?: boolean;
    noConfiguration?: boolean;
    // Note: 插件在前端同一分类下排序优先级，数字越小，优先级越高，默认9999。
    priority?: number;
    avatar?: React.ReactNode;
  };

  type PluginProps = PluginMapperItem & {
    name: string;
  };

  type FinalData = Record<string, object>;

  type DrawData = { [name: string]: any };

  type Response = {
    code: number;
    data: string[];
    message: string;
    request_id: string;
  };
}
