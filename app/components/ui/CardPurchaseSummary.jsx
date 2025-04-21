import numeral from "numeral";
import { LoaderCircle, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useGetPurchaseSummaryQuery } from "@/state/api";
import { priceFormatter } from "@/utils/helper";

const CardPurchaseSummary = () => {
  const {data: purchaseSummary, isLoading} = useGetPurchaseSummaryQuery()
  const purchaseData = purchaseSummary || [];
  const lastDataPoint = purchaseData[purchaseData.length - 1] || null
  
  const totalAccumulatedAmount = purchaseData.reduce((acc, curr) => {
    return acc + curr.totalAmount;
  }, 0);

  return (
    <div className="grid place-items-center shadow-md rounded-2xl row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white">
      {isLoading ? (
        <div className="m-5 flex flex-col gap-1 justify-between items-center">
          <LoaderCircle className="animate-spin" />Loading Purchase Analytics...
          </div>
      ) : (
        <div className="w-full">
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
              <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">Total Purchased (5 days)</p>
              <p>Last 5 days</p>
              </div>
              <div className="flex items-center">
                <p className="text-2xl font-bold">
                  {priceFormatter(totalAccumulatedAmount)}
                </p>
                {lastDataPoint && (
                <p
                  className={`text-sm ${
                    lastDataPoint.percentageChange >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  } flex ml-3`}
                >
                  {lastDataPoint.percentageChange >= 0 ? (
                    <TrendingUp className="size-5 mr-1" />
                  ) : (
                    <TrendingDown className="size-5 mr-1"/>
                  )}
                  {Math.abs(lastDataPoint.percentageChange)}%
                </p>
              )}
              </div>
             
            </div>
            {/* CHARTS */}
              <ResponsiveContainer width="100%" height={190} className="p-2">
                          <AreaChart
                            data={purchaseData}
                            margin={{ top: 0, right: 0, left: -25, bottom: 50 }}
                          >
                           
                            <XAxis
                              dataKey="date"
                              tickFormatter={(date) => {
                                const formattedDate = new Date(date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                });
                                return formattedDate;
                              }}
                              tick={true}
                              axisLine={false}
                            />
                            <YAxis
                              tickLine={false}
                              tick={true}
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
                              dataKey="totalAmount"
                              stroke='#8884D8'
                              fill="#8884d8"
                             dot={true}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPurchaseSummary;
