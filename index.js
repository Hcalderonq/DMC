console.clear();
import { createServer } from 'http';
import { URL } from 'url';
import axios from 'axios';

const httpServer = createServer(async (req, res) => {
    const myURL = new URL(req.url, `http://${req.headers.host}`);

    const param1 = myURL.searchParams.get('param1');  // Supongo que este será el COD_CIA
    const param2 = myURL.searchParams.get('param2');  // Supongo que este será el ID_FAC

    console.log('Param1:', param1);
    console.log('Param2:', param2);

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log('JSON recibido:', jsonData);

                // Realizar la solicitud al API
                const apiUrl = `https://apex7.revion.com/ords/lcorp/DMC/FACTURAS/EMI/${param1}/${param2}`;
                const apiResponse = await axios.post(apiUrl, jsonData);
                console.log('Respuesta del API:', apiResponse.data);

                res.end('Solicitud procesada');
            } catch (e) {
                console.error('Error:', e);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Solicitud no válida');
            }
        });
    } else {
        res.end('Esperando solicitud POST');
    }
});

httpServer.listen(3000);
