import {
  PieChart,
  Pie,
  Legend,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";
import useWindowSize from "../../Hooks/onWindowSize";
// import useWindowSize from "../../Hooks/onWindowSize";

const Bullet = ({ backgroundColor, size }) => {
  return (
    <div
      className="CirecleBullet"
      style={{
        backgroundColor,
        width: size,
        height: size,
      }}
    ></div>
  );
};

const CustomizedLegend = (props) => {
  const { payload } = props;
  return (
    <ul
      className="LegendList"
      style={{ listStyle: "none", display: "flex", marginTop: "15px" }}
    >
      {payload.map((entry, index) => (
        <li key={`item-${index}`} style={{ margin: "5px 5px" }}>
          <div
            className="BulletLabel"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Bullet backgroundColor={entry.payload.fill} size="15px" />
            <div
              className="BulletLabelText"
              style={{ marginLeft: "5px", fontSize: "1.3rem" }}
            >
              {entry.value}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const CustomLabel = ({ viewBox, labelText, value }) => {
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
        fontSize="25"
        fontWeight="500"
      >
        {labelText}
      </text>
      <text
        x={cx}
        y={cy + 20}
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
        fill="#0088FE"
        fontSize="35"
        fontWeight="600"
      >
        {value}
      </text>
    </g>
  );
};

export default function ChartPower({ data }) {
  const size = useWindowSize();
  let dataChart = data.map((e) => ({
    name: e.name,
    value: e.power,
  }));
  const data01 = [
    { name: "Active", value: 90 },
    { name: "Inactive", value: 25 },
    { name: "ICPs", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 405,
        height: 420,
      }}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={dataChart}
            dataKey="value"
            cx={200}
            cy={200}
            innerRadius={120}
            outerRadius={160}
          >
            {dataChart.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              content={<CustomLabel labelText="POWER <3" />}
              position="center"
            />
          </Pie>
          <Legend
            layout="vertical"
            align="center"
            verticalAlign="top"
            content={<CustomizedLegend />}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
