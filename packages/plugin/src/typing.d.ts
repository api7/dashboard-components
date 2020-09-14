export declare namespace PluginPage {
  type PluginCategory = 'Security' | 'Limit' | 'Log' | 'Metric' | 'Other';

  type PluginMapperItem = {
    category: PluginCategory;
    hidden?: boolean;
    name: string;
    enabled?: boolean;
  };

  type PluginProps = PluginMapperItem & {
    name: string;
  }

  type FinalData = Record<string, object>;

  type DrawData = { [name: string]: any };
}
