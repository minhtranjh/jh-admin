import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import bg from "../../assets/images/team-bg.jpeg";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createNewTeamToFirebase,
  editTeamDetailsToFirebase,
  getTeamDetailsByIdFromFirebase,
  getTeamListFromFirebase,
  removeTeamFromFirebase,
} from "../../redux/actions/team";
import { useEffect } from "react";
import useForm from "../../utils/useForm";
import PageContent from "../../components/PageContent/PageContent";
import Button from "../../components/Button/Button";
import FormModal from "../../components/FormModal/FormModal";
import Table from "../../components/Table/Table";
import FormLoading from "../../components/FormLoading/FormLoading";
import FilterBar from "../../components/FilterBar/FilterBar";
import { clearFilteredMemberList } from "../../redux/actions/member";
import useFilter from "../../utils/useFilter";
const tablePropertyList = [
  {
    label: "No.",
    render: ({ rowData, index }) => {
      return <span>{index + 1}.</span>;
    },
  },
  {
    label: "Team",
    render: ({ rowData }) => {
      return <span>{rowData.name}</span>;
    },
  },
  {
    label: "Leader",
    render: ({ rowData }) => {
      return (
        <span>{rowData.leader.lastName + " " + rowData.leader.firstName}</span>
      );
    },
  },
  {
    label: "Created At",
    render: ({ rowData }) => {
      return <span>{rowData.createdAt}</span>;
    },
  },
  {
    label: "Action",
    render: ({ rowData, handleRemoveItem, history }) => {
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
    placeholder: "Team name",
    name: "name",
    type: "text",
    // labelIcon: <i className="far fa-user"></i>,
  },
  leader: {
    value: "",
    placeholder: "Leader name",
    name: "leader",
    type: "select",
    options: [],
    optionLabel: "name",
    // labelIcon: <i className="far fa-user"></i>,
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
  createdAt: {
    label: "Created At",
    type: "date",
    name: "createdAt",
    value: "",
    isOpen: false,
  },
  leader: {
    label: "Leader",
    type: "radio",
    options: [],
    optionLabel: "name",
    name: "leader",
    value: "",
    isOpen: false,
  },
};
const TeamPage = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  const params = useParams();
  const {
    teamList,
    isLoading,
    isTeamDetailsLoading,
    teamDetails,
    isEditting,
    isDeleting,
    isCreating,
  } = useSelector((state) => state.team);
  const { isMemberDetailsLoading, memberList } = useSelector(
    (state) => state.member
  );
  const {
    inputList,
    setInputList,
    inputErrorList,
    handleOnChange,
    handleSubmitCallback,
    clearInputForm,
  } = useForm(initialInputList, validateInput, handleSubmitForm);
  const {
    filterList,
    setFilterList,
    handleOnChange: handleOnChangeFilter,
    handleSubmitCallback: handleOnAppyFilter,
  } = useFilter(initialFilterList, applyFilter);

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
      // return dispatch(clearFilteredMemberList());
    }
    history.push({
      pathname: history.location.pathname,
      search: `?${searchParams}`,
      state: history.location.state,
    });
  }
  function handleRemoveTeam(id) {
    dispatch(removeTeamFromFirebase(id));
  }
  useEffect(() => {
    dispatch(getTeamListFromFirebase());
  }, [dispatch]);
  useEffect(() => {
    if (history.location.state) {
      dispatch(getTeamDetailsByIdFromFirebase(history.location.state));
    }
  }, [history.location.state, dispatch]);
  useEffect(() => {
    if (!isMemberDetailsLoading) {
      const addMemberListValueToInputList = () => {
        const newList = { ...inputList };
        newList.leader.options = memberList;
        setInputList(newList);
      };
      addMemberListValueToInputList();
    }
  }, [isMemberDetailsLoading]);
  useEffect(() => {
    if (!isTeamDetailsLoading) {
      const addTeamDetailsValueToInputList = () => {
        const newList = { ...inputList };
        for (const input in newList) {
          newList[input].value = teamDetails[input];
        }
        setInputList(newList);
      };
      addTeamDetailsValueToInputList();
    }
  }, [isTeamDetailsLoading]);
  function handleSubmitForm() {
    if (!history.location.state) {
      return dispatch(createNewTeamToFirebase(inputList));
    }
    return dispatch(
      editTeamDetailsToFirebase({
        ...inputList,
        id: history.location.state,
      })
    );
  }
  function validateInput(fields = initialInputList) {
    if ("name" in fields) {
      inputErrorList.name =
        fields.name.value.length <= 0 ? "This field must be not empty" : "";
    }
    return inputErrorList;
  }
  function checkIsLoadingToViewLoadingIcon() {
    return (
      !isLoading &&
      !isTeamDetailsLoading &&
      !isEditting &&
      !isDeleting &&
      !isCreating
    );
  }
  return (
    <>
      {!checkIsLoadingToViewLoadingIcon() ? <FormLoading /> : ""}
      <div className="teamPage">
        <PageTitle
          title=" Team"
          description="Manage Team"
          background={bg}
          icon={<i className="fas fa-users"></i>}
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
            handleOnChange={handleOnChangeFilter}
            handleOnApplyFilter={handleOnAppyFilter}
          />
          <Table
            handleRemoveItem={handleRemoveTeam}
            tablePropertyList={tablePropertyList}
            tableDataList={teamList}
          />
        </PageContent>
        {!isTeamDetailsLoading && (
          <FormModal
            title={
              history.location.state
                ? `Edit ${teamDetails.name} profile`
                : "Create a new position"
            }
            clearForm={clearInputForm}
            isContentLoading={isMemberDetailsLoading}
            handleSubmitForm={handleSubmitCallback}
            inputErrorList={inputErrorList}
            handleOnChange={handleOnChange}
            inputList={inputList}
            history={history}
          />
        )}
      </div>
    </>
  );
};

export default TeamPage;
