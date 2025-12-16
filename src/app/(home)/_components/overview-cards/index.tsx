import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { views, profit, clientActive, totalClient } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Views"
        data={{
          ...views,
          value: compactFormat(views.value),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total Revenue"
        data={{
          ...profit,
          value: "$" + compactFormat(profit.value),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Client Active"
        data={{
          ...clientActive,
          value: clientActive.value,
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Client"
        data={{
          ...totalClient,
          value: totalClient.value,
        }}
        Icon={icons.Users}
      />
    </div>
  );
}
