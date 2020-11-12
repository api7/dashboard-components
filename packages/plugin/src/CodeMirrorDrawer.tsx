import React from 'react';
import { Drawer } from 'antd';
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
        value={JSON.stringify(data, null, 2)}
        options={{
          mode: 'json-ld',
          readOnly: 'nocursor'
        }}
      />
    </Drawer>
  );
};

export default CodeMirrorDrawer;
