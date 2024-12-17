import IClickAnalytics from "@/domain/entities/IClickAnalytics";
import { AggregatedClickData } from "@/types";

const aggregateClicksByDate = (data: IClickAnalytics[]): AggregatedClickData[] => {
    return data.reduce<AggregatedClickData[]>((acc, click) => {
        const date = new Date(click.timestamp!).toISOString().split("T")[0];
        const existingDate = acc.find((item) => item.date === date);

        if (existingDate) {
            existingDate.count += 1;
        } else {
            acc.push({ date, count: 1 });
        }

        return acc;
    }, []);
};

export default aggregateClicksByDate;