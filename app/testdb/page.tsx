import TwitchChatDB from "@/components/TwitchChatDB";

interface Props {
    params: {
        slug: string;
    };
}

export default function ChatPage({ params }: Props) {
    const channelName = params.slug;

    return (
        <div>
            <TwitchChatDB channelName={channelName} />
        </div>
    );
}
