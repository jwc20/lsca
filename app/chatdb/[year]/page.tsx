
interface Props {
    params: {
        slug: string;
    };
}

export default function ChatPage({ params }: Props) {
    const year = params.slug;

    return (
        <div>
            <p>Year: {year}</p>
        </div>
    );
}
