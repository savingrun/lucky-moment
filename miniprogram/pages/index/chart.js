import { Chart, Axis, Tooltip, Line, Area } from '@antv/f2';
import { jsx as _jsx } from "@antv/f2/jsx-runtime";
import { jsxs as _jsxs } from "@antv/f2/jsx-runtime";
const scale = {
  time: {
    type: 'timeCat',
    mask: 'MM/DD',
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
      field: "tem",
      style: {
        label: {
          align: 'between'
        }
      }
    }), _jsx(Area, {
      x: "time",
      y: "tem"
    }), _jsx(Line, {
      x: "time",
      y: "tem",
      shape: "smooth"
    }), _jsx(Tooltip, {})]
  });
});