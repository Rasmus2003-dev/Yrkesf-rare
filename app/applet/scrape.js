import https from 'https';

https.get('https://www.komarken.se/ykb-provfragor/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Length: " + data.length);
    const match = data.match(/wpProQuizInitList/);
    if (match) {
      console.log("Found wpProQuizInitList");
    } else {
      console.log("Could not find wpProQuizInitList");
      const m2 = data.match(/quiz/i);
      console.log("Found quiz: " + !!m2);
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
