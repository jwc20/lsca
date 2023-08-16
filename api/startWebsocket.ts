// import { exec } from "child_process";

// export default (req, res) => {
//     if (req.method === 'POST') {
//         console.log("Starting WebSocket...",)
//         exec("python ./scripts/websocket.py", (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`exec error: ${error}`);
//                 return res.status(500).json({ error: 'Failed to start WebSocket.' });
//             }
//             console.log(`stdout: ${stdout}`);
//             console.error(`stderr: ${stderr}`);
//             res.status(200).json({ success: true });
//         });
//     } else {
//         res.status(405).json({ error: 'Method not allowed.' });
//     }
// };
