import { createServer } from 'http';
import { URL } from 'url';
import axios from 'axios';
import fs from 'fs';

const httpServer = createServer(async (req, res) => {

    console.log('URL:', req.url);
    console.log('Host:', req.headers.host);
    console.log('Encabezados:', req.headers); // Registrar todos los encabezados de la solicitud

    const myURL = new URL(req.url, `http://${req.headers.host}`);
    const param1 = myURL.searchParams.get('param1');
    const param2 = myURL.searchParams.get('param2');

    console.log('Param1:', param1);
    console.log('Param2:', param2);

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString('utf8'); // Se asegura de que el encoding sea UTF-8
        });

        req.on('end', async () => {
            console.log('Cuerpo en bruto:', body); // Registrar el cuerpo en bruto recibido

            try {
                const jsonData = JSON.parse(body);
                console.log('JSON recibido:', jsonData);

                // Escribe el JSON entrante en un archivo
                fs.writeFileSync('json_entrante.txt', JSON.stringify(jsonData, null, 2));

                const apiUrl = `https://apex7.revion.com/ords/lcorp/DMC/FACTURAS/EMI/${param1}/${param2}`;
                // Enviar el cuerpo directamente sin procesamiento adicional
                const apiResponse = await axios.post(apiUrl, body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Respuesta del API:', apiResponse.data);

                // Escribe el JSON saliente en un archivo
                fs.writeFileSync('json_saliente.txt', JSON.stringify(apiResponse.data, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(apiResponse.data));

            } catch (e) {
                console.error('Error detallado:', e);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Solicitud no válida: ' + e.message);
            }
        });

    } else {
        res.end('Esperando solicitud POST');
    }
});

httpServer.listen(8080);
