import app from './app.js'

const PORT = process.env.PORT || 1313;

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
