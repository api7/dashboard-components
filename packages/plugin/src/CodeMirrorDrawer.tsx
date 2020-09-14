import React from 'react';
import { Drawer, Button } from 'antd';
import CodeMirror from '@uiw/react-codemirror';

type Props = {
  visiable: boolean;
  data: object;
  onClose(): void
};

const CodeMirrorDrawer: React.FC<Props> = ({ visiable, data = {}, onClose }) => {
  return (
    <Drawer visible={visiable} width={500} onClose={onClose}>
      <CodeMirror
        value={JSON.stringify(data)}
        options={{
          mode: 'json-ld',
          readonly: true
        }}
      />
    </Drawer>
  );
};

export default CodeMirrorDrawer;
