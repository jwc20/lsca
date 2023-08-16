import TwitchChat from "@/components/TwitchChat";

interface Props {
    channelName: string;
}

export default function ChatPage({
    params: { channelName },
}: {
    params: Props;
}) {
    // write a function that takes in the channel name and returns the chat component
    // the chat component will have a prop of channel name

    return (
        <div>
            <TwitchChat channelName={channelName} />
        </div>
    );
}
