"use client";
import { useGetSalesSummaryQuery } from "@/state/api";
import { priceFormatter } from "@/utils/helper";
import { LoaderCircle, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardSalesSummary = () => {
  
const {data:last5DaysSummary, isLoading, isError} = useGetSalesSummaryQuery()


console.log("UseGetSalesSUmmary is mounted")
  console.log(last5DaysSummary, "LAST SUMMARY")



  const totalValueSum =
    last5DaysSummary?.reduce((acc, curr) => acc + curr.totalAmount, 0) || 0;


  const averagepercentageChange =
    last5DaysSummary?.reduce((acc, curr, _, array) => {
      return acc + curr.percentageChange / array.length;
    }, 0) || 0;

  const highestValueData = last5DaysSummary?.reduce((acc, curr) => {
    return acc.totalAmount > curr.totalAmount ? acc : curr;
  }, last5DaysSummary[0] || {});

  const options = { year: "numeric", month: "long", day: "numeric" };

  const date = new Date(highestValueData.date)
  console.log(date, "THE DATE:::")
  date.setDate(
    date.getDate() + 1)
  const highestValueDate = new Date(
    date
  ).toLocaleDateString("en-US", options);

  if (isError) {
    return <div className="m-5">Failed to fetch data</div>;
  }

  return (
    <div className="row-span-3 xl:row-span-6 grid place-items-center bg-white shadow-md rounded-2xl">
      {isLoading ? (
        <div className="flex flex-col gap-1 justify-between items-center"><LoaderCircle className="animate-spin" />Loading Sales Analytics...</div>
      ) : (
        <div className="w-full">
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Sales Summary
            </h2>
            <hr />
          </div>

          {/* BODY */}
          <div>
            {/* BODY HEADER */}
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">Total Sales (5 Days)</p>
                <span className="text-2xl font-extrabold">
                &#8358;
                  {(totalValueSum / 1000).toLocaleString("en", {
                    maximumFractionDigits: 2,
                  })}
                  K
                </span>
                <span className="text-green-500 text-sm ml-2">
                  <TrendingUp className="inline w-4 h-4 mr-1" />
                  {averagepercentageChange.toFixed(2)}%
                </span>
              </div>
            </div>
            {/* CHART */}
            <ResponsiveContainer width="100%" height={250} className="px-7">
              <BarChart
                data={last5DaysSummary}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate() + 1}`;
                  }}
                />
                <YAxis
                  tickFormatter={(value) => priceFormatter(value)}
                  tick={{ fontSize: 12, dx: -1 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value) => [`₦${value.toLocaleString("en")}`]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Bar
                  dataKey="totalAmount"
                  fill="#3182ce"
                  barSize={10}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* FOOTER */}
          <div>
            <hr className="-mb-2"/>
            <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
              <p>{last5DaysSummary.length || 0} days</p>
              <p className="text-sm">
                Highest Sales Date:{" "}
                <span className="font-bold">{highestValueDate}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardSalesSummary;
