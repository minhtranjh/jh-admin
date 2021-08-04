import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import bg from "../../assets/images/team-bg.jpeg";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  clearFilteredTeamList,
  createNewTeamToFirebase,
  editTeamDetailsToFirebase,
  filterTeamList,
  getTeamByLeaderFromFirebase,
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
import {
  clearFilteredMemberList,
  getListMembersFromFirebase,
} from "../../redux/actions/member";
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
    label: "Team",
    render: ({ rowData }) => {
      return <span>{rowData.name}</span>;
    },
  },
  {
    label: "Leader",
    render: ({ rowData }) => {
      return <span>{rowData.leader}</span>;
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
    render: ({ rowData, rowHandlers, history }) => {
      return (
        <div className="tableAction">
          <button
            onClick={() => rowHandlers.handleRemoveTeam(rowData.id)}
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
  const firstRender = useRef(true);
  const dispatch = useDispatch();
  const params = useParams();
  const query = useQuery();
  const {
    teamList,
    isLoading,
    isTeamDetailsLoading,
    teamDetails,
    isEditting,
    filteredTeamList,
    isFiltering,
    isDeleting,
    isCreating,
    error,
    message,
    teamByLeader,
  } = useSelector((state) => state.team);
  const { memberList, isLoading: isMemberListLoading } = useSelector(
    (state) => state.member
  );
  const {
    inputList,
    setInputList,
    handleOnInputChange,
    handleSubmitCallback,
    handleSetTouchedInput,
    clearInputForm,
    setValueToInputValue,
  } = useForm(initialInputList, handleSubmitForm);
  const {
    filterList,
    setFilterList,
    handleCreateFilterObject,
    handleOnChangeFilter,
    handleOnAppyFilter,
  } = useFilter(initialFilterList, applyFilter);
  const { validateEmptyField } = useValidator();
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
      dispatch(clearFilteredTeamList());
      return;
    }
    pushFilterListToSearchParam(filterListSearchParams);
  }
  useEffect(() => {
    if (history.location.search && query.get("search") && !isLoading) {
      const filterObj = handleCreateFilterObject();
      if (teamList.length > 0) {
        return dispatch(filterTeamList(filterObj));
      }
    }
  }, [history.location.search, isLoading]);

  function handleRemoveTeam(id) {
    dispatch(removeTeamFromFirebase(id));
  }
  useEffect(() => {
    dispatch(getTeamListFromFirebase());
  }, [dispatch]);
  useEffect(() => {
    const id = query.get("id");
    if (id && query.get("form")) {
      dispatch(getTeamDetailsByIdFromFirebase(id));
    }
  }, [history.location.search, dispatch]);
  useEffect(() => {
    dispatch(getListMembersFromFirebase());
  }, []);

  useEffect(() => {
    inputList.name.validators = [validateEmptyField("Field must be not empty")];
    inputList.leader.validators = [
      validateEmptyField("Field must be not empty"),
    ];
  }, []);
  useEffect(() => {
    if (!isTeamDetailsLoading && JSON.stringify(teamDetails) != "{}") {
      setValueToInputValue(teamDetails);
    }
  }, [isTeamDetailsLoading]);
  useEffect(() => {
    if (!isMemberListLoading) {
      const newInputList = { ...inputList };
      const newFilterList = { ...filterList };
      newFilterList.leader.options = memberList;
      newInputList.leader.options = memberList;
      setFilterList(newFilterList);
      setInputList(newInputList);
    }
  }, [isMemberListLoading]);
  useEffect(() => {
    if (!isEditting &&  !isCreating) {
      updateSearchParams();
    }
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
  useEffect(() => {
    if (JSON.stringify(teamByLeader) === "{}") {
      history.goBack();
    }
  }, [teamByLeader]);
  function handleSubmitForm(team) {
    if (!query.get("id")) {
      return dispatch(createNewTeamToFirebase(team));
    }
    dispatch(
      editTeamDetailsToFirebase({
        ...team,
        id: query.get("id"),
      })
    );
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
      <NotifyDialog message={message} error={error} />
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
            rowHandlers={{ handleRemoveTeam }}
            tablePropertyList={tablePropertyList}
            tableDataList={
              !isFiltering && filteredTeamList.length <= 0
                ? teamList
                : filteredTeamList
            }
          />
        </PageContent>
        {!isTeamDetailsLoading && (
          <FormModal
            title={query.get("id") ? `Edit team` : "Create a new team"}
            isContentLoading={isTeamDetailsLoading}
            clearForm={clearInputForm}
            handleSetTouchedInput={handleSetTouchedInput}
            handleSubmitForm={handleSubmitCallback}
            handleOnInputChange={handleOnInputChange}
            inputList={inputList}
            history={history}
            isModalOpen={!!query.get("form")}
            error={error}
            teamByLeader={teamByLeader}
          />
        )}
      </div>
    </>
  );
};

export default TeamPage;
