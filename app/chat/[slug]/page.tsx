import TwitchChat from "@/components/TwitchChat";

interface Props {
    params: {
        slug: string;
    };
}

export default function ChatPage({ params }: Props) {
    const channelName = params.slug;

    return (
        <div>
            <TwitchChat channelName={channelName} />
        </div>
    );
}
