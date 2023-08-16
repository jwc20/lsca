import TwitchChat from "@/components/TwitchChat";
import React from "react";

interface Props {
    channelName: string;
}

export default function ChatPage({ params }: Props) {
    // console.log("CHannel page", params);
    const channelName = params.slug;
    // console.log(channelName)

    return (
        <div>
            <TwitchChat channelName={channelName} />
        </div>
    );
}
