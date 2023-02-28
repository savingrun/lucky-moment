import { Chart, Axis, Tooltip, Line, Area, Legend, Point, ScrollBar } from '@antv/f2';

const scale = {
    time: {
        type: 'timeCat',
        mask: 'YYYY/MM/DD HH:mm:ss',
        tickCount: 3,
        range: [0, 1],
    }
};

export default (props) => {
    const { data } = props;
    return (
        <Chart data={data} scale={scale}>
            <Axis field="time" />
            <Axis field="flagNum"
                style={{
                    label: { align: 'between' },
                }} />
            <Area x="time" y="flagNum" color="type" shape="smooth" />
            <Line x="time" y="flagNum" color="type" shape="smooth" />
            {/* <Point x="time" y="flagNum" /> */}
            {/* <Legend position="top" /> */}
            <Tooltip showCrosshairs="true" crosshairsType="xy" />
        </Chart>
    );
};
