import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import bg from "../../assets/images/pos-bg.jpeg";
import PageContent from "../../components/PageContent/PageContent";
import { Link, useHistory, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import useForm from "../../utils/useForm";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createNewPositionToFirebase,
  editPositionDetailsToFirebase,
  getPositionDetailsByIdFromFirebase,
  getPositionListFromFirebase,
  removePositionFromFirebase,
} from "../../redux/actions/position";
import FormModal from "../../components/FormModal/FormModal";
import FormLoading from "../../components/FormLoading/FormLoading";
import FilterBar from "../../components/FilterBar/FilterBar";
import useFilter from "../../utils/useFilter";
import useValidator from "../../utils/useValidator";
const tablePropertyList = [
  {
    label: "No.",
    render: ({ rowData, index }) => {
      return <span>{index + 1}.</span>;
    },
  },
  {
    label: "Position",
    render: ({ rowData }) => {
      return <span>{rowData.name}</span>;
    },
  },
  {
    label: "Created at",
    render: ({ rowData }) => {
      return <span>{rowData.createdAt}</span>;
    },
  },
  {
    label: "Action",
    render: ({ rowData, history, handleRemoveItem }) => {
      return (
        <div class="tableAction">
          <button
            onClick={() => handleRemoveItem(rowData.id)}
            className="tableWidgetBtn"
          >
            <i className="far fa-trash-alt"></i>
          </button>
          <Link
            to={{
              pathname: `${history.location?.pathname}`,
              search: "?form=true",
              state: rowData.id,
            }}
          >
            <button className="tableWidgetBtn">
              <i className="far fa-edit"></i>
            </button>
          </Link>
          <button className="tableWidgetBtn">
            <i className="far fa-copy"></i>
          </button>
        </div>
      );
    },
  },
];
const initialInputList = {
  name: {
    value: "",
    placeholder: "Position name",
    name: "name",
    type: "text",
    isTouched : false,
  },

};
const initialFilterList = {
  name: {
    label: "Name",
    type: "text",
    name: "name",
    value: "",
    isOpen: false,
  },
};
const PositionPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const params = useParams();
  const {
    positionList,
    isLoading,
    isPositionDetailsLoading,
    positionDetails,
    isEditting,
    isDeleting,
    isCreating,
  } = useSelector((state) => state.position);
  const {
    inputList,
    setInputList,
    handleOnInputChange,
    handleSubmitCallback,
    clearInputForm,
    handleSetTouchedInput
  } = useForm(initialInputList, handleSubmitForm);
  const {
    filterList,
    setFilterList,
    handleOnChangeFilter,
    handleOnAppyFilter,
  } = useFilter(initialFilterList, applyFilter);
  const {validateEmptyField,combineValidation} = useValidator()
  useEffect(() => {
    inputList.name.validators = [validateEmptyField]
  },[])
  function applyFilter() {
    let searchParams = "search=true&";
    const searchParamsTemp = "search=true&";
    for (const filter in filterList) {
      if (filterList[filter].isOpen) {
        searchParams += `${filter}=${filterList[filter].value}&`;
      }
    }
    if (searchParams === searchParamsTemp) {
      history.push({
        pathname: history.location.pathname,
        state: history.location.state,
      });
      // return dispatch(clear());
    }
    history.push({
      pathname: history.location.pathname,
      search: `?${searchParams}`,
      state: history.location.state,
    });
  }
  useEffect(() => {
    dispatch(getPositionListFromFirebase());
  }, [dispatch]);
  useEffect(() => {
    if (history.location.state) {
      dispatch(getPositionDetailsByIdFromFirebase(history.location.state));
    }
  }, [history.location.state, dispatch]);
  useEffect(() => {
    if (!isPositionDetailsLoading) {
      const addMemberDetailsValueToInputList = () => {
        const newList = { ...inputList };
        for (const input in newList) {
          newList[input].value = positionDetails[input];
        }
        setInputList(newList);
      };
      addMemberDetailsValueToInputList();
    }
  }, [isPositionDetailsLoading]);
  function handleSubmitForm() {
    if (!history.location.state) {
      return dispatch(createNewPositionToFirebase(inputList));
    }
    return dispatch(
      editPositionDetailsToFirebase({
        ...inputList,
        id: history.location.state,
      })
    );
  }
  function handleRemovePosition(id) {
    dispatch(removePositionFromFirebase(id));
  }
  function checkIsLoadingToViewLoadingIcon() {
    return (
      !isLoading &&
      !isPositionDetailsLoading &&
      !isEditting &&
      !isDeleting &&
      !isCreating
    );
  }
  return (
    <>
      {!checkIsLoadingToViewLoadingIcon() ? <FormLoading /> : ""}
      <div className="positionPage">
        <PageTitle
          description="Manage position"
          background={bg}
          title="Position"
          icon={<i className="fas fa-crosshairs"></i>}
        />
        <PageContent>
          <div className="searchBarWrapper">
            <Link
              to={{
                pathname: `${history.location.pathname}`,
                search: "?form=true",
                state: undefined,
              }}
              className="newBtn"
            >
              <Button onClick={clearInputForm}>
                NEW <i className="fas fa-plus"></i>
              </Button>
            </Link>
          </div>
          <FilterBar
            filterList={filterList}
            setFilterList={setFilterList}
            handleOnChangeFilter={handleOnChangeFilter}
            handleOnApplyFilter={handleOnAppyFilter}
          />
          <Table
            handleRemoveItem={handleRemovePosition}
            tablePropertyList={tablePropertyList}
            tableDataList={positionList}
          />
        </PageContent>
        {!isPositionDetailsLoading && (
          <FormModal
            title={
              history.location.state
                ? `Edit ${positionDetails.name} profile`
                : "Create a new position"
            }
            isContentLoading={isPositionDetailsLoading}
            clearForm={clearInputForm}
            handleSetTouchedInput={handleSetTouchedInput}
            handleSubmitForm={handleSubmitCallback}
            combineValidation={combineValidation}
            handleOnInputChange={handleOnInputChange}
            inputList={inputList}
            history={history}
          />
        )}
      </div>
    </>
  );
};

export default PositionPage;
