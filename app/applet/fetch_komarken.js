import https from 'https';

https.get('https://www.komarken.se/ykb-provfragor/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Length: " + data.length);
    console.log("Status: " + res.statusCode);
    if (res.statusCode === 301 || res.statusCode === 302) {
      console.log("Redirect to: " + res.headers.location);
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
