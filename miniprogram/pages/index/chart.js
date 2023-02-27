import { Chart, Axis, Tooltip, Line, Area } from '@antv/f2';
import { jsx as _jsx } from "@antv/f2/jsx-runtime";
import { jsxs as _jsxs } from "@antv/f2/jsx-runtime";
const scale = {
  time: {
    type: 'timeCat',
    mask: 'YYYY/MM/DD HH:mm:ss',
    tickCount: 3,
    range: [0, 1]
  },
  tem: {
    tickCount: 5,
    min: 0,
    alias: '日均温度'
  }
};
export default (props => {
  const {
    data
  } = props;
  return _jsxs(Chart, {
    data: data,
    scale: scale,
    children: [_jsx(Axis, {
      field: "time"
    }), _jsx(Axis, {
      field: "flagNum",
      style: {
        label: {
          align: 'between'
        }
      }
    }), _jsx(Area, {
      x: "time",
      y: "flagNum"
    }), _jsx(Line, {
      x: "time",
      y: "flagNum",
      shape: "smooth"
    }), _jsx(Tooltip, {})]
  });
});