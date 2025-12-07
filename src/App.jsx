import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { syncWithLocalStorage } from "./store/slices/authSlice";
import useRouterElements from "./routes/useRouterElements";
import RedirectBasedOnRole from "./components/RedirectBasedOnRole/RedirectBasedOnRole";


function App() {
  const dispatch = useDispatch();
  const routerElement = useRouterElements();

  // Sync Redux state với localStorage khi app khởi động
  useEffect(() => {
    dispatch(syncWithLocalStorage());
  }, [dispatch]);

  return (
    <>
      <RedirectBasedOnRole />
      {routerElement}
    </>
  );
}

export default App;