import axios from "axios";
import {
  ADD_ANALYSE_LOADING,
  ADD_ANALYSE_SUCCESS,
  ADD_ANALYSE_FAIL,
} from "../ActionsTypes/AnalyseTpes";

const apiURL = process.env.VITE_BACKEND_URL;
export const addAnalyse = (newAnalyse) => async (dispatch) => {
  dispatch({ type: ADD_ANALYSE_LOADING });

  const token = localStorage.getItem("token");

  try {
    const config = {
      headers: {
        Authorization: token,
      },
    };

    const res = await axios.post(`${apiURL}/api/analyses`, newAnalyse, config);
    dispatch({
      type: ADD_ANALYSE_SUCCESS,
      payload: res.data,
    });

    return true;
  } catch (error) {
    dispatch({
      type: ADD_ANALYSE_FAIL,
      payload: error.response?.data || error.message,
    });
    return false;
  }
};
