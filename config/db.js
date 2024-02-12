import mongoose from 'mongoose';
// console.log(process.env)
const { MONGO_URL } = process.env;

// console.log(MONGO_URL)
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('Database Connected'))
  .catch((err) => console.error(err));

export default mongoose.connection;
