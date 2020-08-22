export const transformer = (chart: any) => {
  const rule: any = {};
  const conf: any = {};

  const { links } = chart;

  const findStartNode = () => {
    const nodeIdFormArr: string[] = [];
    const nodeIdToArr: string[] = [];
    Object.keys(links).forEach((key) => {
      const item = links[key];
      nodeIdFormArr.push(item.from.nodeId);
      nodeIdToArr.push(item.to.nodeId);
    });
    return nodeIdFormArr.filter((item) => !nodeIdToArr.includes(item))[0];
  };

  const findLinkId = (type: string, nodeId: string, port?: string) => {
    let returnId;
    Object.keys(links).forEach((key) => {
      const item = links[key];
      if (nodeId === item[type].nodeId) {
        returnId = key;
      }

      if (port) {
        if (port === item[type].portId) {
          returnId = key;
        }
      }
    });
    return returnId;
  };

  const processRule = (id: string) => {
    if (!chart.nodes[id]) return;

    const link = findLinkId('from', id);
    if (!link) return;

    const nextNodeId = links[link].to.nodeId;
    const nextNodeType = chart.nodes[nextNodeId].properties.customData.type;

    if (nextNodeType === 0) {
      rule[id] = [['', nextNodeId]];
      processRule(nextNodeId);
    }

    if (nextNodeType === 1) {
      let truePortId;
      let falsePortId;
      const { ports } = chart.nodes[nextNodeId];
      Object.keys(ports).forEach((key) => {
        const item = ports[key];
        if (item.properties) {
          if (item.properties.value === 'yes') {
            truePortId = item.id;
          }
          if (item.properties.value === 'no') {
            falsePortId = item.id;
          }
        }
      });
      const nextTrueNode = links[findLinkId('from', nextNodeId, truePortId)!].to.nodeId;
      const nextFalseNode = links[findLinkId('from', nextNodeId, falsePortId)!].to.nodeId;
      rule[id] = [];
      rule[id][0] = [chart.nodes[nextNodeId].properties.customData.name, nextTrueNode];
      rule[id][1] = ['', nextFalseNode];
      processRule(nextTrueNode);
      processRule(nextFalseNode);
    }
  };

  const startId = findStartNode();
  rule.root = startId;

  processRule(startId);

  // handle conf
  Object.keys(chart.nodes).forEach((key) => {
    const item = chart.nodes[key];
    if (item.properties.customData && item.properties.customData.type === 0) {
      conf[key] = {
        name: item.properties.customData.name,
        conf: item.properties.customData.data,
      };
    }
  });

  return { rule, conf };
};
