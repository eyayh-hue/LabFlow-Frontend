import {
  ADD_ANALYSE_LOADING,
  ADD_ANALYSE_SUCCESS,
  ADD_ANALYSE_FAIL,
} from "../ActionsTypes/AnalyseTpes";

const initialState = {
  analyses: [],
  load: false,
  errors: null,
  successMessage: null,
};

export const AnalyseReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_ANALYSE_LOADING:
      return {
        ...state,
        load: true,
        errors: null,
      };
    case ADD_ANALYSE_SUCCESS:
      return {
        ...state,
        load: false,
        analyses: [...state.analyses, payload.newAnalyse || payload],
        successMessage: "Analyse ajoutée avec succès",
      };
    case ADD_ANALYSE_FAIL:
      return {
        ...state,
        load: false,
        errors: payload,
      };
    default:
      return state;
  }
};

export default AnalyseReducer;
