import numeral from "numeral";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useGetDashboardMetricsQuery } from "../../../state/api";

const CardPurchaseSummary = () => {
  const data = []
  const isLoading = true
  const purchaseData = data?.purchaseSummary || [];

  const lastDataPoint = purchaseData[purchaseData.length - 1] || null;
  return (
    <div className="flex flex-col justify-between shadow-md rounded-2xl row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Purchase Summary
            </h2>
            <hr />
          </div>

          {/* BODY */}
          <div>
            {/* BODY HEADER */}
            <div className="mb-4 mt-7 px-7">
              <p className="text-xs text-gray-400">Purchased</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">
                  {lastDataPoint
                    ? numeral(lastDataPoint.totalPurchased).format("$0.00a")
                    : "0"}
                </p>
                {lastDataPoint && (
                <p
                  className={`text-sm ${
                    lastDataPoint.changePercentage >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  } flex ml-3`}
                >
                  {lastDataPoint.changePercentage >= 0 ? (
                    <TrendingUp className="size-5 mr-1" />
                  ) : (
                    <TrendingDown className="size-5 mr-1"/>
                  )}
                  {Math.abs(lastDataPoint.changePercentage)}%
                </p>
              )}
              </div>
             
            </div>
            {/* CHARTS */}
              <ResponsiveContainer width="100%" height={200} className="p-2">
                          <AreaChart
                            data={purchaseData}
                            margin={{ top: 0, right: 0, left: -50, bottom: 45 }}
                          >
                           
                            <XAxis
                              dataKey="date"
                              tick={false}
                              axisLine={false}
                            />
                            <YAxis
                              tickLine={false}
                              tick={false}
                              axisLine={false}
                            />
                            <Tooltip
                              formatter={(value) => [
                                `$${value.toLocaleString("en")}`,
                              ]}
                              labelFormatter={(label) => {
                                const date = new Date(label);
                                return date.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                              }}
                            />
                            <Area
                                type="linear"
                              dataKey="totalPurchased"
                              stroke='#8884D8'
                              fill="#8884d8"
                             dot={true}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default CardPurchaseSummary;
