import { Chart, Axis, Tooltip, Line, Area, Legend, Point, ScrollBar } from '@antv/f2';
import { jsx as _jsx } from "@antv/f2/jsx-runtime";
import { jsxs as _jsxs } from "@antv/f2/jsx-runtime";
const scale = {
  time: {
    type: 'timeCat',
    mask: 'HH:mm:ss',
    tickCount: 3,
    range: [0, 1]
  },
  flagNum: {
    formatter: flagNum => `${flagNum} 抽`,
    tickCount: 5
  }
};
export default (props => {
  const {
    data
  } = props;
  return _jsxs(Chart, {
    data: data,
    scale: scale,
    children: [_jsx(Legend, {
      position: "top",
      style: {
        justifyContent: 'space-around'
      },
      triggerMap: {
        press: (items, records, legend) => {
          const map = {};
          items.forEach(item => map[item.name] = _.clone(item));
          records.forEach(record => {
            map[record.type].value = record.value;
          });
          legend.setItems(_.values(map));
        },
        pressend: (items, records, legend) => {
          legend.setItems(items);
        }
      }
    }), _jsx(Axis, {
      field: "time"
    }), _jsx(Axis, {
      field: "flagNum"
    }), _jsx(Point, {
      x: "flagNum",
      y: "time",
      color: "type"
    }), _jsx(Tooltip, {
      showCrosshairs: "true",
      crosshairsType: "xy",
      showTooltipMarker: true
    })]
  });
});