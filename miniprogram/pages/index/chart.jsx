import { Chart, Axis, Tooltip, Line, Area, Legend, Point, ScrollBar } from '@antv/f2';

const scale = {
    time: {
        type: 'timeCat',
        mask: 'HH:mm:ss',
        tickCount: 3,
        range: [0, 1]
    },
    flagNum: {
        formatter: (flagNum) => `${flagNum} 抽`,
        tickCount: 5
    }
};

export default (props) => {
    const { data } = props
    return (
        <Chart data={data} scale={scale}>
            <Legend
                position="top"
                style={{
                    justifyContent: 'space-around',
                }}
                triggerMap={{
                    press: (items, records, legend) => {
                        const map = {};
                        items.forEach((item) => (map[item.name] = _.clone(item)));
                        records.forEach((record) => {
                            map[record.type].value = record.value;
                        });
                        legend.setItems(_.values(map));
                    },
                    pressend: (items, records, legend) => {
                        legend.setItems(items);
                    },
                }}
            />
            <Axis field="time" />
            <Axis field="flagNum" />
            {/* <Point x="time" y="flagNum" color="type" /> */}
            <Point x="flagNum" y="time" color="type" />
            {/* <ScrollBar mode="y" range={[0.1, 0.3]} position="left" visible={false} /> */}
            <Tooltip showCrosshairs="true" crosshairsType="xy" showTooltipMarker={true} />
        </Chart>
    )
};
