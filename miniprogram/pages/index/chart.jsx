import { Chart, Axis, Tooltip, Line, Area } from '@antv/f2';

const scale = {
    time: {
        type: 'timeCat',
        mask: 'MM/DD',
        tickCount: 3,
        range: [0, 1],
    },
    tem: {
        tickCount: 5,
        min: 0,
        alias: '日均温度',
    },
};

export default (props) => {
    const { data } = props;
    return (
        <Chart data={data} scale={scale}>
            <Axis field="time" />
            <Axis field="tem"
                style={{
                    label: { align: 'between' },
                }} />
            <Area x="time" y="tem" />
            <Line x="time" y="tem" shape="smooth" />
            <Tooltip />
        </Chart>
    );
};
