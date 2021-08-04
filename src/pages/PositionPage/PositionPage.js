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
  clearFilterPositionList,
  createNewPositionToFirebase,
  editPositionDetailsToFirebase,
  filterListPosition,
  getPositionDetailsByIdFromFirebase,
  getPositionListFromFirebase,
  removePositionFromFirebase,
} from "../../redux/actions/position";
import FormModal from "../../components/FormModal/FormModal";
import FormLoading from "../../components/FormLoading/FormLoading";
import FilterBar from "../../components/FilterBar/FilterBar";
import useFilter from "../../utils/useFilter";
import useValidator from "../../utils/useValidator";
import useQuery from "../../utils/useQuery";
import { useRef } from "react";
import NotifyDialog from "../../components/NotifyDialog/NotifyDialog";
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
    render: ({ rowData, history, rowHandlers }) => {
      return (
        <div className="tableAction">
          <button
            onClick={() => rowHandlers.handleRemovePosition(rowData.id)}
            className="tableWidgetBtn"
          >
            <i className="far fa-trash-alt"></i>
          </button>
          <Link
            to={{
              pathname: `${history.location?.pathname}`,
              search: `?form=true&id=${rowData.id}`,
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
    isTouched: false,
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
  const query = useQuery();
  const params = useParams();
  const {
    positionList,
    isLoading,
    isPositionDetailsLoading,
    positionDetails,
    isEditting,
    filteredPositionList,
    isFiltering,
    isDeleting,
    isCreating,
    error,
    message
  } = useSelector((state) => state.position);
  const {
    inputList,
    setInputList,
    handleOnInputChange,
    handleSubmitCallback,
    clearInputForm,
    handleSetTouchedInput,
  } = useForm(initialInputList, handleSubmitForm);
  const {
    filterList,
    setFilterList,
    handleCreateFilterObject,
    handleOnChangeFilter,
    handleOnAppyFilter,
  } = useFilter(initialFilterList, applyFilter);
  const firstRender = useRef(true);
  const { validateEmptyField } = useValidator();
  useEffect(() => {
    inputList.name.validators = [validateEmptyField("Field must be not empty")];
  }, []);
  useEffect(() => {
    const handleFilterMemberList = () => {
      if (history.location.search && query.get("search") && !isLoading) {
        const filterObj = handleCreateFilterObject();
        if (positionList.length > 0) {
          return dispatch(filterListPosition(filterObj));
        }
      }
    };
    handleFilterMemberList();
  }, [history.location.search, isLoading]);
  useEffect(() => {
    dispatch(getPositionListFromFirebase());
  }, [dispatch]);
  useEffect(() => {
    const id = query.get("id");
    if (id && query.get("form")) {
      dispatch(getPositionDetailsByIdFromFirebase(id));
    }
  }, [history.location.search]);
  useEffect(() => {
    if (!isPositionDetailsLoading) {
      const newList = { ...inputList };
      for (const input in newList) {
        newList[input].value = positionDetails[input];
      }
      setInputList(newList);
    }
  }, [isPositionDetailsLoading]);
  useEffect(() => {
    updateSearchParams();
  }, [isEditting, isCreating]);
  function updateSearchParams() {
    if (firstRender.current) {
      firstRender.current = false;
      history.push({
        pathname: history.location.pathname,
        search: history.location.search,
      });
      return;
    }
    if (!isEditting && !isCreating) {
      history.push({
        pathname: history.location.pathname,
        search: undefined,
      });
    }
  }
  const clearFilterUrlParam = () => {
    history.push({
      pathname: history.location.pathname,
      search: "",
    });
  };
  const pushFilterListToSearchParam = (filterListSearchParams) => {
    history.push({
      pathname: history.location.pathname,
      search: `?${filterListSearchParams}`,
    });
  };
  function applyFilter(filterListSearchParams) {
    const filterListSearchParamsTemp = "search=true&";
    if (filterListSearchParams === filterListSearchParamsTemp) {
      clearFilterUrlParam();
      dispatch(clearFilterPositionList());
      return;
    }
    pushFilterListToSearchParam(filterListSearchParams);
  }

  function handleSubmitForm(position) {
    if (!query.get("id")) {
      return dispatch(createNewPositionToFirebase(position));
    }
    return dispatch(
      editPositionDetailsToFirebase({
        ...position,
        id: query.get("id"),
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
      <NotifyDialog message={message} error={error}/>

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
            rowHandlers={{ handleRemovePosition }}
            tablePropertyList={tablePropertyList}
            tableDataList={
              !isFiltering && filteredPositionList.length <= 0
                ? positionList
                : filteredPositionList
            }
          />
        </PageContent>
        {!isPositionDetailsLoading && (
          <FormModal
            title={
              query.get("id")
                ? `Edit position`
                : "Create a new position"
            }
            isContentLoading={isPositionDetailsLoading}
            clearForm={clearInputForm}
            handleSetTouchedInput={handleSetTouchedInput}
            handleSubmitForm={handleSubmitCallback}
            handleOnInputChange={handleOnInputChange}
            inputList={inputList}
            history={history}
            isModalOpen={!!query.get("form")}
            error={error}

          />
        )}
      </div>
    </>
  );
};

export default PositionPage;
