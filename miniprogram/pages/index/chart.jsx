import { Chart, Axis, Tooltip, Line, Area } from '@antv/f2';

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
            <Area x="time" y="flagNum" />
            <Line x="time" y="flagNum" shape="smooth" />
            <Tooltip />
        </Chart>
    );
};
