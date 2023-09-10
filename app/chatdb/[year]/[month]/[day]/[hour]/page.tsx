
import TwitchChatByDate from "@/components/TwitchChatByDate";

interface Props {
    params: {
        year: string;
        month: string;
        day: string;
        hour: string;
    };
}

export default function HourPage({ params }: Props) {
    const year = params.year;
    const month = params.month;
    const day = params.day;
    let hour = params.hour;
    // ensure that hour is 2 digits
    // if hour is 1 digit, add a 0 to the front
    // if hour is 2 digits, do nothing

    hour = hour.padStart(2, "0");

    return (
        <div>
            <p>Year: {year}</p>
            <p>Month: {month}</p>
            <p>Day: {day}</p>
            <p>Hour: {hour}</p>
            <TwitchChatByDate year={year} month={month} day={day} hour={hour} />
        </div>
    );
}
