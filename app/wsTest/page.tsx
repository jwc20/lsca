"use client";

// export default function wsTest() {
//     return (
//         <div>
//             {/* center the div tag in the middle of the screen both horizontally and vertically */}
//             <div className="flex justify-center items-center h-screen">
//                 <div className="text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-6xl uppercase font-black">
//                     <pre>
//                         <code>{`
//         Me    O
//              /|\\         Your Mom
//               |_  ___O
//              / \\ /\\  \\

//         Server was shut down to save money.
//         See you next year!
//            `}
//                         </code>
//                     </pre>
//                     <a href="chatdb/2023/08/31/12" className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl uppercase font-black">chatdb/08/31/12</a>
//                     <br />
//                     <a href="chatdb/2023/09/23/04" className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl uppercase font-black">chatdb/08/23/04</a>
//                     <br />
//                     <a href="/maycggf" className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl uppercase font-black">more "art"</a>
//                     <br />
//                     <a href="/mayhcgf" className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl uppercase font-black">even more "art"</a>
//                 </div>
//             </div>
//         </div>
//     )
// }
import React, { useState } from "react";

export default function wsTest() {
    const [isOpen, setIsOpen] = useState(false);

    const startDate = new Date(2023, 7, 31, 12); // Month is 0-indexed
    const endDate = new Date(2023, 8, 23, 4); // Month is 0-indexed

    const generateLinks = () => {
        let currentDate = startDate;
        const links = [];

        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            const hour = String(currentDate.getHours()).padStart(2, "0");

            links.push(`chatdb/${year}/${month}/${day}/${hour}`);
            currentDate.setHours(currentDate.getHours() + 1);
        }

        return links;
    };

    return (
        <div>
            {/* center the div tag in the middle of the screen both horizontally and vertically */}
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-6xl uppercase font-black">
                    <pre>
                        <code>
                            {`
    Me    O 
         /|\\         Your Mom 
          |_  ___O
         / \\ /\\  \\  

    Server was shut down to save money.
    See you next year!
           `}
                        </code>
                    </pre>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-xl uppercase font-black text-blue-700"
                    >
                        ChatDB Links
                    </button>
                    {isOpen && (
                        <div className="absolute mt-2 w-64 rounded-md shadow-lg bg-white">
                            <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="options-menu"
                            >
                                {generateLinks().map((link) => (
                                    <a
                                        key={link}
                                        href={link}
                                        className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        role="menuitem"
                                    >
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <br />
                <a
                    href="/maycggf"
                    className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl uppercase font-black"
                >
                    more "art"
                </a>
                <br />
                <a
                    href="/mayhcgf"
                    className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl uppercase font-black"
                >
                    even more "art"
                </a>
                <br />
                <a
                    href="/chat/sodapoppin"
                    className="text-sm sm:text-sm md:text-lg lg:text-xl xl:text-2xl uppercase font-black text-blue-700"
                >
                    chat with no ml classifier, just a chat, no db storage. change the name in the url to change the chat name
                </a>
            </div>
        </div>
    );
}
