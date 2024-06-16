import { Routes, Route } from "react-router-dom";
import App from "../App";
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={App} />
    </Routes>
  );
};
export default Router;
