import dbConnect from "../helpers/dbConnect.helper";

const pathHandler = (req, res) => {
  const error = "Not Found URL";
  const { method, originalUrl } = req;
  return res.status(404).json({ error, method, originalUrl });
};

export default pathHandler;
